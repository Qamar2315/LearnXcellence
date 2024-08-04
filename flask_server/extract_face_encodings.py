import face_recognition
import cv2
import os
# from test import test
from spoof_detector import is_real_image

def extract_face_encodings(image_path,model):
    """
    Extract face encodings from the given image path.
    
    :param image_path: Path to the image file.
    :return: A tuple containing a success flag, encoding or error message.
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
        
        # isReal = test(device_id=0,model_dir="./resources/anti_spoof_models",image_path=image_path)
        isReal = is_real_image(image_path,model,threshold=0.5)
        
        if not isReal:
            return False, "Fake face detected"
            
        face_encoding = face_encodings[0]

        return True, face_encoding.tolist()

    except Exception as e:
        return False, str(e)
