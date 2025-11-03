from enum import unique
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True,db_index=True)
    fullname = models.CharField(max_length=120,blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    class Roles(models.TextChoices):
        ADMIN = "admin","Admin"
        USER = "user","User"
        LECTURER = "lecturer", "Lecturer"

    role         = models.CharField(max_length=50, blank=True)
    bank         = models.CharField(max_length=100, blank=True)
    education    = models.CharField(max_length=200, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    hometown     = models.CharField(max_length=100, blank=True)
    workplace    = models.CharField(max_length=100, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


