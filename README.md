# LearnXcellence: AI-Powered Learning Management System for Project-Based Courses

**LearnXcellence** is a comprehensive Learning Management System (LMS) designed specifically for project-based learning environments. It empowers both students and teachers with advanced features, streamlining project management, collaboration, and assessment processes.

## Key Features:

**Project-Centric Learning:**

- **Project Creation and Management:** Students can easily create, manage, and collaborate on project proposals, documents, and presentations within the platform.
- **Group Formation and Collaboration:** Facilitates efficient group formation, allowing students to work together seamlessly on project tasks, share resources, and communicate effectively.
- **Project Tracking and Status Updates:** Real-time tracking of project progress, enabling students and teachers to monitor milestones, deadlines, and overall status.
- **Project Feedback and Evaluation:** Streamlined feedback mechanisms for teachers to provide constructive criticism, track student progress, and assess project outcomes.

**AI-Powered Proctoring:**

- **Live Proctoring During Quizzes:** Utilizes webcam monitoring and AI algorithms to detect potential cheating behaviors like mobile phone usage, presence of extra persons, or suspicious eye movements.
- **Cheating Probability Analysis:** Generates comprehensive proctoring reports with cheating probability scores, providing insights to teachers about potential academic misconduct.
- **PDF Report Generation:** Creates detailed PDF reports that include cheating indicators, timestamps, and flagged images, assisting teachers in evaluating student behavior during assessments.

**Assessment and Evaluation:**

- **Quiz Creation and Management:** Teachers can create and manage quizzes with various question types, set time limits, and track student performance.
- **Automated Quiz Grading:** Automated grading for multiple-choice questions, saving teachers time and ensuring accurate assessment.
- **Submission Management:** Students can submit assignments and projects electronically, with the platform facilitating secure storage and organization of submitted materials.
- **Feedback and Grading:** Teachers can provide personalized feedback on submissions, assign grades, and track student progress over time.

**Enhanced Communication and Collaboration:**

- **Announcements and Notifications:** Facilitates timely communication between teachers and students through announcements, notifications, and personalized messages.
- **Discussion Forums:** Encourages student interaction and peer-to-peer learning through course-specific discussion forums, fostering a collaborative learning environment.

## Technologies Used:

**Backend:** Node.js, Express.js, MongoDB
**Frontend:** React.js, Material-UI (or your preferred UI library)
**AI Proctoring:** Python, OpenCV, Face Recognition, MediaPipe, TensorFlow, Flask
**PDF Generation:** PDFKit (Node.js library)
**Others:** JWT (JSON Web Token), bcrypt.js (password hashing), dotenv (environment variables), nodemailer (email sending)

## Installation and Setup:

**Backend (Node.js/Express.js):**

1. Install Node.js and npm (Node Package Manager).
2. Clone this repository: `git clone https://github.com/qamar2315/LearnXcellence`
3. Navigate to the backend directory: `cd LearnXcellence/backend`
4. Install dependencies: `npm install`
5. Set up environment variables (MongoDB connection string, JWT secret key, etc.) in a `.env` file.
6. Start the server: `npm start`

**Frontend (React.js):**

1. Install Node.js and npm.
2. Navigate to the frontend directory: `cd LearnXcellence/frontend`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

**AI Proctoring (Python/Flask):**

1. Install Python and pip (Python Package Installer).
2. Install required libraries: `pip install -r requirements.txt`
3. Set up environment variables (Flask secret key, AI model paths, etc.) in a `.env` file.
4. Start the Flask server: `flask run`

**Note:** You will need to configure the AI proctoring models and data paths according to your setup.

## Contributing:

Contributions to LearnXcellence are welcome! Feel free to submit bug reports, feature requests, or pull requests. 

## License:

This project is licensed under the [MIT License](LICENSE).