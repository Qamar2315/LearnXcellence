import face_recognition
import cv2
import os
# from test import test
from spoof_detector import is_real_image

# Define a threshold for face matching
FACE_MATCH_THRESHOLD = 0.4


def verify_face(image_path, known_face_encoding, model):
    """
    Verify if the face encoding matches the face in the provided image path.

    :param image_path: Path to the image file.
    :param known_face_encoding: The face encoding to compare with.
    :return: A tuple containing a success flag, result or error message.
    """
    if not image_path:
        return False, "No image path provided"

    if not os.path.exists(image_path):
        return False, "Image not found"

    try:
        # Load the image
        image = face_recognition.load_image_file(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) == 0:
            return False, "No face detected"

        # isReal = test(device_id=0, model_dir="./resources/anti_spoof_models", image_path=image_path)
        isReal = is_real_image(image_path, model, threshold=0.6)

        if not isReal:
            return False, "Fake face detected"

        # Calculate the distance between the known face encoding and the first face encoding found
        face_distances = face_recognition.face_distance([known_face_encoding], face_encodings[0])
        # Compare the distance to the threshold
        match = face_distances[0] <= FACE_MATCH_THRESHOLD
        
        return match, "Faces match" if match else "Faces do not match."

    except Exception as e:
        return False, str(e)
