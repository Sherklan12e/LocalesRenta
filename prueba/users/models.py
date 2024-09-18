from django.db import models

from django.contrib.auth.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:20] + '...'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_perfil/', default='defaultProfile.jpg', null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.user and not self.username:
            self.username = self.user.username
            self.bio = "Esta es una bio"
            self.location = "Argentina"
        if not self.profile_picture:
            default_image_path = os.path.join(settings.MEDIA_ROOT, 'profile_perfil/defaultProfile.jpg')
            with open(default_image_path, 'rb') as f:
                self.profile_picture.save('defaultProfile.jpg', File(f), save=False)
        super(Profile, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username
    
