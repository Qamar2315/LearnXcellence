import cv2
import math
import json
from face_detector import FaceMeshDetector
from utils import get_eye_center, detect_pupil
import os

def analyze_image(image_path, model, output_dir):
    """
    Analyze an image to detect mobile phones, people, and face features.
    
    Args:
        image_path (str): Path to the image file.
        model: Object detection model.
        output_dir (str): Directory where output images and results will be saved.
    
    Returns:
        dict: JSON-compatible dictionary with analysis results.
    """
    
    # Load the image from the given path
    img = cv2.imread(image_path)
    image_name = os.path.basename(image_path)  # Extract the image file name
    
    # Use the model to detect objects in the image
    results = model(image_path)
    detected_objects = results[0].boxes.data.numpy()  # Detected object details
    object_names = model.names  # Mapping of class IDs to object names

    # Initialize counts for detected phones and persons
    phone_count = 0
    person_count = 0

    # Iterate through detected objects and count relevant ones
    for obj in detected_objects:
        class_id = int(obj[5])  # Class ID of the detected object
        x1, y1, x2, y2 = map(int, obj[:4])  # Bounding box coordinates

        if object_names[class_id] == 'cell phone':
            phone_count += 1
            # Draw bounding box and label for detected phone
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 1)
            cv2.putText(img, 'phone', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        elif object_names[class_id] == 'person':
            person_count += 1
            # Draw bounding box and label for detected person
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 1)
            cv2.putText(img, 'person', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    # Conditions based on detected people
    extra_person = person_count > 1  # More than one person
    no_person = person_count == 0  # No person detected

    # Initialize face mesh detector
    face_detector = FaceMeshDetector()
    img, faces = face_detector.findFaceMesh(img)
    
    # Initialize result dictionary
    json_result = {
        "mobile_phone": phone_count > 0,
        "extra_person": extra_person,
        "no_person": no_person,
        "mouth_open": False,
        "eye_gaze": "center"
    }

    # If faces are detected, proceed with further analysis
    if faces:
        face = faces[0]  # Assume first detected face for analysis
        nose_tip = face[1]  # Coordinates of the nose tip

        # Define key face points for eyes and mouth
        left_eye_points = [face[i] for i in [33, 133, 160, 159, 158, 144, 145, 153]]
        right_eye_points = [face[i] for i in [362, 385, 387, 386, 374, 373, 390, 249]]
        mouth_upper = face[13]
        mouth_lower = face[14]

        # Calculate center of eyes
        # left_eye_center = get_eye_center(left_eye_points)
        # right_eye_center = get_eye_center(right_eye_points)

        # Detect pupils in eye images
        left_eye_img = img[min([p[1] for p in left_eye_points]):max([p[1] for p in left_eye_points]),
                           min([p[0] for p in left_eye_points]):max([p[0] for p in left_eye_points])]
        right_eye_img = img[min([p[1] for p in right_eye_points]):max([p[1] for p in right_eye_points]),
                            min([p[0] for p in right_eye_points]):max([p[0] for p in right_eye_points])]

        left_pupil = detect_pupil(left_eye_img)
        right_pupil = detect_pupil(right_eye_img)

        # Mark detected pupils on the image
        if left_pupil:
            cv2.circle(left_eye_img, left_pupil, 3, (0, 0, 255), -1)
        if right_pupil:
            cv2.circle(right_eye_img, right_pupil, 3, (0, 0, 255), -1)

        # Calculate mouth length to determine if it is open
        mouth_length = math.hypot(mouth_lower[0] - mouth_upper[0], mouth_lower[1] - mouth_upper[1])
        json_result["mouth_open"] = mouth_length > 5

        # Determine gaze direction based on pupil position
        gaze_direction = "center"
        if left_pupil and right_pupil:
            if left_pupil[0] < left_eye_img.shape[1] // 2 and right_pupil[0] < right_eye_img.shape[1] // 2:
                gaze_direction = "left"
            elif left_pupil[0] > left_eye_img.shape[1] // 2 and right_pupil[0] > right_eye_img.shape[1] // 2:
                gaze_direction = "right"

        json_result["eye_gaze"] = gaze_direction

        # Draw annotations for mouth, eyes, and nose
        cv2.rectangle(img, (min(mouth_upper[0], mouth_lower[0]), min(mouth_upper[1], mouth_lower[1]) - 10),
                      (max(mouth_upper[0], mouth_lower[0]), max(mouth_upper[1], mouth_lower[1]) + 10), (0, 255, 0), 1)
        cv2.putText(img, f"MOUTH {'OPEN' if json_result['mouth_open'] else 'CLOSED'}",
                    (mouth_upper[0], mouth_upper[1] - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        cv2.putText(img, f"EYE GAZE {gaze_direction.upper()}",
                    (left_eye_points[0][0], left_eye_points[0][1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

        # Draw nose tip
        cv2.circle(img, (nose_tip[0], nose_tip[1]), 2, (0, 255, 255), -1)
        cv2.putText(img, "NOSE", (nose_tip[0] + 10, nose_tip[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

    # Save the annotated image to the output directory
    cv2.imwrite(os.path.join(output_dir, f"result_{image_name}"), img)

    return json_result
