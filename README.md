# ec530 final project

### ALL APIs needed defined in .yaml files ... within the repository

### Schema of API data:

1. Data Reading Module: GET
   - device: devId
   - properties: object
     - name: string
     - value: number
     - unit: string
     - read_time: date-time
   - regis_time: date-time

- response:
  - 200: success
  - 404: error ( not found )

2. Device Interface: GET / POST

   - device:
     - devId:string
     - name: string
     - value: number
     - unit: string
     - regtime: date-time
     - manufactor: string
     - status: string
   - response:
     - 200: success
     - 404: error ( not found )

3. Authentication Authorization:
   - Login:
     - Post: url: /api/auth/login
     - parameter:
       - username(string, required)
       - password(string, required)
     - responses:
       - success: 200
       - failed: 401 : Invalid username or password.
   - Logout:
     - Post: url: /api/auth/logout
     - valid jwt token in header
     - responses:
       - Success: 200
       - Failure: 401: Invalid token
4. Reports:
   - Generate:
     - GET(select from db): url: /api/reports/gen/<int:id>
     - parameters:
       - patient-info from users
       - measurements
     - responses:
       - success: 200
       - failure: 400
5. Notifications:

   - Send:
     - Post: url: /api/notifications/send
     - parameters:
       - userId(string, required)
       - message(string, required)
     - reponses:
       - success: 200
       - failure: 400

6. User Management
   - Add User:
     - Post: url: /api/users/add
     - parameters:
       - username(string, required)
       - role(string, required)
       - password(string, required)
       - gender(string, enum, required)
       - email
       - dob
       - fullname
     - reponses:
       - Success: 201
       - Failure: 400
   - Change role:
     - Post: url: /api/usrs/changeRole
     - parameters:
       - userId(String, required)
       - role(String, required)
     - responses:
       - success: 200
       - failure: 400

## Database Schema -- relational sql ( implemented with mysql in file dbschema.sql )

1. table users:

   - userId: int (as primary key)
   - username: varchar
   - email: string(varchar)
   - dob: string
   - gender: string(enum('female','male','other'))
   - fullname(varchar)
   - password(varchar)
   - Role (ENUM('patient', 'nurse', 'doctor', 'admin'))

2. table rolesmap:

   - userId: int (relative to table users' primary key)
   - roleId: int (relative to table role's primary key)

3. table role:

   - roleId: int (primary key)
   - rolename: string

4. table device:

   - deviceid: int
   - manufactor: varchar
   - devType: varchar
   - value: float
   - measuretime: datetime
   - unit: varchar

5. table Measurements:

   - MeasurementId: int(primary key)
   - deviceId: int ( deviceId from table device )
   - userId: int (userId from table users)

6. table appointments:
   - appointmentId: int (PM)
   - patientId
   - doctorId
   - appointmentTime
   - status

## API implement with Flask_restful framework

- Implemented stub in stub_datareading.py and stub_device.py
  - If device id not found in existing list, return 404 not found
  - If missing information in requests, return 400 bad request
  - Normal: 200: Success

## app.py

### Implement restful api to interact with database for :

- User management
- Authentication/Authorization
- Reports
- Notifications
- Data reading / Device Interface

### Build a queue to process report generation

#### Components

- **Report Queue (`report_queue`)**: A thread-safe queue for storing pending report generation tasks.
- **Producer**: Component of the Flask application responsible for adding report tasks to the queue based on user requests or system events.
- **Consumer**: Background threads that take tasks from the queue, generate reports, and update their statuses accordingly.
- **Report Status Tracking (`reports_status`)**: A structure (e.g., a dictionary) used to keep track of each report's generation status and results.

#### Workflow

1. **Request Report Generation**: Producers queue report generation tasks in response to user requests or system events.
2. **Queue Processing**: Consumers retrieve tasks from the queue and proceed with report generation, which may include data fetching, computation, and formatting.
3. **Update Report Status**: After a report is generated, its status is updated to either indicate completion or capture any errors encountered.
4. **Query Report Status**: Users or automated systems can inquire about the status of a report to check if it's ready for review or to monitor its progress.

### Unit Test Result for Report Queue

<img width="1101" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/e3051a3b-7f61-49e7-bebc-95b90fb8de0d">

### Build a queue to process notification generation

#### Documentation:

The notification queue system in the Flask application handles asynchronous notification delivery. It uses Python's Queue to manage and process notifications in a thread-safe manner.

#### Components:

- Notification Queue: A queue that stores notifications as dictionaries, each containing a user ID and message.
- Producer: The system component that generates and enqueues notifications, typically triggered by specific API calls.
- Consumer: A background thread that dequeues and processes notifications from the queue.

#### Workflow

- Enqueuing: Notifications are created and added to the queue in response to certain events, through the notify() endpoint.
- Processing: A background thread continuously checks the queue for new notifications, processing and "sending" each one by printing a message to the console.

### Unit Test Result for Notification Queue :

<img width="1109" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/aac6e0ae-f83a-4444-bc00-a71c7ad1c1ff">

#### gitc cmd with remote repos:

- git clone URL
- git pull origin main
- git add . / file names
- git commit (files) -m "xxx"
- git push origin main (to remote repo)

### Frontend:

1. add user

![image](https://github.com/Mrkingggg/ec530-finalproj-healthsys/assets/105716817/194d2562-7356-49ef-acbd-0be5e4b3ba65)

![image](https://github.com/Mrkingggg/ec530-finalproj-healthsys/assets/105716817/df2e2d9f-b9ad-4ce4-a3ee-2141d8bb112d)

2. change user's roles
<img width="1439" alt="image" src="https://github.com/Mrkingggg/ec530-finalproj-healthsys/assets/105716817/eeea4306-3174-4a37-9be0-e8f402d59268">

<img width="701" alt="image" src="https://github.com/Mrkingggg/ec530-finalproj-healthsys/assets/105716817/b072a896-b701-4249-8387-ed8081a6b6cd">
