# Generated by Django 4.2.4 on 2023-10-01 11:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_user_followers_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
    ]
