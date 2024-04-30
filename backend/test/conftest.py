import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.app import Users, create_app, db, app
from datetime import datetime

@pytest.fixture(scope='module')
def app():
    
    app = create_app('testing')  
    with app.app_context():
        db.create_all()  
        yield app
        db.session.remove()
        db.drop_all()  

@pytest.fixture(scope='module')
def test_client(app):
    
    testing_client = app.test_client()
    ctx = app.app_context()
    ctx.push() 
    yield testing_client
    ctx.pop()  

@pytest.fixture(scope='module')
def init_database(app):
    
    with app.app_context():  
        
        user1 = Users(username='testuser1', email='test1@example.com', dob=datetime.strptime('1990-01-01', '%Y-%m-%d').date(), fullname='Test User 1', password='hashed_password', gender='male')
        user2 = Users(username='testuser2', email='test2@example.com', dob=datetime.strptime('1990-02-02', '%Y-%m-%d').date(), fullname='Test User 2', password='hashed_password', gender='female')
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        yield  

        db.session.remove()