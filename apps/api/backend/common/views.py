from django.db import connections
from django.db.utils import OperationalError
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([])
def health_check(request):
    """
    Standard health check endpoint.
    """
    health = {"status": "ok", "services": {"database": "ok"}}
    
    # Check database
    db_conn = connections['default']
    try:
        db_conn.cursor()
    except OperationalError:
        health["status"] = "unhealthy"
        health["services"]["database"] = "down"
        
    return Response(health, status=200 if health["status"] == "ok" else 503)
