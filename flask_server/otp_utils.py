import random
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import ssl

# Load environment variables from .env file
load_dotenv()

EMAIL = os.getenv('EMAIL')
PASSWORD = os.getenv('PASSWORD')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')

if not all([EMAIL, PASSWORD, SMTP_SERVER, SMTP_PORT]):
    raise RuntimeError("Some environment variables are missing. Please check your .env file.")

def generate_otp(length=6):
    """Generate a random OTP of given length."""
    digits = "0123456789"
    otp = ''.join(random.choice(digits) for _ in range(length))
    return otp

def send_otp(email, otp):
    """Send the OTP to the given email address using SMTP."""
    subject = "Your OTP Code for Your Email Verification"
    body = f"""
    Dear User,

    Please use the following OTP (One-Time Password) to complete your verification process on LearnXcellence app:

    Security Code: {otp}

    If you did not request this OTP, you can safely ignore this email. Someone might have mistakenly entered your email address.

    Thank you for using LearnXcellence!

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
            return otp
    except smtplib.SMTPAuthenticationError as e:
        print(f"Authentication error: {e}")
        raise RuntimeError("Authentication failed. Please check your email and password.")
    except smtplib.SMTPConnectError as e:
        print(f"Connection error: {e}")
        raise RuntimeError("Failed to connect to the SMTP server. Please check your server and port.")
    except smtplib.SMTPRecipientsRefused as e:
        print(f"Recipient error: {e}")
        raise RuntimeError("The email recipient was refused. Please check the recipient email address.")
    except smtplib.SMTPSenderRefused as e:
        print(f"Sender error: {e}")
        raise RuntimeError("The sender address was refused. Please check the sender email address.")
    except smtplib.SMTPDataError as e:
        print(f"Data error: {e}")
        raise RuntimeError("The SMTP server responded with an unexpected error.")
    except smtplib.SMTPException as e:
        print(f"SMTP error: {e}")
        raise RuntimeError(f"An error occurred: {str(e)}")
