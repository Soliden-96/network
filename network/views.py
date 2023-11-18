from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core import serializers
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
import datetime
import json
import time
import math

from .models import *


def index(request):
    post_list = Post.objects.all()
    post_list = post_list.order_by("-timestamp").all()   

    paginator = Paginator(post_list,10)
    page_number = request.GET.get('page')
    post_list = paginator.get_page(page_number)

    liked = []
    if request.user.is_authenticated:
        user_likes = Like.objects.filter(liker=request.user)
        liked = Post.objects.filter(likes__in=user_likes)

    
    return render(request, "network/index.html",{"post_list":post_list,"liked":liked})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def add_post(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error":"You must login to create a post"},status=400) 

    if request.method != "POST":
        return JsonResponse({"error":"Post request required"}, status=400)
    
    data = json.loads(request.body)

    if data.get("content","").strip() == "":
        return JsonResponse({"error":"Empty post"},status=400)
    
    content = data.get("content","")
    
    post = Post(
        poster = request.user,
        content = content,
        timestamp = timezone.now()
    )
    post.save()

    return JsonResponse({"message":"Posted successfully","post":post.serialize()},status = 201)

@login_required
def following(request):
    followed = Follow.objects.filter(follower=request.user).values("followed")
    post_list = Post.objects.filter(poster__in=followed)
    post_list = post_list.order_by("-timestamp").all()

    paginator = Paginator(post_list,10)
    page_number = request.GET.get('page')
    post_list = paginator.get_page(page_number)

    liked = []
    if request.user.is_authenticated:
        user_likes = Like.objects.filter(liker=request.user)
        liked = Post.objects.filter(likes__in=user_likes)

    return render(request, "network/following.html", {"post_list":post_list,"liked":liked})


def profile(request,id):
    user_profile = User.objects.get(id=id)
    followed = Follow.objects.filter(followed=user_profile, follower=request.user).exists()
    followers = Follow.objects.filter(followed=user_profile).count()
    following = Follow.objects.filter(follower=user_profile).count()
    post_list = Post.objects.filter(poster_id=id)
    post_list = post_list.order_by("-timestamp").all()

    paginator = Paginator(post_list,10)
    page_number = request.GET.get('page')
    post_list = paginator.get_page(page_number)

    liked = []
    if request.user.is_authenticated:
        user_likes = Like.objects.filter(liker=request.user)
        liked = Post.objects.filter(likes__in=user_likes)

    context = {
        "user_profile":user_profile,
        "followed":followed,
        "followers":followers,
        "following":following,
        "post_list":post_list,
        "liked":liked
    }

    return render(request, "network/profile.html",context)

@login_required
def follow(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error":"you must login to follow"},status=400)

    if request.method != "POST":
        return JsonResponse({"error":"Invalid request"},status=400)
    
    follower = request.user

    data = json.loads(request.body)
    followed_id = data.get("follow_id", "")
    followed = User.objects.get(pk=followed_id)

    follow = Follow(follower=follower, followed=followed)
    follow.save()

    return JsonResponse({"message":f"{follower} now follows {followed}"},status=201)

@login_required
def unfollow(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error":"you must login to unfollow"},status=400)

    if request.method != "DELETE":
        return JsonResponse({"error":"Invalid request"},status=400)

    follower = request.user

    data = json.loads(request.body)
    followed_id = data.get("follow_id", "")
    followed = User.objects.get(pk=followed_id)

    Follow.objects.filter(follower=follower, followed=followed).delete()

    return JsonResponse({"message":f"{follower} unfollowed {followed}"}, status=201)

@login_required
def edit(request):
    if request.method != "PUT":
        return JsonResponse({"error":"Invalid request"},status=400)

    data = json.loads(request.body)
    post_id = data.get("postId","")
    
    if data.get("new_content","").strip() == "":
        return JsonResponse({"error":"Empty post"},status=400)
    
    new_content = data.get("new_content", "")
    post = Post.objects.get(id=post_id)

    if post.poster_id != request.user.id:
        return JsonResponse({"error":"youcan't edit this post"},status=400)
        
    post.content = new_content
    post.save()

    return JsonResponse({"message":"post edited succesfully"},status=201)

@login_required
def like(request):
    if request.method != "DELETE" and request.method != "POST":
        return JsonResponse({"error":"Invalid request"},status=400)

    if request.method == "DELETE":
        data = json.loads(request.body)
        post_id = data.get("postId","")
        liked_post = Post.objects.get(pk=post_id)
        Like.objects.filter(liked_post=liked_post,liker=request.user).delete()

        return JsonResponse({"message":"Post unliked succesfully"},status=201)
    
    if request.method == "POST":
        data = json.loads(request.body)
        post_id = data.get("postId","")
        liked_post = Post.objects.get(pk=post_id)
        like = Like(liked_post=liked_post,liker=request.user)
        like.save()

        return JsonResponse({"message":"Post liked succesffully"},status=201)


        

