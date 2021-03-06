# Generated by Django 2.2.4 on 2020-09-21 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_item_liked_by'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='liked_by',
        ),
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('price', models.FloatField()),
                ('discount_price', models.FloatField(blank=True, null=True)),
                ('category', models.CharField(choices=[('S', 'Shirt'), ('SW', 'Sport wear'), ('OW', 'Outwear')], max_length=100)),
                ('label', models.CharField(choices=[('P', 'primary'), ('S', 'secondary'), ('D', 'danger')], max_length=20)),
                ('slug', models.SlugField()),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to='images/')),
                ('liked_by', models.ManyToManyField(blank=True, to='core.UserProfile')),
            ],
        ),
    ]
