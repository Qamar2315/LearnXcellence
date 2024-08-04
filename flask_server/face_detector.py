import cv2
import mediapipe as mp

class FaceMeshDetector:
    def __init__(self, staticMode=False, maxFaces=2, refineLandmarks=True, minDetectionCon=0.5, minTrackingCon=0.5):
        self.staticMode = staticMode
        self.maxFaces = maxFaces
        self.refineLandmarks = refineLandmarks
        self.minDetectionCon = minDetectionCon
        self.minTrackingCon = minTrackingCon

        self.mpDraw = mp.solutions.drawing_utils
        self.mpFaceMesh = mp.solutions.face_mesh
        self.faceMesh = self.mpFaceMesh.FaceMesh(self.staticMode, self.maxFaces, self.refineLandmarks, self.minDetectionCon, self.minTrackingCon)

    def findFaceMesh(self, img):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.faceMesh.process(imgRGB)
        faces = []
        if results.multi_face_landmarks:
            for facelandmarks in results.multi_face_landmarks:
                face = []
                for id, lm in enumerate(facelandmarks.landmark):
                    ih, iw, ic = img.shape
                    x, y = int(lm.x * iw), int(lm.y * ih)
                    face.append([x, y])
                faces.append(face)
        return img, faces