from django.urls import path
from .views import AlquilerCreateView, AlquilerRetrieveUpdateDestroyView, AlquilerListView

urlpatterns = [
    path('alquileres/', AlquilerCreateView.as_view(), name='alquiler-list-create'),
    path('alquileres/view/', AlquilerListView.as_view(), name='alquiler-list'),

    path('alquileres/<int:pk>/', AlquilerRetrieveUpdateDestroyView.as_view(), name='alquiler-detail'),
]
