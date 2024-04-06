from flask import request, Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

class SubmitReadData(Resource):
    def post(self):
        data = request.get_json()
        required_fields = ['name', 'devId', 'value', 'unit', 'read_time']
        if not all(field in data for field in required_fields):
            return {"message": "Fail to submit data. Missing required field."}, 400  
        # ...
        return {"message": "Succeed in submitting data read from device.", "data": data}, 200
    
class ReadDev(Resource):
    def get(self, devId):
        ids = {}
        if devId not in ids:
            return {'message':'device not found'}, 404
        mock_data = [
            {"name": "temperature", "value": 36.5, "unit": "C", "read_time": "2024-01-01T10:00:00Z"},
            {"name": "heart rate", "value": 72, "unit": "beats per minute", "read_time": "2024-01-01T10:05:00Z"}
        ]
        return {"message":"succeed in reading", "data":mock_data},200

api.add_resource(SubmitReadData, '/data_read/submit')

if __name__ == "__main__":
    app.run()
