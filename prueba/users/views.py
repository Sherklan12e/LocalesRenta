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
from django.core.mail import EmailMultiAlternatives
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
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        
        # Cuerpo del mensaje en texto plano (opcional)
        text_content = f'Hola {user.username},\n\nGracias por registrarte en nuestra plataforma.'

        # Cuerpo del mensaje en HTML con una imagen
        html_content = f"""
         <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <table style="width: 100%; max-width: 600px; background-color: #ffffff; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                    <tr>
                        <td style="text-align: center;">
                            <h2 style="color: #333;">Hola {user.username},</h2>
                            <p style="font-size: 16px; color: #555;  font-family: Afacad Flux, sans-serif;">
                                Gracias por registrarte en nuestra plataforma. ¡Estamos felices de tenerte con nosotros! ❤️🙌 🐳
                            </p>
                            <img src="https://i.pinimg.com/736x/67/c4/97/67c497c204d30e7a4ec098159fc899d9.jpg" alt="Welcome Image" style="width: 100%; max-width: 300px; height: auto; margin-top: 20px;">
                            <p style="font-size: 14px; color: #999; margin-top: 20px;">
                                Si tienes alguna duda, no dudes en contactarnos.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding-top: 20px;">
                            <a href="http://localhost:5173/" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                Ir a la plataforma
                            </a>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        """

        # Crear el correo con contenido alternativo (texto y HTML)
        msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
        msg.attach_alternative(html_content, "text/html")
        msg.send()


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
