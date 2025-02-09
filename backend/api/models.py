from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
    status = models.CharField(max_length=20, default='active')
    role = models.CharField(max_length=20, default='basicuser')
    
    def __str__(self):
        return self.email