from rest_framework import serializers
from .models import ChatMessage
from django.contrib.auth.models import User

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    content = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'sender_username', 'receiver_username', 'content', 'timestamp']
        read_only_fields = ['sender', 'receiver', 'timestamp']

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        return value