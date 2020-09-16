from django.test import TestCase
from django.core.paginator import Paginator
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
            self.assertEqual(post.likes.count(), 0)

    def test_like_post(self):
        u1 = User.objects.get(username="u1")
        u3 = User.objects.get(username="u3")
        post = u3.posts.get()
        post.likes.add(u1)
        self.assertIn(u1, post.likes.all())
        self.assertEqual(post.likes.count(), 1)
        self.assertEqual(u1.posts_liked.count(), 1)

            
    def test_user_no_follows(self):
        u = User.objects.get(username="u1")
        self.assertEqual(u.follows.count(), 0)
    
    def test_follow_user(self):
        u1 = User.objects.get(username="u1")
        u2 = User.objects.get(username="u2")
        u1.follows.add(u2)
        self.assertIn(u2,u1.follows.all())
        self.assertNotIn(u2,u2.follows.all())
        self.assertIn(u1,u2.followed_by.all())
        self.assertEqual(u1.follows.count(), 1)
        self.assertEqual(u2.followed_by.count(), 1)

    def test_posts_pagination(self):
        posts = Post.objects.all()
        paginator = Paginator(posts, 2)
        self.assertEqual(paginator.count, 4)
        self.assertEqual(paginator.num_pages, 2)


        
