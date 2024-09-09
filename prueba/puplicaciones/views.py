from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from .models import Alquiler, ImagenAlquiler
from .serializers import AlquilerSerializer, ImagenAlquilerSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.storage import default_storage

class ImagenAlquilerViewSet(viewsets.ModelViewSet):
    queryset = ImagenAlquiler.objects.all()
    serializer_class = ImagenAlquilerSerializer

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
        


class AlquilerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        alquiler = serializer.save()

        # Eliminar imágenes si el usuario lo ha solicitado
        eliminar_imagenes = self.request.data.get('eliminar_imagenes')
        if eliminar_imagenes:
            eliminar_imagenes = json.loads(eliminar_imagenes)
            for imagen_id in eliminar_imagenes:
                try:
                    imagen = ImagenAlquiler.objects.get(id=imagen_id)
                    imagen.imagen.delete(save=False)  # Borra el archivo físico
                    imagen.delete()  # Borra el registro de la base de datos
                except ImagenAlquiler.DoesNotExist:
                    continue

        # Agregar nuevas imágenes
        nuevas_imagenes = self.request.FILES.getlist('imagenes')
        for nueva_imagen in nuevas_imagenes:
            ImagenAlquiler.objects.create(alquiler=alquiler, imagen=nueva_imagen)


    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("No tienes permiso para eliminar esta publicación.")
        for imagen in instance.imagenes.all():
            imagen.imagen.delete(save=False)
            imagen.delete()
        instance.delete()

class AlquilerListView(generics.ListAPIView):
    queryset = Alquiler.objects.all().order_by('-fecha_publicacion')
    serializer_class = AlquilerSerializer
    permission_classes = [AllowAny] 