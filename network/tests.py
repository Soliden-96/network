from django.test import TestCase,Client
import os 
import pathlib
import unittest
from selenium import webdriver
from .models import Post, User
import datetime
import json

# Create your tests here.

class AddPostTestCAse(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser",password="testpassword",email="test@email.com")

    def test_add_post(self):
        c=Client()
        c.login(username="testuser",password="testpassword")
        data = {
            'content':'This is a test'
        }

        response = c.post("/add_post",data = json.dumps(data),content_type="application/json")
        
        self.assertEqual(response.status_code,201)
        self.assertEqual(Post.objects.count(),1)
