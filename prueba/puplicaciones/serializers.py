from rest_framework import serializers
from .models import Alquiler
from django_countries.serializer_fields import CountryField

class AlquilerSerializer(serializers.ModelSerializer):
    country = CountryField()
    
    class Meta:
        model = Alquiler
        fields = '__all__'
        read_only_fields = ('user',)