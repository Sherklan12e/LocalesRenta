from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from .models import Alquiler, ImagenAlquiler
from .serializers import AlquilerSerializer, ImagenAlquilerSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.storage import default_storage
from django.db.models import Q
from rest_framework import generics

class ImagenAlquilerViewSet(viewsets.ModelViewSet):
    queryset = ImagenAlquiler.objects.all()
    serializer_class = ImagenAlquilerSerializer
    permission_classes = [permissions.IsAuthenticated]
    @action(detail=True, methods=['post'])
    def delete_image(self, request, pk=None):
        try:
            imagen = self.get_object()
            # Elimina el archivo físico
            imagen.imagen.delete(save=False)
            # Elimina el registro en la base de datos
            imagen.delete()
            return Response({"status": "Imagen eliminada"}, status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class AlquilerCreateView(generics.ListCreateAPIView):
    queryset = Alquiler.objects.all().order_by('-fecha_publicacion')
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        alquiler = serializer.save(user=self.request.user)
        imagenes = self.request.FILES.getlist('imagenes')
        


import json

from rest_framework.response import Response
from rest_framework import status

class AlquilerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [AllowAny]

    def perform_update(self, serializer):
        alquiler = serializer.save()

        eliminar_imagenes = self.request.data.get('eliminar_imagenes', '[]')
        try:
            eliminar_imagenes = json.loads(eliminar_imagenes)
        except json.JSONDecodeError as e:
            print(f"Error al decodificar eliminar_imagenes: {e}")
            return Response({'error': 'Error al procesar eliminar_imagenes'}, status=status.HTTP_400_BAD_REQUEST)

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



class AlquilerListView(generics.ListAPIView):
    queryset = Alquiler.objects.all().order_by('-fecha_publicacion')
    serializer_class = AlquilerSerializer
    permission_classes = [AllowAny]  

class AlquilerSearchView(generics.ListAPIView):
    serializer_class = AlquilerSerializer
    permission_classes = [AllowAny] 
    def get_queryset(self):
        queryset = Alquiler.objects.all()
        query = self.request.query_params.get('q', '')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        property_type = self.request.query_params.get('property_type')

        if query:
            queryset = queryset.filter(
                Q(titulo__icontains=query) |
                Q(descripcion__icontains=query) |
                Q(ubicacion__icontains=query)
            )

        if min_price:
            queryset = queryset.filter(precio__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(precio__lte=float(max_price))
        if location:
            queryset = queryset.filter(ubicacion__icontains=location)
        if property_type:
            queryset = queryset.filter(tipo_propiedad__iexact=property_type)

        return queryset