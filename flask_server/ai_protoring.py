import cv2
import math
import json
from face_detector import FaceMeshDetector
from utils import get_eye_center, detect_pupil
import os

def analyze_image(image_path, model, output_dir):
    # Load the image
    img = cv2.imread(image_path)
    image_name = os.path.basename(image_path)
    results = model(image_path)
    detected_objects = results[0].boxes.data.numpy()
    object_names = model.names

    # Initialize counts
    phone_count = 0
    person_count = 0

    # Iterate through detected objects
    for obj in detected_objects:
        class_id = int(obj[5])
        if object_names[class_id] == 'cell phone':
            phone_count += 1
            # Draw bounding box for phone
            x1, y1, x2, y2 = map(int, obj[:4])
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 1)  # Green box for phone
            cv2.putText(img, 'phone', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        elif object_names[class_id] == 'person':
            person_count += 1
            # Draw bounding box for person
            x1, y1, x2, y2 = map(int, obj[:4])
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 1)  # Blue box for person
            cv2.putText(img, 'person', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    # Determine conditions
    extra_person = person_count > 1
    no_person = person_count == 0

    # Face mesh detection
    face_detector = FaceMeshDetector()
    img, faces = face_detector.findFaceMesh(img)
    json_result = {"mobile_phone": phone_count > 0, "extra_person": extra_person, "no_person": no_person, "mouth_open": False, "eye_gaze": "center"}

    if len(faces) != 0:
        x1, y1 = faces[0][159]  # Left eye upper
        x2, y2 = faces[0][145]  # Left eye lower
        x3, y3 = faces[0][386]  # Right eye upper
        x4, y4 = faces[0][374]  # Right eye lower
        x5, y5 = faces[0][13]  # Mouth upper
        x6, y6 = faces[0][14]  # Mouth lower
        nose_tip = faces[0][1]  # Nose tip

        left_eye_points = [faces[0][33], faces[0][133], faces[0][160], faces[0][159], faces[0][158], faces[0][144], faces[0][145], faces[0][153]]
        right_eye_points = [faces[0][362], faces[0][385], faces[0][387], faces[0][386], faces[0][374], faces[0][373], faces[0][390], faces[0][249]]

        left_eye_center = get_eye_center(left_eye_points)
        right_eye_center = get_eye_center(right_eye_points)

        # Extract eye images for pupil detection
        left_eye_bbox = [min([p[0] for p in left_eye_points]), min([p[1] for p in left_eye_points]),
                         max([p[0] for p in left_eye_points]), max([p[1] for p in left_eye_points])]
        right_eye_bbox = [min([p[0] for p in right_eye_points]), min([p[1] for p in right_eye_points]),
                          max([p[0] for p in right_eye_points]), max([p[1] for p in right_eye_points])]

        left_eye_img = img[left_eye_bbox[1]:left_eye_bbox[3], left_eye_bbox[0]:left_eye_bbox[2]]
        right_eye_img = img[right_eye_bbox[1]:right_eye_bbox[3], right_eye_bbox[0]:right_eye_bbox[2]]

        left_pupil = detect_pupil(left_eye_img)
        right_pupil = detect_pupil(right_eye_img)

        if left_pupil:
            cv2.circle(left_eye_img, left_pupil, 3, (0, 0, 255), -1)
        if right_pupil:
            cv2.circle(right_eye_img, right_pupil, 3, (0, 0, 255), -1)

        # Calculate length of mouth
        lenOfMouth = math.hypot(x6 - x5, y6 - y5)

        # Mouth bounding box
        min_x_mouth = min(x5, x6)
        max_x_mouth = max(x5, x6)
        min_y_mouth = min(y5, y6)
        max_y_mouth = max(y5, y6)

        # Eye bounding boxes for visualization
        left_eye_bbox = [(left_eye_bbox[0], left_eye_bbox[1]), (left_eye_bbox[2], left_eye_bbox[3])]
        right_eye_bbox = [(right_eye_bbox[0], right_eye_bbox[1]), (right_eye_bbox[2], right_eye_bbox[3])]

        # Gaze direction
        gaze_direction = "center"
        if left_pupil and right_pupil:
            if left_pupil[0] < left_eye_img.shape[1] // 2 and right_pupil[0] < right_eye_img.shape[1] // 2:
                gaze_direction = "left"
            elif left_pupil[0] > left_eye_img.shape[1] // 2 and right_pupil[0] > right_eye_img.shape[1] // 2:
                gaze_direction = "right"

        json_result["eye_gaze"] = gaze_direction

        # Determine mouth status
        json_result["mouth_open"] = lenOfMouth > 5

        # Draw bounding boxes and annotations
        cv2.rectangle(img, (min_x_mouth, min_y_mouth - 10), (max_x_mouth, max_y_mouth + 10), (0, 255, 0), 1)
        cv2.putText(img, "MOUTH " + ("OPEN" if json_result["mouth_open"] else "CLOSED"), (min_x_mouth, min_y_mouth - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        cv2.rectangle(img, left_eye_bbox[0], left_eye_bbox[1], (255, 0, 0), 2)
        cv2.putText(img, f"EYE GAZE {gaze_direction.upper()}", (left_eye_bbox[0][0], left_eye_bbox[0][1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

        cv2.rectangle(img, right_eye_bbox[0], right_eye_bbox[1], (255, 0, 0), 2)

        # Draw nose tip
        cv2.circle(img, (nose_tip[0], nose_tip[1]), 2, (0, 255, 255), -1)
        cv2.putText(img, "NOSE", (nose_tip[0] + 10, nose_tip[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

    cv2.imwrite(output_dir+"result_"+image_name, img)

    return json_result