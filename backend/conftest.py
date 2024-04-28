import pytest
from app import app, db

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    testing_client = app.test_client()
    ctx = app.app_context()
    ctx.push()
    yield testing_client  

    ctx.pop()

@pytest.fixture(scope='module')
def init_database():
    
    db.create_all()

    user1 = app.Users(username='testuser1', email='test1@example.com', dob='1990-01-01', fullname='Test User 1', password='hashed_password', gender='male')
    user2 = app.Users(username='testuser2', email='test2@example.com', dob='1990-02-02', fullname='Test User 2', password='hashed_password', gender='female')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    yield db  

    db.session.remove()
    db.drop_all()
