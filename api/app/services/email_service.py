import httpx
from app.core.config import settings
from pathlib import Path
import jinja2
from app.infrastructure.logger import Logger

MAILTRAP_API_URL = settings.MAILTRAP_API_URL
logger = Logger(__name__)
class EmailService:
    def __init__(self):
        self.api_token = settings.MAILTRAP_API_TOKEN
        self.sender_email = settings.MAILTRAP_SENDER_EMAIL
        self.sender_name = settings.MAILTRAP_SENDER_NAME
        self.template_loader = jinja2.FileSystemLoader(
            searchpath=str(Path(__file__).parent.parent / 'templates')
        )
        self.template_env = jinja2.Environment(loader=self.template_loader)

    async def send_email(self, to_email: str, subject: str, html_content: str):
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "from": {
                "email": self.sender_email,
                "name": self.sender_name
            },
            "to": [{"email": to_email}],
            "subject": subject,
            "html": html_content
        }
        async with httpx.AsyncClient() as client:
            logger.data({"MAILTRAP_API_URL": MAILTRAP_API_URL, "headers": headers, "payload": payload})
            response = await client.post(MAILTRAP_API_URL, headers=headers, json=payload)
            response.raise_for_status()

    async def send_verification_email(self, email_to: str, token: str):
        template = self.template_env.get_template('verification_email.html')
        verification_url = f"http://localhost:3000/verify-email?token={token}"
        html_content = template.render(
            verification_url=verification_url,
            project_name=settings.PROJECT_NAME
        )
        await self.send_email(
            to_email=email_to,
            subject=f"Verify your email for {settings.PROJECT_NAME}",
            html_content=html_content
        )

    async def send_password_setup_email(self, email_to: str, token: str):
        template = self.template_env.get_template('password_setup.html')
        setup_url = f"http://localhost:3000/set-password?token={token}"
        html_content = template.render(
            setup_url=setup_url,
            project_name=settings.PROJECT_NAME
        )
        await self.send_email(
            to_email=email_to,
            subject=f"Set up your password for {settings.PROJECT_NAME}",
            html_content=html_content
        )

email_service = EmailService() 