# RegOps AI Suite Backend

A modern, secure backend for the RegOps AI Suite, built with FastAPI and following clean architecture principles.

## Features

- 🔐 Secure authentication with JWT
- ✉️ Email verification flow
- 🔄 Token refresh mechanism
- 🎯 Role-based access control
- 📧 Email notifications
- 🗄️ MongoDB integration
- 🚀 FastAPI with async support
- 🔍 Environment-aware logging and debugging

## Prerequisites

- Python 3.8+
- MongoDB
- Redis (for background tasks)
- SMTP server for emails

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```env
# Environment
ENV=development  # or production
PORT=8000
DEBUG=true  # automatically set based on ENV

# Security
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=regops

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAILS_FROM_EMAIL=your-email@gmail.com
EMAILS_FROM_NAME=RegOps AI Suite

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]

# Logging
LOG_LEVEL=INFO  # automatically set based on ENV
```

4. Run the application:
```bash
# Development mode
python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --reload --port 8000
```

## Environment Configuration

The application supports two environments:

### Development
- Detailed logging of all requests
- Full error details in responses
- Hot reload enabled
- Debug mode active
- Log level: INFO

### Production
- Minimal logging (WARNING and above)
- Generic error messages
- Hot reload disabled
- Debug mode disabled
- Log level: WARNING

To switch environments, set the `ENV` variable in your `.env` file:
```env
ENV=production  # or development
```

## API Documentation

Once the application is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication Flow

1. **Registration**
   - User submits email and name
   - System sends verification email

2. **Email Verification**
   - User clicks verification link
   - System sends password setup email

3. **Password Setup**
   - User sets password
   - Account becomes active

4. **Login**
   - User logs in with email and password
   - System returns access and refresh tokens

5. **Token Refresh**
   - User can refresh access token using refresh token

## Development

### Project Structure

```
regops/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           └── auth.py
│   ├── core/
│   │   └── config.py
│   ├── domain/
│   │   ├── models/
│   │   │   └── user.py
│   │   └── schemas/
│   │       └── auth.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── email_service.py
│   ├── templates/
│   │   ├── verification_email.html
│   │   └── password_setup.html
│   └── main.py
├── requirements.txt
└── README.md
```

### Running Tests

```bash
pytest
```

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Email verification is required before account activation
- CORS is properly configured
- Rate limiting is implemented
- Input validation is enforced using Pydantic models
- Environment-specific error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 