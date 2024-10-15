from rest_framework import generics, permissions
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from django.contrib.auth.models import User
from django.db import models

class ChatMessageListCreate(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user = self.kwargs['username']
        return ChatMessage.objects.filter(
            (models.Q(sender=user) & models.Q(receiver__username=other_user)) |
            (models.Q(sender__username=other_user) & models.Q(receiver=user))
        ).order_by('timestamp')

    def perform_create(self, serializer):
        receiver_username = self.kwargs['username']
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            raise ValidationError({"detail": f"User {receiver_username} does not exist."})
        
        serializer.save(sender=self.request.user, receiver=receiver)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)