from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField

class Alquiler(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)  # Precio mensual
    ubicacion = models.CharField(max_length=255)
    superficie = models.DecimalField(max_digits=7, decimal_places=2)  # En metros cuadrados
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Nueva información detallada sobre la propiedad
    num_habitaciones = models.IntegerField(default=1)  # Cantidad de habitaciones
    num_banos = models.IntegerField(default=1)  # Cantidad de baños
    num_garajes = models.IntegerField(default=0)  # Número de garajes
    tiene_balcon = models.BooleanField(default=False)  # Propiedad con balcón
    tiene_patio = models.BooleanField(default=False)  # Propiedad con patio/jardín
    amueblado = models.BooleanField(default=False)  # Indica si la casa está amueblada
    
    # Información adicional de la propiedad
    ano_construccion = models.IntegerField(null=True, blank=True)  # Año de construcción
    tipo_propiedad = models.CharField(max_length=100, choices=[
        ('casa', 'Casa'),
        ('departamento', 'Departamento'),
        ('chalet', 'Chalet'),
        ('duplex', 'Dúplex'),
        ('piso', 'Piso')
    ], default='casa')  # Tipo de propiedad
    
    country = CountryField()  # País de la propiedad
    
    # Servicios adicionales
    wifi = models.BooleanField(default=False)  # Conexión Wi-Fi disponible
    calefaccion = models.BooleanField(default=False)  # Calefacción
    aire_acondicionado = models.BooleanField(default=False)  # Aire acondicionado
    piscina = models.BooleanField(default=False)  # Propiedad con piscina
    mascotas_permitidas = models.BooleanField(default=False)  # Si se permiten mascotas

    def __str__(self):
        return f'{self.titulo} - {self.ubicacion} ({self.precio} €)'

class ImagenAlquiler(models.Model):
    alquiler = models.ForeignKey(Alquiler, related_name='imagenes', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='alquileres/')  # Guardar imágenes localmente

    def __str__(self):
        return f'Imagen de {self.alquiler.titulo}'
