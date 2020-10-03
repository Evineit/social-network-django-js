
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("following", views.following, name="following"),
    path("user/<int:userid>", views.profile, name="profile"),
    path("user/follow", views.follow, name="follow"),
    path("user/unfollow", views.unfollow, name="unfollow"),
    path("posts", views.compose, name="compose"),
    path("posts/all", views.all_posts, name="all_posts"),
    path("posts/<int:post_id>", views.edit, name="edit"),
    path("posts/following", views.following_posts, name="following_posts"),
    path("posts/user/<int:userid>", views.profile_posts, name="profile_posts"),
    path("posts/user/<str:username>", views.profile_posts_by_name, name="profile_posts"),

]
