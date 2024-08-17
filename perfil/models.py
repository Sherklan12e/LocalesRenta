from django.db import models

class Profile(models.Model):

    nombre = models.CharField(max_length=255)
    



