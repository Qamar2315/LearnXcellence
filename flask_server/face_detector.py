import cv2
import mediapipe as mp

class FaceMeshDetector:
    def __init__(self, staticMode=False, maxFaces=2, refineLandmarks=True, minDetectionCon=0.5, minTrackingCon=0.5):
        """
        Initializes the FaceMeshDetector with parameters for face mesh detection.

        :param staticMode: If true, detection is done on every frame.
        :param maxFaces: Maximum number of faces to detect.
        :param refineLandmarks: Refine landmarks for accurate detection.
        :param minDetectionCon: Minimum confidence value for detection.
        :param minTrackingCon: Minimum confidence value for tracking.
        """
        self.staticMode = staticMode
        self.maxFaces = maxFaces
        self.refineLandmarks = refineLandmarks
        self.minDetectionCon = minDetectionCon
        self.minTrackingCon = minTrackingCon

        self.mpDraw = mp.solutions.drawing_utils
        self.mpFaceMesh = mp.solutions.face_mesh
        self.faceMesh = self.mpFaceMesh.FaceMesh(
            self.staticMode,
            self.maxFaces,
            self.refineLandmarks,
            self.minDetectionCon,
            self.minTrackingCon
        )
        self.drawSpec = self.mpDraw.DrawingSpec(thickness=1, circle_radius=1, color=(0, 255, 0))

    def findFaceMesh(self, img):
        """
        Finds the face mesh landmarks in the given image.

        :param img: The image in which to find face mesh.
        :return: The image with drawn face mesh and the list of detected face landmarks.
        """
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
                # Draw the face mesh on the image
                self.mpDraw.draw_landmarks(img, facelandmarks, self.mpFaceMesh.FACEMESH_CONTOURS, self.drawSpec, self.drawSpec)
        return img, faces
