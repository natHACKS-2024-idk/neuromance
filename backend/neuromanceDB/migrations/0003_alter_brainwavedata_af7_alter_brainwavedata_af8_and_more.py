# Generated by Django 5.1.3 on 2024-11-16 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('neuromanceDB', '0002_rename_name_individual_firstname_individual_age_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='brainwavedata',
            name='af7',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='brainwavedata',
            name='af8',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='brainwavedata',
            name='time',
            field=models.FloatField(),
        ),
    ]