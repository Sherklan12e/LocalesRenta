from django.urls import path
from .views import AlquilerCreateView, AlquilerRetrieveUpdateDestroyView, AlquilerListView, delete_image

urlpatterns = [
    path('alquileres/', AlquilerCreateView.as_view(), name='alquiler-list-create'),
    path('alquileres/view/', AlquilerListView.as_view(), name='alquiler-list'),
    path('eliminar-imagen/', delete_image, name='eliminar-imagen'),
    path('alquileres/<int:pk>/', AlquilerRetrieveUpdateDestroyView.as_view(), name='alquiler-detail'),
]
