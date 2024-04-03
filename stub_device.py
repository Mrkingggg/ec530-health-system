from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class DeviceRegister(Resource):
    def post(self):
        data = request.get_json()
        required = ['devId', 'name', 'regtime', 'manufactor', 'status']
        if not all(field in data for field in required):
            return {"message":"missing some required fields"},400
        # add data to db in real app 

        return {"message": "Success registration", "data": data}, 200

class DeviceStatus(Resource):
    def put(self, devId):
        ids= {} # assumpt there are some real id of devices in ids.
        if devId not in ids:
            return {"message":"device not found"},404
        
        status = request.get_json().get('status')
        if not status:
            return {"message":"no status in request json"},400
        
        # update status in real db

        return {"message": "Succeed Modify Status", "devId": devId, "status": status}, 200

api.add_resource(DeviceRegister, '/device/register')
api.add_resource(DeviceStatus, '/device/<int:devId>/status')

if __name__ == '__main__':
    app.run(debug=True)
