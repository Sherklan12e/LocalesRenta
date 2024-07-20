from django.db import models
from django.contrib.auth.models import User

class Local(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)
    descripcion = models.CharField(max_length=255)
    precio_dia = models.DecimalField(max_digits=10, decimal_places=2)
    esta_disponible = models.BooleanField(default=True)
    image = models.ImageField(upload_to='locations/' , blank=True,null=True)
    dueno = models.ForeignKey(User, on_delete=models.CASCADE,related_name='dueno_local')


    def __str__(self):
        return self.nombre
    

class Reserva(models.Model):
    usuario = models.ForeignKey(User,on_delete=models.CASCADE)
    local = models.ForeignKey(Local, on_delete=models.CASCADE ,null=True)
    dia_comienzo = models.DateField(default=0)
    final_dia = models.DateField(default=0)
    totalpagar = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return f"{self.usuario} - {self.local} " 
    

class Resena(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    local = models.ForeignKey(Local,on_delete=models.CASCADE)
    clasificacion = models.IntegerField(choices=[(i,i) for i in range(1,6)])
    comment = models.TextField()
    fecha = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Calificacion de {self.usuario}"