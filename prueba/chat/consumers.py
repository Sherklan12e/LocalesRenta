import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_channel,
            self.channel_name
        )
        print(f"Disconnected from personal channel: {self.user_channel}")

        # Split the room name to get both usernames
        usernames = self.room_name.split('_')
        self.user1, self.user2 = usernames[0], usernames[1]

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"Connected to room: {self.room_group_name}")
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"Disconnected from room: {self.room_group_name}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json['sender']
        receiver = text_data_json['receiver']

        await self.save_message(sender, receiver, message)

        # Send the message only to the receiver's channel
        receiver_channel = f"user_{receiver}"
        await self.channel_layer.group_send(
            receiver_channel,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender,
                'receiver': receiver
            }
        )
        print(f"Message sent to receiver: {receiver}")

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'receiver': receiver
        }))
        print(f"Message broadcasted to client in room: {self.room_group_name}")

    @database_sync_to_async
    def save_message(self, sender_username, receiver_username, message):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        ChatMessage.objects.create(sender=sender, receiver=receiver, content=message)
        print(f"Message saved to database: {sender_username} -> {receiver_username}")