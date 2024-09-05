from rest_framework import generics, permissions
from .models import Alquiler
from .serializers import AlquilerSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


class AlquilerCreateView(generics.ListCreateAPIView):
    queryset = Alquiler.objects.all().order_by('-fecha_publicacion')
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
class AlquilerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("No tienes permiso para editar esta publicación.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("No tienes permiso para eliminar esta publicación.")
        instance.delete()
class AlquilerListView(generics.ListAPIView):
    queryset = Alquiler.objects.all().order_by('-fecha_publicacion')
    serializer_class = AlquilerSerializer
    permission_classes = [permissions.AllowAny]
