from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import JSONField  # For Django >= 3.1


# Create your models here.
class CustomUser(AbstractUser):
    status = models.CharField(max_length=20, default='active')
    role = models.CharField(max_length=20, default='basicuser')
    signature = models.BinaryField(null=True, blank=True)

    
    def __str__(self):
        return self.email

class Form(models.Model):
    # Define status choices
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
    ]

    # Foreign key to the CustomUser model
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='forms')

    # Status field with predefined choices
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    # Date field for when the form was signed
    signed_on = models.DateField(null=True, blank=True)

    # JSON field to store JSON data
    data = JSONField(default=dict)  # Use JSONField for Django >= 3.1

    def __str__(self):
        return f"Form {self.id} - {self.status}"