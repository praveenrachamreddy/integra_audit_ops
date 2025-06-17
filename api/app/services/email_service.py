from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
from pathlib import Path
from typing import List
import jinja2
import aiofiles

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=settings.SMTP_USER,
            MAIL_PASSWORD=settings.SMTP_PASSWORD,
            MAIL_FROM=settings.EMAILS_FROM_EMAIL,
            MAIL_PORT=settings.SMTP_PORT,
            MAIL_SERVER=settings.SMTP_HOST,
            MAIL_STARTTLS=settings.SMTP_TLS,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            TEMPLATE_FOLDER=Path(__file__).parent.parent / 'templates'
        )
        self.fastmail = FastMail(self.conf)
        self.template_loader = jinja2.FileSystemLoader(
            searchpath=str(Path(__file__).parent.parent / 'templates')
        )
        self.template_env = jinja2.Environment(loader=self.template_loader)

    async def send_verification_email(self, email_to: str, token: str):
        template = self.template_env.get_template('verification_email.html')
        verification_url = f"http://localhost:3000/verify-email?token={token}"
        
        html_content = template.render(
            verification_url=verification_url,
            project_name=settings.PROJECT_NAME
        )

        message = MessageSchema(
            subject=f"Verify your email for {settings.PROJECT_NAME}",
            recipients=[email_to],
            body=html_content,
            subtype="html"
        )

        await self.fastmail.send_message(message)

    async def send_password_setup_email(self, email_to: str, token: str):
        template = self.template_env.get_template('password_setup.html')
        setup_url = f"http://localhost:3000/set-password?token={token}"
        
        html_content = template.render(
            setup_url=setup_url,
            project_name=settings.PROJECT_NAME
        )

        message = MessageSchema(
            subject=f"Set up your password for {settings.PROJECT_NAME}",
            recipients=[email_to],
            body=html_content,
            subtype="html"
        )

        await self.fastmail.send_message(message)

email_service = EmailService() 