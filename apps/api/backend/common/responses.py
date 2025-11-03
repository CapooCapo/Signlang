from typing import Any, Mapping, Sequence
from rest_framework.response import Response

JsonObj  = Mapping[str, Any]
JsonList = Sequence[JsonObj]


def res_message(status_code: int,message: str, data: JsonObj | JsonList | None = None) -> Response:
    return Response(
        {"status": status_code, "message": message, "object": data or {}},status = status_code,
    )
