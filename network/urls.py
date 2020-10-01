
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("user/<int:userid>", views.profile, name="profile"),
    path("posts", views.compose, name="compose"),
    path("posts/all", views.all_posts, name="all_posts"),
    path("posts/<int:userid>", views.profile_posts, name="profile_posts"),
    path("posts/<str:username>", views.profile_posts_by_name, name="profile_posts"),

]
