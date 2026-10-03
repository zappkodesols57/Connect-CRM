from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('EMPLOYEE', 'Employee'),
        ('CLIENT', 'Client'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYEE')
    mobile_number = models.CharField(max_length=20, blank=True)
    avatar_color = models.CharField(max_length=50, default="#1D4ED8")
    
    # For employees
    team_group = models.CharField(max_length=100, default="Social Media Team", blank=True)
    designation = models.CharField(max_length=100, blank=True)
    
    # For clients
    client_profile = models.ForeignKey('clients.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"
