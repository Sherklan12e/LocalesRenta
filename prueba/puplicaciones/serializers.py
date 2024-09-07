from rest_framework import serializers
from .models import Alquiler, ImagenAlquiler
from django_countries.serializer_fields import CountryField

class ImagenAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenAlquiler
        fields = ['imagen']

class AlquilerSerializer(serializers.ModelSerializer):
    country = CountryField()
    imagenes = ImagenAlquilerSerializer(many=True, read_only=True)

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

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        # Eliminar imágenes antiguas si se requiere
        ImagenAlquiler.objects.filter(alquiler=instance).delete()
        imagenes = self.context['request'].FILES.getlist('imagenes')
        if imagenes:
            for imagen in imagenes:
                ImagenAlquiler.objects.create(alquiler=instance, imagen=imagen)
        return instance
