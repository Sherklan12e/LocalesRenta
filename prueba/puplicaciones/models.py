from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField
<<<<<<< HEAD

=======
from .services import DropboxService
>>>>>>> f47f790 (a)
class Alquiler(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    ubicacion = models.CharField(max_length=255)
    superficie = models.DecimalField(max_digits=7, decimal_places=2)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='alquileres/', null=True, blank=True)
<<<<<<< HEAD
    country = CountryField()

=======
    image_url = models.URLField(blank=True, null=True)
    country = CountryField()

    def save(self, *args, **kwargs):
            if self.imagen and not self.image_url:
                service = DropboxService()
                path = f'/alquileres/{self.imagen.name}'
                self.image_url = service.upload_image(self.imagen, path)
            super().save(*args, **kwargs)
>>>>>>> f47f790 (a)
    def __str__(self):
        return self.titulo