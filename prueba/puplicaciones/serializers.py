# serializers.py

from rest_framework import serializers
from .models import Alquiler, ImagenAlquiler
from django_countries.serializer_fields import CountryField

class ImagenAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenAlquiler
        fields = ['imagen', 'image_url','imagen', 'image_url']

class AlquilerSerializer(serializers.ModelSerializer):
    country = CountryField()
    imagenes = ImagenAlquilerSerializer(many=True, read_only=True)

    class Meta:
        model = Alquiler
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        # Aquí se maneja la creación del alquiler y las imágenes
        alquiler = super().create(validated_data)
        imagenes = self.context['request'].FILES.getlist('imagenes')
        for imagen in imagenes:
            ImagenAlquiler.objects.create(alquiler=alquiler, imagen=imagen)
        return alquiler

    def update(self, instance, validated_data):
        # Aquí se maneja la actualización del alquiler y las imágenes
        instance = super().update(instance, validated_data)
        imagenes = self.context['request'].FILES.getlist('imagenes')
        for imagen in imagenes:
            ImagenAlquiler.objects.create(alquiler=instance, imagen=imagen)
        return instance
    def get_imagenes(self, obj):
        request = self.context.get('request')
        imagenes = obj.imagenes.all()
        return [request.build_absolute_uri(imagen.image.url) for imagen in imagenes]