import os
import logging
import firebase_admin
from firebase_admin import credentials, auth

logger = logging.getLogger(__name__)

def initialize_firebase():
    """
    Initialize Firebase Admin SDK using service account credentials.
    """
    try:
        if not firebase_admin._apps:
            cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            
            if cred_path:
                if os.path.exists(cred_path):
                    if os.path.isdir(cred_path):
                        logger.error(f"GOOGLE_APPLICATION_CREDENTIALS points to a DIRECTORY: {cred_path}. Please ensure it is a file.")
                    else:
                        logger.info(f"Initializing Firebase Admin with credentials from {cred_path}")
                        try:
                            cred = credentials.Certificate(cred_path)
                            firebase_admin.initialize_app(cred)
                            logger.info("Firebase Admin SDK successfully initialized.")
                        except Exception as e:
                            logger.error(f"Failed to initialize Firebase Admin with certificate: {e}")
                else:
                    logger.error(f"GOOGLE_APPLICATION_CREDENTIALS file not found at: {cred_path}")
            else:
                logger.warning("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
                try:
                    firebase_admin.initialize_app()
                    logger.info("Firebase Admin SDK initialized with default credentials.")
                except Exception as e:
                    logger.error(f"Failed to initialize with default credentials: {e}")
        
        # Test internet connectivity (required to fetch public keys)
        try:
            import requests
            response = requests.get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com", timeout=5)
            if response.status_code == 200:
                logger.info("Internet connectivity to Google public keys verified.")
            else:
                logger.warning(f"Could not reach Google public keys server. Status: {response.status_code}")
        except Exception as e:
            logger.error(f"Network error: Backend cannot reach Google servers to verify tokens: {e}")
            
    except Exception as e:
        logger.error(f"Unexpected error during Firebase initialization: {e}")

def decode_token_unverified(id_token):
    """
    Decodes the token WITHOUT verification. USE ONLY FOR DEBUGGING.
    """
    import jwt
    try:
        # We don't verify signature here, just decode payload to see 'aud', 'iss', etc.
        decoded = jwt.decode(id_token, options={"verify_signature": False})
        return decoded
    except Exception as e:
        logger.error(f"Failed to decode token unverified: {e}")
        return None

def verify_firebase_token(id_token):
    """
    Verify the ID token sent from the frontend.
    Returns the decoded token (dictionary) if valid, otherwise None.
    """
    if not id_token:
        logger.error("No token provided for verification.")
        return None

    try:
        # Check if initialized
        if not firebase_admin._apps:
            initialize_firebase()
            
        if not firebase_admin._apps:
            logger.error("Firebase Admin SDK not initialized. Verification aborted.")
            return None
            
        # Debug: Decode token payload to inspect it before verification
        unverified_payload = decode_token_unverified(id_token)
        if unverified_payload:
            logger.info(f"Unverified token payload: aud={unverified_payload.get('aud')}, iss={unverified_payload.get('iss')}, email={unverified_payload.get('email')}")
        
        token_snippet = f"{id_token[:15]}...{id_token[-15:]}" if len(id_token) > 30 else "short_token"
        logger.info(f"Verifying Firebase ID token (len={len(id_token)}): {token_snippet}")
        
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        logger.info(f"Token verified successfully for: {decoded_token.get('email')}")
        return decoded_token
        
    except auth.ExpiredIdTokenError:
        logger.error("Firebase ID token has expired.")
    except auth.InvalidIdTokenError as e:
        logger.error(f"Firebase ID token is invalid: {e}")
        # Check if it's an audience mismatch
        unverified = decode_token_unverified(id_token)
        if unverified:
            logger.error(f"Token audience '{unverified.get('aud')}' does not match expected project ID.")
    except Exception as e:
        logger.error(f"Firebase token verification failed with unexpected error: {e}")
    return None
