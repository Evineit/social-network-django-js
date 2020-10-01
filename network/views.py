import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User,Post


def index(request):
    return render(request, "network/index.html")


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

def compose(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    if not data.get("body"):
        return JsonResponse({
            "error": "At least one character required."
        }, status=400)

    body = data.get("body","")
    post = Post(
        user = request.user,
        body = body
    )
    post.save()
    return JsonResponse({"message": "Post posted successfully."}, status=201)

def all_posts(request):
    server_posts = Post.objects.order_by('-timestamp').all()
    # posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in server_posts],safe=False) 

def profile_posts(request,userid):
    try:
            user = User.objects.get(id=userid)
    except User.DoesNotExist:
        return JsonResponse({
                "error": f"User with id {userid} does not exist."
        }, status=400)
    server_posts = user.posts.order_by('-timestamp').all()
    return JsonResponse([post.serialize() for post in server_posts],safe=False) 


def profile_posts_by_name(request,username):
    user = User.objects.get(username=username)
    return profile_posts(request, user.id)

def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    if not data.get("user_id"):
        return JsonResponse({
            "error": "User id to followed required."
        }, status=400)
    user = request.user
    follower_id = data.get("user_id")
    follower = User.objects.get(pk=follower_id)
    if follower not in user.follows.all():
        user.follows.add(follower)
    return JsonResponse({"message": "Follower added successfully."}, status=201)


        

def unfollow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    if not data.get("user_id"):
        return JsonResponse({
            "error": "User id to followed required."
        }, status=400)
    user = request.user
    follower_id = data.get("user_id")
    follower = User.objects.get(pk=follower_id)

    if follower in user.follows.all():
        user.follow.removes(follower)
    return JsonResponse({"message": "Follower removed successfully."}, status=201)


def profile(request, userid):
    try:
            user = User.objects.get(id=userid)
    except User.DoesNotExist:
        return JsonResponse({
                "error": f"User with id {userid} does not exist."
        }, status=400)
    return render(request, "network/profile.html",{
        "profile_user":user
    })


