
from django.contrib import admin
from django.urls import path
from locales.views import index
from login.views import register,login
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('register/', register, name='register'),
    path('login/', login , name='login')


]
