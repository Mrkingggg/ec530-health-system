import pytest
from app import app, db, Role, Users
from datetime import datetime
from werkzeug.security import generate_password_hash,check_password_hash

@pytest.fixture
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # create_test_data()
        yield client
        with app.app_context():
            db.session.remove()
            db.drop_all()

# def create_test_data():
    
#     db.create_all()

    
#     role_patient = Role(rolename='patient')
#     role_doctor = Role(rolename='doctor')
#     db.session.add_all([role_patient, role_doctor])
#     db.session.commit()

    
#     user_patient = Users(username='patient1', email='patient1@example.com', dob=datetime.strptime('1900-01-01T00:00:00', '%Y-%m-%dT%H:%M:%S'), fullname='Patient One', password='password', gender='male')
#     user_doctor = Users(username='doctor1', email='doctor1@example.com', dob=datetime.strptime('1980-11-24T00:00:00', '%Y-%m-%dT%H:%M:%S'), fullname='Doctor One', password='password', gender='female')
#     user_patient.roles.append(role_patient)
#     user_doctor.roles.append(role_doctor)
#     db.session.add_all([user_patient, user_doctor])
#     db.session.commit()

# def test_initialization(test_client):
    
#     assert Role.query.count() == 2
#     assert Users.query.count() == 2

def test_hello(test_client):
    # print(app.url_map)
    response = test_client.get('/api/users/hello')
    assert response.status_code == 200
    assert b"hello world" in response.data

def test_add_user(test_client):
    
    response = test_client.post('/api/users/add', json={
        'username': 'john',
        'email': 'john@example.com',
        'dob': '1990-01-01',
        'fullname': 'John Doe',
        'password': '123456',
        'gender': 'male'
    })
    assert response.status_code == 201

    
    response = test_client.post('/api/users/add', json={
        'username': 'john2'
    })
    assert response.status_code == 400

   
    response = test_client.post('/api/users/add', json={
        'username': 'jane',
        'email': 'jane@example.com',
        'dob': '01-01-1990',
        'fullname': 'Jane Doe',
        'password': '123456',
        'gender': 'female'
    })
    assert response.status_code == 400

def test_change_user_role(test_client):
    
    response = test_client.post('/api/users/add', json={
        'username': 'jane',
        'email': 'jane@gmail.com',
        'dob': '1990-02-02',
        'fullname': 'jane white',
        'password': 'janewhite222',
        'gender': 'female',
        'role_ids': [1,2]
    })
    user_id = response.json['userId']

    
    response = test_client.put(f'/api/users/changeRole', json={
        'userId': user_id,
        'newRoles': [1,3]
    })
    assert response.status_code == 200


    response = test_client.put('/api/users/changeRole', json={
        'userId': 99999,
        'newRoles': [1]
    })
    assert response.status_code == 404

  
    response = test_client.put('/api/users/changeRole', json={
        'userId': user_id
    })
    assert response.status_code == 404



# def test_send_notification(test_client):
    
#     response = test_client.post('/api/notifications/send', json={
#         'userId': 1,
#         'msg': 'Test Message'
#     })
#     assert response.status_code == 202

    
#     response = test_client.post('/api/notifications/send', json={
#         'userId': 999,
#         'msg': 'Test Message'
#     })
#     assert response.status_code == 400

    
#     response = test_client.post('/api/notifications/send', json={
#         'userId': 1
#     })
#     assert response.status_code == 400


def test_login(test_client):
    response = test_client.post('/api/users/add', json={
        'username': 'jane',
        'email': 'jane@gmail.com',
        'dob': '1990-02-02',
        'fullname': 'jane white',
        'password': 'janewhite222',
        'gender': 'female',
        'role_ids': [1,2]
    })
    assert response.status_code==201
    
    response = test_client.post('/api/auth/login', json={
        'username': 'jane',
        'password': 'janewhite222',
        'role': '1'
    })
    
    assert response.status_code == 200
    

   
    response = test_client.post('/api/auth/login', json={
        'username': 'jane',
        'inputpsw': '',
        'sel_role': 1
    })
    assert response.status_code == 401
    # assert "incorrect password" in response.json['error']

   
    response = test_client.post('/api/auth/login', json={
        'username': 'null',
        'inputpsw': 'janewhite222',
        'sel_role': 1
    })
    assert response.status_code == 400

    response = test_client.post('/api/auth/login', json={
        'username':'jane',
        'inputpsw':'janewhite222',
        'sel_role':3
    })
    assert response.status_code==402
    


