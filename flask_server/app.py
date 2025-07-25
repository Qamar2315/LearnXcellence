from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extract_face_encodings import extract_face_encodings
from verify_face import verify_face
import numpy as np
from ultralytics import YOLO
from ai_protoring import analyze_image
import joblib
from cheating_detection import predict_cheating_probability
from otp_utils import generate_otp, send_otp
from send_email import send_verification_email, send_password_reset_mail

# from send_verification_email import send_verification_email

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get the allowed origin from the .env file
allowed_origin = os.getenv('ALLOWED_ORIGIN')

# Configure CORS to allow only the specified origin
CORS(app, resources={r"/*": {"origins": allowed_origin}})

# Load the pre-trained model for detecting fake images
# model = load_model("./models/face_antispoofing_model.keras")
model= YOLO("./models/yolo_custom_model.pt")
model_yolo = YOLO("./models/yolov8x.pt")
loaded_model = joblib.load("./models/cheating_detection_model.pkl")

protoring_output_dir = os.getenv('PROCTORING_OUTPUT_DIR')

@app.route('/')
def home():
    return jsonify(message="Hello, World!")

@app.route('/register-face', methods=['POST'])
def register_face():
    try:
        # Get the image path from the request
        data = request.json
        image_path = data.get('image_path')
        if not image_path:
            return jsonify(error="No image path provided")
        
        success, result = extract_face_encodings(image_path,model)
        
        if not success:
            return jsonify(success=False,error=result)

        return jsonify(success=True,encoding=result)

    except Exception as e:
        return jsonify(success=False,error=str(e)), 500

@app.route('/verify-face', methods=['POST'])
def verify_face_api():
    try:
        data = request.json
        image_path = data.get('image_path')
        known_face_encoding = data.get('known_face_encoding')
        if not image_path or not known_face_encoding:
            return jsonify(error="Image path or known face encoding not provided"), 400
        
        # Convert the known face encoding from list to numpy array
        known_face_encoding = np.array([float(num) for num in known_face_encoding])
        
        success, result = verify_face(image_path, known_face_encoding,model)

        if not success:
            return jsonify(success=False,error=result)

        return jsonify(success=True,match=result)

    except Exception as e:
        return jsonify(success=False,error=str(e)), 500

@app.route('/generate-otp', methods=['POST'])
def generate_otp_api():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify(error="Email not provided"), 400
        
        # Generate OTP
        otp = generate_otp()
        
        # Send OTP to email
        try:
            otp = send_otp(email, otp)
            return jsonify(success=True,message="OTP sent successfully",otp=otp)
        except Exception as e:
            return jsonify(succes=False, error=f"Failed to send OTP: {str(e)}"), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/send-verification-email', methods=['POST'])
def send_verification_mail():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        
        if not email:
            return jsonify(error="Email not provided"), 400
        if not name:
            return jsonify(error="Name not provided"), 400
        # Send success email
        try:
            send_verification_email(name, email)
            return jsonify(success=True,message="Verification email sent successfully")
        except Exception as e:
            return jsonify(succes=False, error=f"Failed to send Verification email {str(e)}"), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/analyze-image', methods=['POST'])
def analyze_image_api():
    try:
        data = request.json
        image_path = data.get('image_path')

        if not image_path or not os.path.exists(image_path):
            return jsonify(error="Image path not provided or does not exist"), 400

        # Call the analyze_image function
        try:
            result_json = analyze_image(image_path, model=model_yolo, output_dir=protoring_output_dir)
            return jsonify(success=True, message="Image analyzed successfully", data=result_json)
        except Exception as e:
            return jsonify(success=False, error=f"Failed to analyze image: {str(e)}"), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/predict-cheating', methods=['POST'])
def predict_cheating_api():
    try:
        data = request.json
        features = data.get('features')

        if not features or not isinstance(features, list) or len(features) != 6:
            return jsonify(error="Features not provided or invalid format"), 400

        try:
            probabilities = predict_cheating_probability(features, loaded_model)
            return jsonify(success=True, message="Prediction successful", data=probabilities)
        except Exception as e:
            return jsonify(success=False, error=f"Failed to predict cheating: {str(e)}"), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/send-password-reset-email', methods=['POST'])
def send_password_reset_email():
    try:
        data = request.json
        user_id = data.get('user_id')
        name = data.get('name')
        email = data.get('email')
        token = data.get('token')

        if not user_id:
            return jsonify(error="User ID not provided"), 400
        if not email:
            return jsonify(error="Email not provided"), 400
        if not token:
            return jsonify(error="Token not provided"), 400

        reset_link = f"http://localhost:3000/reset-password/{user_id}/{token}"
        
        try:
            send_password_reset_mail(name ,email, reset_link)
            return jsonify(success=True, message="Password reset email sent successfully")
        except Exception as e:
            return jsonify(success=False, error=f"Failed to send password reset email: {str(e)}"), 500
    except Exception as e:
        return jsonify(error=str(e)), 500


if __name__ == '__main__':
    app.run(debug=True)
