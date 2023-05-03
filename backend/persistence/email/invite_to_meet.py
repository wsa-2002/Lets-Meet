from config import smtp_config, service_config
from persistence.email import smtp_handler
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


async def send(to: str, meet_code: str, subject="Invitation from Let's meet"):
    message = MIMEMultipart()
    message["From"] = f"{smtp_config.username}@{smtp_config.host}"
    message["To"] = to
    message["Subject"] = subject
    body = f"""
        <html>
            <body>
                <p style="color: black;">Hello,</p>
                <p style="color: black;">You are invited to the meeting on Let's Meet.</p>
                <p style="color: black;">Click the link to join the meeting!</p>
                <p style="color: black;">{service_config.url}/{meet_code}</p>
            </body>
        </html>
        """
    message.attach(MIMEText(body, 'html'))
    await smtp_handler.send_message(message)
