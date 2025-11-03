from __future__ import annotations
from typing import Any, Iterable, Mapping, Sequence
import re

from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password as dj_validate_password

from django.db.models import EmailField
from rest_framework.exceptions import ValidationError

EMAIL_VALIDATOR = EmailValidator()
def is_blank(v: Any) -> bool :
    return v is None or (isinstance(v,str) and v.strip()=="")

