from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def exception_handler(exc, context):
    """
    Standardized exception handler for SignLang API.
    Returns format: { "status": int, "message": str, "object": dict }
    """
    # Call DRF's default exception handler first to get the standard error response.
    response = drf_exception_handler(exc, context)

    if response is not None:
        # Standardize the format
        error_message = ""
        if isinstance(response.data, dict):
            # Try to extract a clean message
            if "detail" in response.data:
                error_message = response.data["detail"]
            elif "non_field_errors" in response.data:
                error_message = response.data["non_field_errors"][0]
            else:
                # Concatenate field errors
                error_message = "Validation error: " + ", ".join([f"{k}: {v[0]}" for k, v in response.data.items() if isinstance(v, list)])
        elif isinstance(response.data, list):
            error_message = response.data[0]

        response.data = {
            "status": response.status_code,
            "message": error_message or "An error occurred.",
            "object": response.data
        }
    else:
        # Unhandled exceptions (500 errors)
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return Response({
            "status": 500,
            "message": "Internal Server Error. Please contact support.",
            "object": {"detail": str(exc)} if context.get('request').user.is_staff else {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
