# Generated by Django 5.1.1 on 2024-09-07 04:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('puplicaciones', '0004_imagen'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='alquiler',
            name='image_url',
        ),
        migrations.RemoveField(
            model_name='alquiler',
            name='imagen',
        ),
        migrations.CreateModel(
            name='ImagenAlquiler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='alquileres/')),
                ('image_url', models.URLField(blank=True, null=True)),
                ('alquiler', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='imagenes', to='puplicaciones.alquiler')),
            ],
        ),
        migrations.DeleteModel(
            name='Imagen',
        ),
    ]