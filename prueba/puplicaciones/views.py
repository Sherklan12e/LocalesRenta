# views.py
from rest_framework.decorators import api_view,action
from rest_framework.response import Response
from rest_framework import status
from .services import DropboxService

import dropbox
from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from .models import Alquiler, ImagenAlquiler
from .serializers import AlquilerSerializer
from rest_framework.permissions import IsAuthenticated
from .models import ImagenAlquiler
from .serializers import ImagenAlquilerSerializer


class ImagenAlquilerViewSet(viewsets.ModelViewSet):
    queryset = ImagenAlquiler.objects.all()
    serializer_class = ImagenAlquilerSerializer

    @action(detail=True, methods=['post'])
    def delete_image(self, request, pk=None):
        try:
            imagen = self.get_object()
            service = DropboxService()
            # Asegúrate de que el URL o identificador es correcto
            service.delete_image(imagen.image_url)
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
        # Manejar las imágenes después de guardar el alquiler
        imagenes = self.request.FILES.getlist('imagenes')
        for imagen in imagenes:
            ImagenAlquiler.objects.create(alquiler=alquiler, imagen=imagen)

class AlquilerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("No tienes permiso para editar esta publicación.")
        alquiler = serializer.save()
        # Manejar las imágenes nuevas si se envían
        imagenes = self.request.FILES.getlist('imagenes')
        for imagen in imagenes:
            ImagenAlquiler.objects.create(alquiler=alquiler, imagen=imagen)

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("No tienes permiso para eliminar esta publicación.")
        instance.delete()

class AlquilerListView(generics.ListAPIView):
    queryset = Alquiler.objects.all().order_by('-fecha_publicacion')
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.AllowAny]
from django.http import JsonResponse



