from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('alquiler/' , include('puplicaciones.urls')),
    
<<<<<<< HEAD
]
static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
=======
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
>>>>>>> f47f790 (a)
