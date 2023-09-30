from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    followers = models.ManyToManyField('network.User',related_name="follows")
    pass

class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    content = models.TextField()
    timestamp = models.DateTimeField()
    likes = models.PositiveIntegerField(default = 0)

    def __str__(self):
        return f"{self.poster} wrote a post on {self.timestamp} that has received {self.likes} likes"
