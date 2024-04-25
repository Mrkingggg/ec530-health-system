from datetime import datetime
from flask import Flask, jsonify, request,session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash,check_password_hash
from flask_marshmallow import Marshmallow
from queue import Queue
import threading
import uuid
from flask_cors import CORS
from datetime import datetime, timezone
from flask_socketio import SocketIO, emit, join_room

# pip install -r requirements.txt -- apply the requirements.txt in various environments.

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})



#connect to my database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root1234@localhost:3306/HealthApp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '2fdbf97d3094c3c8896e173f16c55fcb'
app.secret_key = '2fdbf97d3094c3c8896e173f16c55fcb'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
ma  = Marshmallow(app) 
report_queue = Queue() # report queue
reports_status = {} 
notification_queue = Queue()
socketio = SocketIO(app)


# medium tables:
rolesmap = db.Table('rolesmap', 
                    db.Column('userId',db.Integer, db.ForeignKey('users.userId'), primary_key=True),
                    db.Column('roleId',db.Integer, db.ForeignKey('role.roleId'), primary_key=True)
                    )

class ChatHistory(db.Model):
    __tablename__='ChatHistory'
    msgid = db.Column(db.Integer, primary_key = True)
    MPid = db.Column(db.Integer, db.ForeignKey('users.userId'), nullable = False)
    patientid = db.Column(db.Integer, db.ForeignKey('users.userId'), nullable = False)
    message = db.Column(db.String(255), nullable = False)
    sendtime = db.Column(db.DateTime, nullable = False, default = datetime.now(timezone.utc))
    status = db.Column(db.Enum('sent','unsent'), nullable = False)
    direction = db.Column(db.Enum('recv','send'), default = 'send')
    
    def format_msg(self):
        mp = Users.query.get(self.MPid)
        patient = Users.query.get(self.patientid)
        if(self.status == 'send'):
            return {f"{mp.fullname} to {patient.fullname}":self.message}
        elif(self.status == 'recv'):
            return {f"{patient.fullname} to {mp.fullname}":self.message}
        else:
            return {"error":"Error Chat"}


class ChatPairs(db.Model):
    __tablename__ = 'ChatPairs'
    pairid = db.Column(db.Integer, primary_key = True)
    MPid = db.Column(db.Integer, db.ForeignKey('users.userId'))
    patientid = db.Column(db.Integer, db.ForeignKey('users.userId'))
    mp = db.relationship('Users', foreign_keys=[MPid], backref=db.backref('initiated_chats', lazy='dynamic'))
    patient = db.relationship('Users', foreign_keys=[patientid], backref=db.backref('received_chats', lazy='dynamic'))


# database models: 
class Measurements(db.Model):
    __tablename__ = 'measurements'
    MeasurementId = db.Column(db.Integer, primary_key=True)
    deviceId  = db.Column(db.Integer, db.ForeignKey('device.deviceId'))
    userId = db.Column(db.Integer, db.ForeignKey('users.userId'))
    value = db.Column(db.String(150), nullable=True) 
    measuretime = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    measuretype = db.Column(db.String(255), nullable=False)
    device = db.relationship('Device', back_populates='measurements')


class Users(db.Model):
    __tablename__ = 'users'
    userId = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(150),unique = True, nullable=False)
    email = db.Column(db.String(150), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    fullname = db.Column(db.String(150), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.Enum('female','male','other'), unique=True, nullable=False)
    roles = db.relationship('Role', secondary=rolesmap, backref=db.backref('users', lazy='dynamic'))
    measurements = db.relationship('Measurements', backref='user', lazy=True)
    

class Role(db.Model):
    __tablename__ = 'role'
    roleId = db.Column(db.Integer, primary_key = True)
    rolename = db.Column(db.Enum('patient','doctor','admin'), unique=True, nullable=False) # patient 1, doctor 2, admin 3

class Device(db.Model):
    __tablename__ = 'device'
    deviceId = db.Column(db.Integer, primary_key = True)
    manufactor = db.Column(db.String(255), nullable = False)
    devType = db.Column(db.String(50),nullable = False)
    unit = db.Column(db.String(50),nullable=False)
    measurements = db.relationship('Measurements', back_populates='device', lazy=True)
    status=db.Column(db.Integer, nullable=False) # default: banned 0

class DeviceSchema(ma.SQLAlchemyAutoSchema):    # for nested json
    class Meta:
        model = Device
        include_fk = True
device_schema = DeviceSchema(many=True)
class Appointment(db.Model):
    __tablename__ = 'appointments'
    appointmentId = db.Column(db.Integer, primary_key=True)
    patientId = db.Column(db.Integer, db.ForeignKey('users.userId'))
    doctorId = db.Column(db.Integer, db.ForeignKey('users.userId'))
    appointmentTime = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.Enum('scheduled', 'completed', 'cancelled'), default='scheduled')



