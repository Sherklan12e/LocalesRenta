from django.db import models
import os 
import random
from django.contrib.auth.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:20] + '...'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_perfil/', null=True, blank=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    facebook = models.CharField(max_length=100, blank=True, null=True)
    instagram = models.CharField(max_length=100, blank=True, null=True)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)  # New field for WhatsApp number

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        if not self.bio:
            self.bio = "Mi bio"
        if not self.location:
            self.location = "Argentina"

        # No need for default images list since we're allowing null/blank profile pictures

        # Profile picture is optional now

        super(Profile, self).save(*args, **kwargs)

    @property
    def username(self):
        return self.user.username

    @username.setter
    def username(self, value):
        self.user.username = value
        self.user.save()
