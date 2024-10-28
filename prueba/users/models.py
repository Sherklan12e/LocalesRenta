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
    profile_picture = models.ImageField(upload_to='profile_perfil/', default='defaultProfile.jpg', null=True)
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

        default_images = [
            'profile_perfil/default1.jpg',
            # 'profile_perfil/default2.jpg',
            # 'profile_perfil/default3.jpg',
            # 'profile_perfil/default4.jpg',
            # 'profile_perfil/default5.jpg',
        ]

        if not self.profile_picture or self.profile_picture.name == 'defaultProfile.jpg':
            self.profile_picture = random.choice(default_images)

        super(Profile, self).save(*args, **kwargs)

    @property
    def username(self):
        return self.user.username

    @username.setter
    def username(self, value):
        self.user.username = value
        self.user.save()
