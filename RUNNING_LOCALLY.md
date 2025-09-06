# Running IntegraOps Locally

## Prerequisites
1. Python 3.8+
2. Node.js 16+
3. MongoDB
4. Git

## Backend Setup

### 1. Navigate to the API directory
```bash
cd api
```

### 2. Create a virtual environment
```bash
python -m venv venv
```

### 3. Activate the virtual environment
```bash
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 4. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 5. Create a .env file
Create a `.env` file in the `api` directory with the following content:
```bash
ENV=development
DEBUG=True
PORT=8000
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=integraops
GCP_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-credentials.json
GEMINI_API_KEY=your-gemini-api-key-here
GOOGLE_GENAI_USE_VERTEX=False
ADK_MODEL_NAME=gemini-1.5-pro-001
TAVUS_API_KEY=your-tavus-api-key
TAVUS_REPLICA_ID=your-tavus-replica-id
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_AGENT_ID=your-elevenlabs-agent-id
MAILTRAP_API_TOKEN=your-mailtrap-api-token
```

### 6. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows:
net start MongoDB
# On Mac/Linux:
mongod
```

### 7. Run the backend
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

### 1. Navigate to the frontend directory
In a new terminal:
```bash
cd www
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Create a .env.local file
Create a `.env.local` file in the `www` directory with the following content:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_COMPANY_NAME=Integra
NEXT_PUBLIC_PLATFORM_NAME=IntegraOps
NEXT_PUBLIC_TAVUS_API_KEY=your-tavus-api-key
NEXT_PUBLIC_TAVUS_REPLICA_ID=your-tavus-replica-id
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-elevenlabs-agent-id
```

### 4. Run the frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Accessing the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the IntegraOps dashboard
3. Register a new user account
4. Log in and explore the features

## API Documentation

The backend API documentation is available at `http://localhost:8000/docs`

## Stopping the Application

To stop the application:
1. Press `Ctrl+C` in both terminal windows (backend and frontend)
2. Deactivate the Python virtual environment:
   ```bash
   deactivate
   ```
3. Stop MongoDB if needed:
   ```bash
   # On Windows:
   net stop MongoDB
   ```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the MONGODB_URL in your .env file
   - Verify MongoDB is accessible on localhost:27017

2. **Port Conflicts**:
   - If port 8000 or 3000 is in use, change the PORT in .env or use a different port

3. **Missing Dependencies**:
   - Make sure all requirements are installed
   - Check that you're using the correct Python virtual environment

4. **CORS Issues**:
   - The backend is configured to allow CORS from localhost:3000