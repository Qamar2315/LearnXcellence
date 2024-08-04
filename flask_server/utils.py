import cv2

def get_eye_center(eye_points):
    x_coords = [p[0] for p in eye_points]
    y_coords = [p[1] for p in eye_points]
    center_x = sum(x_coords) / len(x_coords)
    center_y = sum(y_coords) / len(y_coords)
    return (center_x, center_y)


def detect_pupil(eye_img):
    gray_eye = cv2.cvtColor(eye_img, cv2.COLOR_BGR2GRAY)
    _, threshold_eye = cv2.threshold(gray_eye, 30, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(threshold_eye, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=lambda x: cv2.contourArea(x), reverse=True)
    if contours:
        (x, y, w, h) = cv2.boundingRect(contours[0])
        pupil_center = (x + w // 2, y + h // 2)
        return pupil_center
    return None