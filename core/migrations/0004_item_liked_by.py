# Generated by Django 2.2.4 on 2020-09-22 03:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20200921_1802'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='liked_by',
            field=models.ManyToManyField(blank=True, to='core.UserProfile'),
        ),
    ]
