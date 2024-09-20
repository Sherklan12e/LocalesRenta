from rest_framework import serializers
from .models import Alquiler, ImagenAlquiler
from django_countries.serializer_fields import CountryField
import json

class ImagenAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenAlquiler
        fields = ['id','imagen']

class AlquilerSerializer(serializers.ModelSerializer):
    country = CountryField()
    imagenes = ImagenAlquilerSerializer(many=True, read_only=True)
    eliminar_imagenes = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )     
    
    class Meta:
        model = Alquiler
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        alquiler = super().create(validated_data)
        imagenes = self.context['request'].FILES.getlist('imagenes')
        if imagenes:
            for imagen in imagenes:
                ImagenAlquiler.objects.create(alquiler=alquiler, imagen=imagen)
        return alquiler
    
    def perform_update(self, serializer):
        alquiler = serializer.save()

        # Depura los datos recibidos
        print("Datos recibidos en perform_update:", self.request.data)
        print("Archivos recibidos:", self.request.FILES)

        eliminar_imagenes = self.request.data.get('eliminar_imagenes')
        if eliminar_imagenes:
            try:
                eliminar_imagenes = json.loads(eliminar_imagenes)
            except json.JSONDecodeError:
                print("Error al decodificar eliminar_imagenes")
                eliminar_imagenes = []
            print("Imágenes a eliminar:", eliminar_imagenes)

            for imagen_id in eliminar_imagenes:
                try:
                    imagen = ImagenAlquiler.objects.get(id=imagen_id)
                    imagen.imagen.delete(save=False)  # Borra el archivo físico
                    imagen.delete()  # Borra el registro de la base de datos
                except ImagenAlquiler.DoesNotExist:
                    print(f"Imagen con ID {imagen_id} no encontrada")
                    continue

        nuevas_imagenes = self.request.FILES.getlist('imagenes')
        print("Nuevas imágenes:", nuevas_imagenes)
        for nueva_imagen in nuevas_imagenes:
            ImagenAlquiler.objects.create(alquiler=alquiler, imagen=nueva_imagen)

