# Generated by Django 4.1.1 on 2023-07-17 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SalonSigoApp', '0003_alter_signing_procedure'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='signing',
            name='master',
        ),
        migrations.AddField(
            model_name='procedure',
            name='master_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.DeleteModel(
            name='Master',
        ),
    ]