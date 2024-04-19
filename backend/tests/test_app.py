import pytest
from unittest.mock import patch
from app import app, Appointment

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.append(root_dir)

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('app.db.session.commit')
def test_make_appointment(mock_commit, client):
    # 模拟请求数据
    appointment_data = {
        'doctorId': 1,
        'patientId': 1,
        'appointment_time': '2024-04-20'
    }
    
    # 发送模拟请求
    response = client.post('/api/patient/makeAppointment', json=appointment_data)

    # 断言响应状态码
    assert response.status_code == 200

    # 断言 mock_commit 被调用，即提交数据库会话
    mock_commit.assert_called_once()

    # 检查响应内容是否与预期一致
    assert response.json == {"message": "appointment scheduled!"}

    # 检查数据库中是否添加了预期的约会记录
    appointment = Appointment.query.filter_by(patientId=1, doctorId=1).first()
    assert appointment is not None
    assert appointment.appointment_time == '2024-04-20'
