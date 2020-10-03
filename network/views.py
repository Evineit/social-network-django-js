import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime

from django.core.paginator import Paginator
from .models import User,Post


def index(request):
    server_posts = Post.objects.order_by('-timestamp').all()
    paginator = Paginator([post.serialize() for post in server_posts], 2)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html",{
        "page_obj":page_obj
    })


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
    paginator = Paginator([post.serialize() for post in server_posts], 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return JsonResponse(page_obj.object_list,safe=False) 

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

@login_required
def following_posts(request):
    user = request.user
    posts = []
    for follow in user.follows.all():
        follow_posts = [post.serialize() for post in follow.posts.all()]
        for post in follow_posts:
            posts.append(post)
    posts.sort(key= lambda post: datetime.strptime(post["timestamp"],'%b %d %Y, %I:%M %p'), reverse=True)
    return JsonResponse(posts,safe=False) 

@login_required
def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    if not data.get("username"):
        return JsonResponse({
            "error": "User id to followed required."
        }, status=400)
    user = request.user
    follower_id = data.get("username")
    follower = User.objects.get(username = follower_id)
    if user.id == follower.id:
        return JsonResponse({
            "error": "User and follower must be different."
        }, status=403)
    if follower not in user.follows.all():
        user.follows.add(follower)
    return JsonResponse({"message": "Follower added successfully."}, status=201)

@login_required
def unfollow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    if not data.get("username"):
        return JsonResponse({
            "error": "User id to followed required."
        }, status=400)
    user = request.user
    follower_id = data.get("username")
    follower = User.objects.get(username = follower_id)

    if follower in user.follows.all():
        user.follows.remove(follower)
    return JsonResponse({"message": "Follower removed successfully."}, status=201)


def profile(request, userid):
    try:
        user = User.objects.get(id=userid)
    except User.DoesNotExist:
        return JsonResponse({
                "error": f"User with id {userid} does not exist."
        }, status=400)
    server_posts = user.posts.order_by('-timestamp').all()
    paginator = Paginator([post.serialize() for post in server_posts], 2)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/profile.html",{
        "profile_user":user,
        "page_obj":page_obj
    })

@login_required
def following(request):
    user = request.user
    posts = []
    for follow in user.follows.all():
        follow_posts = [post.serialize() for post in follow.posts.all()]
        for post in follow_posts:
            posts.append(post)
    posts.sort(key= lambda post: datetime.strptime(post["timestamp"],'%b %d %Y, %I:%M %p'), reverse=True)
    paginator = Paginator(posts, 2)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/following.html",{
        "page_obj":page_obj
    }
    )