def test_browse_patients(test_client):
    response = test_client.get('/api/MP/browsePatient')
    assert response.status_code == 200
    assert isinstance(response.json, list)  

def test_make_appointment(test_client):
    
    response = test_client.post('/api/patient/makeAppointment', json={
        'doctorId': 2,
        'patientId': 1,
        'appointment_time': '2023-10-01T15:00:00'
    })
    assert response.status_code == 200
    assert "appointment scheduled" in response.json['message']

    
    response = test_client.post('/api/patient/makeAppointment', json={
        'doctorId': 2,
        'patientId': 1,
        'appointment_time': '10-01-2023 15:00'
    })
    assert response.status_code == 404

def test_add_measurement(test_client):
    
    response = test_client.post('/api/MP/addMeasureData', json={
        'userId': 1,
        'deviceId': 1,
        'value': '120',
        'measuretime': '2023-10-01T15:00:00',
        'measuretype': 'blood_pressure'
    })
    assert response.status_code == 200
    assert "add measurement succeed!" in response.json['message']

    
    response = test_client.post('/api/MP/addMeasureData', json={
        'userId': 1
    })
    assert response.status_code == 400
    assert "Missing info" in response.json['error']


def test_register_device(test_client):
    
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp',
        'devType': 'Heart Monitor',
        'status': 1,
        'unit': 'bpm'
    })
    assert response.status_code == 200
    assert "Device registered successfully" in response.json['message']

    
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp'
    })
    assert response.status_code == 400
    assert "missing information" in response.json['error']


def test_view_device(test_client):
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp',
        'devType': 'Heart Monitor',
        'status': 0,
        'unit': 'bpm'
    })
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp1',
        'devType': 'Heart Monitor',
        'status': 0,
        'unit': 'bpm'
    })

    response = test_client.get('/api/admin/viewDevice')
    assert response.status_code == 200
    
    assert isinstance(response.json, list)


def test_delete_device(test_client):
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp1',
        'devType': 'Heart Monitor',
        'status': 0,
        'unit': 'bpm'
    })
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp',
        'devType': 'Heart Monitor',
        'status': 0,
        'unit': 'bpm'
    })

    response = test_client.delete('/api/admin/deldev/1')
    assert response.status_code == 200
    assert "Device deleted successfully" in response.json['message']

    
    response = test_client.delete('/api/admin/deldev/999')
    assert response.status_code == 400
    assert "device does not exist" in response.json['bad request']

def test_change_device_status(test_client):
    response = test_client.post('/api/admin/RegisDevice', json={
        'manufactor': 'TestCorp',
        'devType': 'Heart Monitor',
        'status': 1,
        'unit': 'bpm'
    })
    response = test_client.put('/api/admin/1/chgstatus', json={'status': 0})
    assert response.status_code == 200
    assert "Device status updated" in response.json['message']

    
    response = test_client.put('/api/admin/999/chgstatus', json={'status': 0})
    assert response.status_code == 404
    assert "Device not found" in response.json['error']


def test_view_appointment(test_client):
    response = test_client.post('/api/patient/makeAppointment', json={
        'doctorId': 2,
        'patientId': 1,
        'appointment_time': '2023-10-01T15:00:00'
    })

    response = test_client.get('/api/MP/view_appointment?doctorId=1')
    assert response.status_code == 200
    assert isinstance(response.json, list)  

    
    response = test_client.get('/api/MP/view_appointment')
    assert response.status_code == 400
    assert "doctor_id not found" in response.json['error']


def test_add_chat_patient(test_client):
    
    response = test_client.post('/api/MP/add_chat_patient', json={
        'MPid': 1,
        'patientid': 2
    })
    assert response.status_code == 200
    assert "succeed in adding chat patient" in response.json['message']

    
    response = test_client.post('/api/MP/add_chat_patient', json={
        'MPid': 1
    })
    assert response.status_code == 400
    assert "missing info" in response.json['error']


def test_remove_chat_patient(test_client):
    response = test_client.post('/api/MP/add_chat_patient', json={
        'MPid': 1,
        'patientid': 2
    })
    response = test_client.delete('/api/MP/remove_chat_patient?MPid=1&patientid=2')
    assert response.status_code == 200
    assert "delete this chat pair" in response.json['message']

    
    response = test_client.delete('/api/MP/remove_chat_patient?MPid=1&patientid=999')
    assert response.status_code == 404
    assert "No such chat pair" in response.json['error']
