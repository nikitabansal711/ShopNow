# Generated by Django 2.2.4 on 2020-09-21 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0003_user_contact_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='receive_newsletter',
        ),
        migrations.AlterField(
            model_name='user',
            name='birth_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
