# Generated by Django 5.1.1 on 2024-10-11 03:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_profile_facebook_profile_instagram'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='username',
        ),
    ]
