from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging
from app.core.config import settings, logger
from app.api.v1.endpoints import (
    auth, 
    health, 
    audit, 
    explain, 
    # users, 
    media,
    projects,
    clients
)
from fastapi.openapi.utils import get_openapi
from app.infrastructure.db import init_db, close_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=f"""
{settings.PLATFORM_NAME} API - AI-powered compliance and project management platform for {settings.COMPANY_NAME}.

This API provides endpoints for authentication, project management, audits, and more. All endpoints are documented below. JWT-protected endpoints show a lock icon and require a valid Bearer token.
""",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=settings.DEBUG
)

@app.on_event("startup")
async def startup_event():
    init_db(app)
    logger.info("MongoDB client initialized.")

@app.on_event("shutdown")
async def shutdown_event():
    close_db(app)
    logger.info("MongoDB client closed.")

@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = app.mongodb
    response = await call_next(request)
    return response

# Set up CORS
if settings.ENV == "development":
    # Allow all origins in development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Restrict origins in production
    origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["Health"])
app.include_router(audit.router, prefix=f"{settings.API_V1_STR}/audit", tags=["Audit"])
app.include_router(explain.router, prefix=f"{settings.API_V1_STR}/explain", tags=["Explain"])
# app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(media.router, prefix=f"{settings.API_V1_STR}/media", tags=["Media"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])
app.include_router(clients.router, prefix=f"{settings.API_V1_STR}/clients", tags=["Clients"])

# Custom OpenAPI schema with JWT Bearer

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            if "security" not in method:
                method["security"] = []
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.middleware("http")
async def log_requests(request: Request, call_next):
    if settings.ENV == "development":
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(
            f"Method: {request.method} Path: {request.url.path} "
            f"Status: {response.status_code} Duration: {process_time:.2f}s"
        )
        return response
    return await call_next(request)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {exc}", exc_info=True)
    if settings.ENV == "development":
        return JSONResponse(
            status_code=500,
            content={
                "detail": str(exc),
                "type": type(exc).__name__,
                "path": request.url.path
            }
        )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.get("/")
async def root() -> dict:
    """Root endpoint with API info."""
    return {
        "message": f"Welcome to {settings.PLATFORM_NAME} API",
        "company": settings.COMPANY_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENV == "development"
    )