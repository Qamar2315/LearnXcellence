import math

def is_real_image(image_path, model, threshold=0.6):
    """
    Determines if an image is real or fake using a pre-trained model.

    Parameters:
    - image_path (str): Path to the image to be evaluated.
    - model           : Pre-trained model.
    - threshold (float): Threshold for determining if an image is real or fake. Default is 0.6.

    Returns:
    - bool: True if the image is real, False if fake.
    """
    class_names = ["fake", "real"]
    results = model(image_path)
    
    for result in results:
        for box in result.boxes:
            # Confidence
            confidence = math.ceil((box.conf[0] * 100)) / 100
            # Class Name
            class_id = int(box.cls[0])
            
            if confidence > threshold:
                return class_names[class_id] == 'real'
    
    return False
