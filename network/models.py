from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    content = models.TextField()
    timestamp = models.DateTimeField()

    def serialize(self):
        return {
            "id":self.id,
            "poster":self.poster.username,
            "poster_id":self.poster.id,
            "content":self.content,
            "timestamp":self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"{self.poster} wrote a post on {self.timestamp}"

class Follow(models.Model):
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")

    def __str__(self):
        return f"{self.follower} follows {self.followed}"

