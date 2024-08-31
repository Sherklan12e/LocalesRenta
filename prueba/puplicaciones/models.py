from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField

class Alquiler(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    ubicacion = models.CharField(max_length=255)
    superficie = models.DecimalField(max_digits=7, decimal_places=2)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='alquileres/', null=True, blank=True)
    country = CountryField()

    def __str__(self):
        return self.titulo