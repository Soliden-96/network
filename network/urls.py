
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add_post", views.add_post, name="add_post"),
    path("following", views.following, name="following"),
    path("profile/<int:id>", views.profile, name="profile"),
    path("follow", views.follow, name="follow"),
    path("unfollow", views.unfollow, name="unfollow"),
    path("edit", views.edit, name="edit"),
    path("like", views.like, name="like")
]
