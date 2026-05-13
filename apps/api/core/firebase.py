import os
import logging
import threading
import firebase_admin
from firebase_admin import credentials, auth

logger = logging.getLogger(__name__)

class FirebaseManager:
    """
    Singleton manager for Firebase Admin SDK initialization.
    Ensures that Firebase is initialized only once and only when needed.
    """
    _instance_lock = threading.Lock()
    _initialized = False

    @classmethod
    def get_app(cls):
        """
        Returns the initialized Firebase app instance, initializing it if necessary.
        """
        if not cls._initialized and not firebase_admin._apps:
            with cls._instance_lock:
                if not cls._initialized and not firebase_admin._apps:
                    cls._initialize()
        
        try:
            return firebase_admin.get_app()
        except ValueError:
            # In case _apps was empty but _initialized was true (unexpected state)
            cls._initialize()
            return firebase_admin.get_app()

    @classmethod
    def _initialize(cls):
        """
        Internal method to handle the actual initialization logic.
        """
        try:
            cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            
            if cred_path:
                if os.path.exists(cred_path):
                    if os.path.isfile(cred_path):
                        logger.info(f"Initializing Firebase Admin with credentials from {cred_path}")
                        cred = credentials.Certificate(cred_path)
                        firebase_admin.initialize_app(cred)
                    else:
                        logger.error(f"GOOGLE_APPLICATION_CREDENTIALS points to a directory, not a file: {cred_path}")
                        firebase_admin.initialize_app()
                else:
                    logger.error(f"GOOGLE_APPLICATION_CREDENTIALS file not found: {cred_path}. Falling back to default.")
                    firebase_admin.initialize_app()
            else:
                logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set. Using default credentials.")
                firebase_admin.initialize_app()
            
            cls._initialized = True
            logger.info("Firebase Admin SDK successfully initialized.")
            
        except Exception as e:
            logger.error(f"CRITICAL: Failed to initialize Firebase Admin SDK: {e}")
            # We don't raise here to avoid crashing the whole Django process at startup/import time
            cls._initialized = False

def verify_firebase_token(id_token):
    """
    Verify the ID token sent from the frontend using lazy initialization.
    """
    if not id_token:
        return None

    try:
        # Lazy initialization happens here
        FirebaseManager.get_app()
            
        if not firebase_admin._apps:
            logger.error("Firebase Admin SDK initialization failed. Cannot verify token.")
            return None
            
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        logger.debug(f"Token verified successfully for: {decoded_token.get('email')}")
        return decoded_token
        
    except auth.ExpiredIdTokenError:
        logger.error("Firebase ID token has expired.")
    except auth.InvalidIdTokenError as e:
        logger.error(f"Firebase ID token is invalid: {e}")
    except Exception as e:
        logger.error(f"Firebase token verification failed: {e}")
    
    return None

def check_firebase_connectivity():
    """
    Diagnostic helper to verify connectivity to Google servers.
    This should NOT be part of the main initialization flow.
    """
    try:
        import requests
        response = requests.get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com", timeout=5)
        return response.status_code == 200
    except Exception:
        return False
