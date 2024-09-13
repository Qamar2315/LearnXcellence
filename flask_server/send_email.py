import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
import ssl
import logging
import re

# Load environment variables from .env file
load_dotenv()

EMAIL = os.getenv('EMAIL')
PASSWORD = os.getenv('PASSWORD')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')

if not all([EMAIL, PASSWORD, SMTP_SERVER, SMTP_PORT]):
    raise RuntimeError("Some environment variables are missing. Please check your .env file.")

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def is_valid_email(email):
    """Check if the email format is valid."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None

# Function to send verification email
def send_verification_email(name, email):
    """Send the OTP to the given email address using SMTP."""
    if not is_valid_email(email):
        logger.error(f"Invalid email format: {email}")
        raise ValueError("Invalid email address format.")

    subject = "Your Email has been verified - LearnXcellence"
    body = f"""
    Dear {name},

    Your email has been successfully verified. Thank you for using LearnXcellence!

    Best regards,
    Team LearnXcellence
    """
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL
    msg['To'] = email

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT)) as server:
            server.ehlo()
            server.starttls(context=context)
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, email, msg.as_string())
            logger.info(f"Verification email sent successfully to {email}")
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"Authentication error: {e}")
        raise RuntimeError("Authentication failed. Please check your email and password.")
    except smtplib.SMTPConnectError as e:
        logger.error(f"Connection error: {e}")
        raise RuntimeError("Failed to connect to the SMTP server. Please check your server and port.")
    except smtplib.SMTPRecipientsRefused as e:
        logger.error(f"Recipient error: {e}")
        raise RuntimeError("The email recipient was refused. Please check the recipient email address.")
    except smtplib.SMTPSenderRefused as e:
        logger.error(f"Sender error: {e}")
        raise RuntimeError("The sender address was refused. Please check the sender email address.")
    except smtplib.SMTPDataError as e:
        logger.error(f"Data error: {e}")
        raise RuntimeError("The SMTP server responded with an unexpected error.")
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {e}")
        raise RuntimeError(f"An error occurred: {str(e)}")


# Function to send password reset email
def send_password_reset_mail(name, email, reset_link):
    """Send password reset email using SMTP."""
    if not is_valid_email(email):
        logger.error(f"Invalid email format: {email}")
        raise ValueError("Invalid email address format.")

    subject = "Reset Your Password - LearnXcellence"
    body_html = f"""
    <html>
    <body>
        <h2>Password Reset Request</h2>
        <p>Dear {name},</p>
        <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
        <p><a href="{reset_link}" target="_blank">Reset Your Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Team LearnXcellence</p>
    </body>
    </html>
    """

    # Create a multipart message and set headers
    msg = MIMEMultipart("alternative")
    msg['Subject'] = subject
    msg['From'] = EMAIL
    msg['To'] = email

    # Attach both the plain and HTML versions
    msg.attach(MIMEText(body_html, "html"))

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT)) as server:
            server.ehlo()
            server.starttls(context=context)
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, email, msg.as_string())
            logger.info(f"Password reset email sent successfully to {email}")
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"Authentication error: {e}")
        raise RuntimeError("Authentication failed. Please check your email and password.")
    except smtplib.SMTPConnectError as e:
        logger.error(f"Connection error: {e}")
        raise RuntimeError("Failed to connect to the SMTP server. Please check your server and port.")
    except smtplib.SMTPRecipientsRefused as e:
        logger.error(f"Recipient error: {e}")
        raise RuntimeError("The email recipient was refused. Please check the recipient email address.")
    except smtplib.SMTPSenderRefused as e:
        logger.error(f"Sender error: {e}")
        raise RuntimeError("The sender address was refused. Please check the sender email address.")
    except smtplib.SMTPDataError as e:
        logger.error(f"Data error: {e}")
        raise RuntimeError("The SMTP server responded with an unexpected error.")
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {e}")
        raise RuntimeError(f"An error occurred: {str(e)}")