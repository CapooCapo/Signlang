from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
import time
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("ml-service")

app = FastAPI(
    title="SignLang ML Service",
    description="Microservice for Sign Language Recognition inference",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    data: str  # Base64 or image path
    type: str = "image"

class PredictionResponse(BaseModel):
    status: str
    prediction: str
    confidence: float
    processing_time: float
    model_info: dict

@app.get("/health/")
@app.get("/healthz")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "ml-service",
        "model_loaded": os.getenv("MODEL_NAME", "unknown")
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Prediction endpoint for sign language recognition.
    """
    start_time = time.time()
    logger.info(f"Received prediction request of type: {request.type}")
    
    try:
        # Placeholder for actual model inference logic
        # In a real scenario, you'd load the model once at startup
        prediction = "A"
        confidence = 0.98
        
        return {
            "status": "success",
            "prediction": prediction,
            "confidence": confidence,
            "processing_time": time.time() - start_time,
            "model_info": {
                "name": os.getenv("MODEL_NAME", "asl_letters"),
                "version": os.getenv("MODEL_VERSION", "1.0.0")
            }
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal inference error")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail,
            "code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An unexpected error occurred",
            "code": 500
        }
    )
