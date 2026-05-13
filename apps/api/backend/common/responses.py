from typing import Any, Mapping, Sequence
from rest_framework.response import Response

JsonObj  = Mapping[str, Any]
JsonList = Sequence[JsonObj]


def res_message(status_code: int, message: str, data: Any = None) -> Response:
    """
    Standardized success response format.
    """
    return Response(
        {
            "success": 200 <= status_code < 300,
            "status": status_code,
            "message": message,
            "object": data if data is not None else {}
        },
        status=status_code,
    )