class MeaSchema(ma.SQLAlchemyAutoSchema):   # for nested json
    class Meta:
        model = Measurements
    posts = ma.Nested(DeviceSchema(many=True))

# db.create_all()

def validate_date(date_str):
    try:
        datetime.strptime(date_str, '%Y-%m-%d').date()
        return True
    except ValueError:
        return False
    
@app.route('/api/users/hello', methods=['GET'])
def helloapp():
    return jsonify({"message":"hello world"}),200

@app.route('/api/users/add', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    dob  = data.get('dob')
    fullname = data.get('fullname')
    password = data.get('password')
    role_ids = data.get('role_ids',[])
    gender = data.get('gender')
    # if not validate_date(dob):
    #         return jsonify({"error":"Invalid date format. Please use YYYY-MM-DD format."}), 400
    
    if not all([username, email, dob, fullname, password, gender]):
        return jsonify({"error":"Missing information"}),400
    
    if Users.query.filter_by(username=username).first():
        return jsonify({"error":"Username already exists"}),400
    
    hash_psw = generate_password_hash(password,method="pbkdf2") # cannot operate on scrypt method.

    try:
        dob_parse = datetime.strptime(dob, '%Y-%m-%d').date()
        user = Users(username=username, email=email, dob=dob_parse, fullname=fullname, password = hash_psw, gender=gender)
        db.session.add(user)
        db.session.flush() # assign id ?
        for role_id in role_ids:
          role = Role.query.get(role_id)
          if role:
            user.roles.append(role)

        db.session.commit()
        return jsonify({"message": "User added successfully", "userId": user.userId}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": e}), 500

@app.route('/api/users/changeRole', methods=['PUT'])
def chg_role():
    data = request.get_json()
    userId = data.get('userId')
    newRoles = data.get('newRoles',[])
    if not all([userId, newRoles]):
        return jsonify({"bad requests":"missing components"}),400
    
    try:
        usr = Users.query.get_or_404(userId)
        usr.roles.clear()
        for role_id in newRoles:
            roleName = Role.query.get(role_id)
            if roleName:
                usr.roles.append(roleName)
        db.session.commit()
        return jsonify({"Success":"complete role changing!"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}),500  # error in server

def process_notify_queue():
    while not notification_queue.empty():
        noti_task = notification_queue.get()
        userId, msg = noti_task['userId'], noti_task['msg']
        print(f"Send notification to user: {userId}: {msg}"),200
        
        notification_queue.task_done()

@app.route('/api/notifications/send', methods=['POST'])
def notify():
    data = request.get_json()
    userId = data.get('userId')
    msg = data.get('msg')
    if not userId or not Users.query.filter(userId = userId).first():
        return jsonify({"bad request":"invalid userId"}),400
    
    notification_queue.put({'userId': userId, 'msg': msg})

    return jsonify({"message": "Notification is being processed."}), 202



def process_report_queue():
    with app.app_context():
        while not report_queue.empty():
            userId = report_queue.get()
            try:
                res = Measurements.query.get_or_404(userId)
                res_schema = MeaSchema()
                report_data = res_schema.dump(res)

                report_id = str(uuid.uuid4())
                reports_status[report_id] = {"status": "completed", "data": report_data}

                print(f"userId: {userId} 's report: {report_data}")
            except Exception as e:
                print(f"error when generating report: {e}")
            finally:
                report_queue.task_done()

def start_background_thread():
    t_repo = threading.Thread(target=process_report_queue)
    t_repo.daemon = True
    t_repo.start()

    t_noti = threading.Thread(target=process_notify_queue)
    t_noti.daemon = True
    t_noti.start()
start_background_thread()

@app.route('/api/reports/gen/<int:userId>', methods=['GET'])
def repo_gen(userId):
    if not Measurements.query.filter_by(userId=userId).first():
        return jsonify({"bad request": "user does not exist."}), 400

    report_queue.put(userId)
    report_id = str(uuid.uuid4())  # unique report id
    reports_status[report_id] = {"status": "in progress"}

    return jsonify({"message": "Report generation in progress.", "reportId": report_id}),202

@app.route('/api/reports/status/<reportId>', methods=['GET'])
def report_status(reportId):
    status_info = reports_status.get(reportId)
    if not status_info:
        return jsonify({"error": "Report ID not found."}), 404

    if status_info["status"] == "completed":
        return jsonify({"status": "completed", "data": status_info["data"]}), 200
    else:
        return jsonify({"status": "in progress"}),202


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    inputpsw = data.get('password')
    sel_role = data.get('role')
    user = Users.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"bad request": "invalid username"}), 400

    hashpsw = user.password
    check = check_password_hash(hashpsw, inputpsw)

    if not check:
        return jsonify({"error": "incorrect password"}), 401

    # 检查用户是否有特定的角色
    user_roles = [role.roleId for role in user.roles]
    # print("User roles:", user_roles)s
    if int(sel_role) in user_roles:
        
        return jsonify({
            "userId":user.userId,
            "username":username,
            "date of birth":user.dob,
            "gender":user.gender,
            "email":user.email,
            "fullname":user.fullname,
            "role": int(sel_role)
        }), 200
    
    else:
        return jsonify({"error": "User does not have the selected role"}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message":"Successfully logout"}),200
    
@app.route('/api/admin/RegisDevice', methods=['POST'])
def register_device():
    data = request.get_json()
    manufactor = data.get('manufactor')
    devType = data.get('devType')
    status = data.get('status')
    unit = data.get('unit')
    if None in [manufactor, devType, status, unit]:
        return jsonify({"error":"missing information"}),400
    try:
        new_device = Device(manufactor=manufactor, devType=devType, status=status, unit=unit)
        db.session.add(new_device)
        db.session.commit()
        return jsonify({"message":"Device registered successfully", "deviceId":new_device.deviceId})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": e}), 500

@app.route('/api/admin/viewDevice')
def view_device():
    devices = Device.query.all()
    return device_schema.dump(devices)

@app.route('/api/admin/deldev/<int:deviceId>', methods=['DELETE'])
def delete_device(deviceId):
    device = Device.query.get(deviceId)
    if not device:
        return jsonify({"bad request": "device does not exist."}), 400
    try:
        db.session.delete(device)
        db.session.commit()

        return jsonify({"message": "Device deleted successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": e}), 500

@app.route('/api/admin/<int:deviceId>/chgstatus', methods=['PUT'])
def change_device_status(deviceId):
    device = Device.query.get(deviceId)
    if not device:
        return jsonify({"error":"Device not found"}), 404
    
    data = request.get_json()
    new_status = data.get('status')

    if new_status is None:
        return jsonify({"error":"missing status"}),404
    try:
        device.status = new_status
        db.session.commit()
        return jsonify({"message": "Device status updated."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": e}), 500

@app.route('/api/MP/browsePatient', methods=['GET'])
def browse_patients():

    patients = db.session.query(Users).join(rolesmap, Users.userId == rolesmap.c.userId).join(Role, rolesmap.c.roleId == Role.roleId).filter(Role.roleId == 1).all()
    result = [
        {
            'userId': user.userId,
            'username': user.username,
            'email': user.email,
            'dob': user.dob.isoformat(),
            'fullname': user.fullname,
            'gender': user.gender
        } for user in patients
    ]
    return jsonify(result)

@app.route('/api/patient/makeAppointment', methods=['POST'])
def make_appointment():
    data = request.get_json()
    doctorId = data.get('doctorId')
    patientId = data.get('patientId')
    appointment_time = data.get('appointment_time')
    try:
        apt_parse = datetime.fromisoformat(appointment_time)
        appointment = Appointment(patientId=patientId, doctorId=doctorId, appointmentTime=apt_parse)
        db.session.add(appointment)
        db.session.commit()
        return jsonify({"message":"appointment scheduled!"}),200
    except Exception as e:
            db.session.rollback()
            return jsonify({"error": e}), 500
    

@app.route('/api/MP/view_appointment', methods=['GET'])
def view_appointment():
    doctor_id = request.args.get('doctorId')
    if not doctor_id:
        return jsonify({'error': 'doctor_id not found'}), 400

    appointments = Appointment.query.filter_by(doctorId=doctor_id).all()
    appointments_data = [{
        'appointmentId': appt.appointmentId,
        'doctorId': appt.doctorId,
        'patientId': appt.patientId,
        'appointmentTime': appt.appointmentTime.isoformat(),
        'status': appt.status
    } for appt in appointments]

    return jsonify(appointments_data), 200

@app.route('/api/MP/addMeasureData', methods=['POST'])
def add_measurement():
    data = request.get_json()
    userId = data.get('userId')
    deviceId = data.get('deviceId')
    value = data.get('value')
    measuretime = data.get('measuretime')
    measuretype = data.get('measuretype')
    
    
    if len(measuretime) == 16:  
        measuretime += ':00'  
    try:
        met = datetime.fromisoformat(measuretime)
    except ValueError as ve:
        return jsonify({"error": "Incorrect date-time format. It should be ISO 8601 format with optional seconds (YYYY-MM-DDTHH:MM[:SS])."}), 400

    if None in [userId, deviceId, value, met, measuretype]:
        return jsonify({"error":"Missing info"}),400
    
    try:
        measurement = Measurements(userId=userId, deviceId=deviceId, value=value, measuretime=met, measuretype=measuretype)
        db.session.add(measurement)
        db.session.commit()
        return jsonify({"message":"add measurement succeed!"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}),500
    



@app.route('/api/patient/view_measurements/<int:user_id>', methods=['GET'])
def view_measurements(user_id):
    result = db.session.query(Measurements.measuretype, db.func.max(Measurements.measuretime).label('latest_time')).\
                filter(Measurements.userId == user_id).\
                group_by(Measurements.measuretype).\
                subquery()

    latest_measurements = db.session.query(Measurements, Device.unit).\
        join(Device).\
        join(result, db.and_(Measurements.measuretype == result.c.measuretype, 
                             Measurements.measuretime == result.c.latest_time,
                             Measurements.userId == user_id)).\
        all()

    data = [{
        'measuretype': measurement[0].measuretype,
        'value': measurement[0].value,
        'measuretime': measurement[0].measuretime.strftime("%Y-%m-%d %H:%M:%S"),
        'unit': measurement[1]
    } for measurement in latest_measurements]

    return jsonify(data)


# chatting system:

@app.route('/api/MP/add_chat_patient', methods = ['POST'])
def add_chat_patient():
    data = request.get_json()
    MPid = data.get('MPid')
    patientid = data.get('patientid')
    if None in [MPid, patientid]:
        return jsonify({"error":"missing info."}),400
    try:
        chatPair = ChatPairs(MPid = MPid, patientid = patientid)
        db.session.add(chatPair)
        db.session.commit()
        return jsonify({"message":"succeed in adding chat patient."}),200
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route('/api/MP/remove_chat_patient', methods=['DELETE'])
def remove_chat_patient():
    MPid = request.args.get('MPid')
    patientid = request.args.get('patientid')

    if not MPid or not patientid:
        return jsonify({"error":"missing args"}),400
    
    chat_pair = ChatPairs.query.filter_by(MPid = MPid, patientid=patientid).first()
    if chat_pair is not None:
        db.session.delete(chat_pair)
        db.session.commit()
        return jsonify({"message":"delete this chat pair"}), 200
    else:
        return jsonify({"error":"No such chat pair"}),404


@app.route('/api/gen/view_chat_pairs/<int:user_id>', methods=['GET'])
def view_chat_pairs(user_id):
    try:
        # 查询用户作为医疗人员或病人的所有聊天对
        chat_pairs = ChatPairs.query.filter((ChatPairs.MPid == user_id) | (ChatPairs.patientid == user_id)).all()

        # 生成响应数据，列出所有相关的聊天对
        results = []
        for pair in chat_pairs:
            pair_info = {
                "MPid": pair.MPid,
                "patient_id": pair.patientid,
                "MP_username": pair.mp.username,
                "patient_username": pair.patient.username
            }
            results.append(pair_info)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500  


@app.route('/api/gen/view_chat_history', methods = ['GET'])
def view_history():
    MPid = request.args.get('MPid')
    patientid = request.args.get('patientid')
    if not MPid or not patientid:
        return jsonify({"error":"No such user(s)."}),400
    
    results = ChatHistory.query.filter_by(MPid = MPid, patientid=patientid).all()
    formatted_data = [record.format_msg() for record in results]
    return jsonify(formatted_data)

@socketio.on('connect')
def on_connect():
    user_id = request.args.get('user_id')
    join_room(user_id)
    emit('response', {'message': 'You have been connected.'})

@app.route('/api/gen/send_store_message', methods=['POST'])
def send_store_message():
    data = request.get_json()
    MPid = data.get('MPid')
    patientid = data.get('patientid')
    direction = data.get('direction')
    message = data.get('message')
    sendtime = data.get('sendtime')
    status = 'sent'     # implement websocket for sending messages. Change status if msg sent

    if None in [MPid, patientid, direction, message, sendtime]:
        return jsonify({"error":"missing info."}),400
    try:
        chatHistory = ChatHistory(MPid = MPid, patientid=patientid, direction=direction, message=message, sendtime=sendtime, status=status)
        db.session.add(chatHistory)
        db.session.commit()
        # return jsonify({"message":"store a chat-history"}), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}),500

    recipient_id = patientid if direction == 'send' else MPid
    socketio.emit('message_response', {'message': message, 'from': MPid, 'to': patientid, 'direction': direction}, room=str(recipient_id))

    return jsonify({"message": "Message sent and store initiated"}), 200
