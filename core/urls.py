
from django.contrib import admin
from django.urls import path
from locales.views import index
from login.views import register,login, salir
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),




    # login
    path('register/', register, name='register'),
    path('login/', login , name='login'),
    path('salir/',salir, name='salir'),


]
