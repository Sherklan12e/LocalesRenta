from django.urls import path
from .views import ChatMessageListCreate

urlpatterns = [
    path('messages/<str:username>/', ChatMessageListCreate.as_view(), name='chat-messages'),
]