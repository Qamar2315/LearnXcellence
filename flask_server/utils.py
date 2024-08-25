import cv2
import numpy as np

def get_eye_center(eye_points):
    x_coords = [p[0] for p in eye_points]
    y_coords = [p[1] for p in eye_points]
    center_x = sum(x_coords) / len(x_coords)
    center_y = sum(y_coords) / len(y_coords)
    return (int(center_x), int(center_y))

def detect_pupil(eye_img):
    gray_eye = cv2.cvtColor(eye_img, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian Blur to reduce noise
    blurred_eye = cv2.GaussianBlur(gray_eye, (7, 7), 0)
    
    # Apply adaptive thresholding
    threshold_eye = cv2.adaptiveThreshold(
        blurred_eye, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY_INV, 11, 3
    )
    
    # Find contours
    contours, _ = cv2.findContours(threshold_eye, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=lambda x: cv2.contourArea(x), reverse=True)
    
    for contour in contours:
        (x, y, w, h) = cv2.boundingRect(contour)
        
        # Validate contour: it should be roughly circular and within a reasonable size
        aspect_ratio = w / float(h)
        area = cv2.contourArea(contour)
        
        if 0.8 < aspect_ratio < 1.2 and 50 < area < 200:
            pupil_center = (x + w // 2, y + h // 2)
            return pupil_center
    
    return None
