from django.test import TestCase, Client
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
import os 
import pathlib
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from .models import Post, User
import datetime
import json


# Create your tests here.

class AddPostTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser",password="testpassword",email="test@email.com")

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


def file_uri(filename):
        return pathlib.Path(os.path.abspath(filename)).as_uri()



class WebPageTests(StaticLiveServerTestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser",password="testpassword",email="test@email.com")
        self.driver = webdriver.Chrome()

    def tearDown(self):
        Post.objects.all().delete()
        User.objects.all().delete()
        self.driver.quit()

    
    def test_adds_post_to_page(self):
        c = Client()
        c.login(username="testuser", password="testpassword")

        self.driver.get(self.live_server_url + "")
        self.driver.implicitly_wait(3)

        posts = self.driver.find_element(By.ID,"posts")
        if posts.find_elements(By.CLASS_NAME,"post"):
            elements = posts.find_elements(By.CLASS_NAME,"post")
            count = len(elements)
        else:
            count = 0
        
        textarea = self.driver.find_element(By.ID,"new-post-text")
        submit = self.driver.find_element(By.ID,"new-post-button")

        textarea.send_keys("This is a new post")
        submit.click()
        
        self.driver.implicitly_wait(3)
        self.driver.refresh()
        self.driver.implicitly_wait(20)

        posts = self.driver.find_element(By.ID,"posts")
        new_elements = posts.find_elements(By.CLASS_NAME,"post")
        new_count = len(new_elements)

        self.assertEqual(new_count,count+1)
    
    


