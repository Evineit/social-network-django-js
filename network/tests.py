from django.test import TestCase
from .models import User, Post

# Create your tests here.
class PostTestCase(TestCase):
    def setUp(self):
        # Create users.
        u1 = User.objects.create_user(username="u1", email="u1@seidai.com", password="pass1234")
        u2 = User.objects.create_user(username="u2", email="u2@seidai.com", password="pass1234")
        u3 = User.objects.create_user(username="u3", email="u3@seidai.com", password="pass1234")
    
        # Create posts.
        Post.objects.create(user=u1, body="City A")
        Post.objects.create(user=u1, body="City B")
        Post.objects.create(user=u2, body="City C")
        Post.objects.create(user=u3, body="City D")
    def test_posts_count(self):
        u = User.objects.get(username="u1")
        self.assertEqual(u.posts.count(), 2)
    
    def test_posts_timestamp(self):
        u = User.objects.get(username="u1")
        for post in u.posts.all():
            self.assertTrue(post.timestamp)
    
    def test_post_no_likes(self):
        u = User.objects.get(username="u1")
        for post in u.posts.all():
            self.assertEqual(post.likes.count(),0)
            

        