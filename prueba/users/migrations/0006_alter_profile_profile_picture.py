# Generated by Django 5.1.1 on 2024-09-17 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_profile_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profile_picture',
            field=models.ImageField(blank=True, default='defaultProfile.jpg', null=True, upload_to='profile_perfil/'),
        ),
    ]