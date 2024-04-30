import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.app import Users, create_app, db, app


@pytest.fixture(scope='module')
def app():
    """创建并配置一个用于测试的 Flask 应用实例"""
    app = create_app('testing')  # 创建一个测试专用的 Flask 应用
    with app.app_context():
        db.create_all()  # 在应用上下文中创建数据库表
        yield app
        db.session.remove()
        db.drop_all()  # 测试完成后清理数据库

@pytest.fixture(scope='module')
def test_client(app):
    """创建一个测试客户端，该客户端可以用于发送测试请求"""
    testing_client = app.test_client()
    ctx = app.app_context()
    ctx.push()  # 显式地推送上下文
    yield testing_client
    ctx.pop()  # 测试结束后，清理上下文

@pytest.fixture(scope='module')
def init_database(app):
    """初始化测试数据库，包括添加初始数据"""
    with app.app_context():  # 确保所有数据库操作都在应用上下文中执行
        # 创建和提交用户数据
        user1 = Users(username='testuser1', email='test1@example.com', dob='1990-01-01', fullname='Test User 1', password='hashed_password', gender='male')
        user2 = Users(username='testuser2', email='test2@example.com', dob='1990-02-02', fullname='Test User 2', password='hashed_password', gender='female')
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        yield  # 提供数据库给测试用例使用

        db.session.remove()