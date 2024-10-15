from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

@receiver(user_logged_in)
def send_login_notification(sender, request, user, **kwargs):
    subject = 'Iniciaste sesión en otro dispositivo 😁😁😁'
    message = f'Hola {user.username},\n\nHas iniciado sesión en tu cuenta desde un nuevo dispositivo.'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)