from django.test import TestCase, Client
import os 
import pathlib
import unittest
from .models import *
import datetime
import json


# Create your tests here.

class AddPostTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser",password="testpassword",email="test@email.com")
        self.user2 = User.objects.create_user(username="tester2",password="pass2",email="second@email.com")


    def tearDown(self):
        Post.objects.all().delete()
        User.objects.all().delete()


    def test_add_post_correctly(self):
        c=Client()
        c.login(username="testuser",password="testpassword")
        data = {
            'content':'This is a test'
        }

        response = c.post("/add_post",data = json.dumps(data),content_type="application/json")
        
        self.assertEqual(response.status_code,201)
        self.assertEqual(Post.objects.count(),1)


    def test_add_post_incorrectly(self):
        c=Client()
        c.login(username="testuser",password="testpassword")
        data = {
            'content':'    '
        }
        response = c.post("/add_post",data = json.dumps(data),content_type="application/json")

        self.assertEqual(response.status_code,400)
        self.assertEqual(Post.objects.count(),0)


    def test_likes_and_unlikes(self):
        c=Client()
        c.login(username="testuser",password="testpassword")
        data = {
            'content':'this is a test'
        }
        c.post("/add_post",data = json.dumps(data),content_type="application/json")
        data_for_like = {
            'postId':'1'
        }
        response = c.post("/like",data = json.dumps(data_for_like),content_type="application/json")

        self.assertEqual(response.status_code,201)
        self.assertEqual(Like.objects.count(),1)

        response = c.delete("/like",data = json.dumps(data_for_like),content_type="application/json")

        self.assertEqual(response.status_code,201)
        self.assertEqual(Like.objects.count(),0)


    def test_correct_and_incorrect_edit(self):
        c=Client()
        c.login(username="testuser",password="testpassword")
        data = {
            'content':'this is a test'
        }
        c.post("/add_post",data = json.dumps(data),content_type="application/json")
        data_for_edit = {
            'new_content':'Editing..',
            'postId':'1'
        }
        response = c.put("/edit",data = json.dumps(data_for_edit),content_type="application/json")
        
        self.assertEqual(response.status_code,201)
        
        post = Post.objects.get(pk=1)
        new_content = 'Editing..'
        
        self.assertEqual(post.content,new_content)

        incorrect_edit = {
            'new_content':'    ',
            'postId':'1'
        }
        response = c.put("/edit",data = json.dumps(incorrect_edit),content_type="application/json")

        self.assertEqual(response.status_code,400)


    def test_follow_and_unfollow(self):
        c = Client()
        c.login(username="testuser",password="testpassword")
        data = {
            'follow_id':'2'
        }
        response = c.post("/follow",data = json.dumps(data),content_type="application/json")
        
        self.assertEqual(response.status_code,201)
        c.logout()
        
        c.login(username="tester2",password="pass2")
        data2 = {
            'follow_id':'1'
        }
        response = c.post("/follow",data = json.dumps(data2),content_type="application/json")

        self.assertEqual(response.status_code,201)
        self.assertEqual(Follow.objects.count(),2)

        response = c.delete("/unfollow",data = json.dumps(data2), content_type="application/json")

        self.assertEqual(response.status_code,201)
        self.assertEqual(Follow.objects.count(),1)


    

        







    
    


