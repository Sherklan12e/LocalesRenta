
from django.contrib import admin
from django.urls import path
from locales.views import index,alquilar_local, locales, LocalDetalles,search
from login.views import register,login, salir


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),




    # login
    path('register/', register, name='register'),
    path('login/', login , name='login'),
    path('salir/',salir, name='salir'),

    # local
    path('publicaciones/', locales, name='locales' ),
    path('crearpost/', alquilar_local, name='alquilar'),
    path('detalles/<int:pk>/', LocalDetalles,name='detalles'),
    path('search/',search,name='buscar')
]
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)