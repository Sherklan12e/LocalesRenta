# Generated by Django 5.1.1 on 2024-09-17 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_profile_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profile_picture',
            field=models.ImageField(blank=True, default='juan.jpg', null=True, upload_to='profile_perfil/'),
        ),
    ]
