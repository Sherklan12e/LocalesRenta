from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,permissions
from .serializers import UserSerializer, PostSerializer, ProfileSerializer
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import Post,Profile

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework.exceptions import ValidationError

from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

class ProfileUpdateView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return Profile.objects.get(user__username=self.kwargs['username'])
        except Profile.DoesNotExist:
            raise ValidationError({'detail': 'Profile not found.'})

    def perform_update(self, serializer):
        print(f"Received data: {self.request.data}")
        new_username = self.request.data.get('username')
        current_username = self.get_object().user.username

        if new_username and new_username != current_username:
            if User.objects.filter(username=new_username).exists():
                raise ValidationError({'username': 'This username is already taken.'})
            
            user = self.get_object().user
            user.username = new_username
            user.save()

        # Remove profile_picture from validated_data if it's not provided
        if 'profile_picture' not in self.request.data:
            serializer.validated_data.pop('profile_picture', None)

        serializer.save()

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user__username=self.kwargs['username'])


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    def perform_create(self, serializer):
        print(self.request.data)
        user = serializer.save()
        self.send_welcome_email(user)

    def send_welcome_email(self, user):
        subject = 'Bienvenido a nuestra plataforma'
        message = f'Hola {user.username},\n\nGracias por registrarte en nuestra plataforma. ¡Estamos felices de tenerte con nosotros!'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list)


class PostCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        post = self.get_object()
        if post.user != request.user:
            raise PermissionDenied("You do not have permission to delete this post.")
        return super().delete(request, *args, **kwargs)
