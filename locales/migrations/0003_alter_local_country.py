# Generated by Django 5.0.7 on 2024-07-20 17:37

import django_countries.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('locales', '0002_alter_local_country'),
    ]

    operations = [
        migrations.AlterField(
            model_name='local',
            name='country',
            field=django_countries.fields.CountryField(blank=True, max_length=2, null=True),
        ),
    ]
