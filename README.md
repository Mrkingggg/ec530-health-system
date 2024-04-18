# ec530 final project

## Schema of API:

(ALL APIs needed defined in .yaml files ... within the repository)

1. Data Reading Module: GET
   - measurementid

- response:
  - 200: success, with response body
  - 404: error ( not found )

2. Device Interface: POST, '/api/admin/RegisDevice'
   - device:
     - devId:string
     - name: string
     - unit: string
     - regtime: date-time
     - manufactor: string
     - status: string
   - response:
     - 200: success
     - 404: error ( missing information )

![regis_dev](https://github.com/Mrkingggg/ec530-health-system/assets/105716817/4df27147-7530-4a4f-aac5-7abdbcf6dd21)


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

7. View Device

   - GET: /api/admin/viewDevice
   - response: All Device information in Nested json. <br/> <br/>
     <img width="1031" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/3b7c3e4e-5104-4888-ac10-a374bb363c82">
     <br/>

8. Delete Device

   - DELETE: /api/admin/deldev/<int:deviceId>
   - response: - 400: "bad request": "device does not exist." - 200: "message": "Device deleted successfully" <br/> <br/>
     <img width="1022" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/6f870ed0-437d-48bf-8700-8d060b5fd492">
     <br/>

9. Change Device Status

   - Reverse status ( Enable:1 <--> Disable:0 )
   - PUT : /api/admin/<int:deviceId>/chgstatus
   - response:
     - 404: "error":"Device not found" / "missing status"
     - 200: "message": "Device status updated."
       <br/>
       <img width="1312" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/9524955e-6a4e-4730-84d8-7fb6b79d02e0">

10. Browse all patients
    - GET: api/MP/browsePatient <br/>
      API test:
      <img width="792" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/b2c28db0-5318-4f89-be55-78bad4766efe">

## Database Schema -- relational sql ( in dbschema.sql )

### Corresponding DB tables' python-flask definition in /backend/app.py

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
   - unit: varchar
   - status

5. table Measurements:
   - MeasurementId: int(primary key)
   - deviceId: int ( deviceId from table device )
   - userId: int (userId from table users)
   - value: float
   - measuretime: datetime
6. table appointments:
   - appointmentId: int (PM)
   - patientId
   - doctorId
   - appointmentTime
   - status

## app.py （ /backend/app.py ）

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

## Web Application:

More results screenshots in /screenshot.

### General Functions:

<br/>
1. Create new accounts.
   Fill all fields ( role's field is multiple selection ). Click Add User and jump to login page.

   ![create_user](https://github.com/Mrkingggg/ec530-health-system/assets/105716817/5c6404ff-a19d-4c8d-b755-738b02cde618)


<br/>
<br/>

2.Login and User's Page
More functions to be added. ( Generate reports, review personal information, receive notifications, make appointments and etc..)
Different Roles jump to corresponding pages. Start with Login or Create an acoount.

- Login: Directly input username and password. If both are correct, the web jumps to user page.
- Create a new account: jump to create page.

<img src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/87a15603-161e-4751-ab84-1ee434b0a88f" width="500" height="400" alt="home_page">


<br/>

### Admin Functions:

1. Change Roles
   <br/>
   <img width="804" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/993140c8-9618-4966-95eb-5f04f5c2722d">

2. Add a new device <br/> <img width="469" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/650ee457-6755-4dcb-affc-f789988e2066">

3. View and manage devices ( change status / delete devices ) <br/> <img width="1345" alt="image" src="https://github.com/Mrkingggg/ec530-proj2/assets/105716817/96a5d360-2489-4dd0-9934-3bfb9ff070bd">

<br/>
Admin User Stories:


- Add users to the system:
- Users should be added to the system and cannot register before being added to the system
- Assign and Change Roles to users( A user can have different roles, e.g.,
- a user can be a patient and/or a doctor
- A user can be a family member and/or a patient
- Provide interfaces to third party medical device makers (Thermometer, Pulse, Blood pressure, Glucometer, etc.) to have their devices feed data to the system
- Ability to disable or enable any device maker or application developer
 <br/>

### MP(Doctor/Nurse) Functions:

1. Browse Patients<br/>
   <img width="1224" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/61c9fce0-f015-4097-bc17-22c48b4c58ce">



<br/>
Medical Professional (MP) User Stories


- Browse Patients
- Assign a medical device to a Patient
- Assign Alert and scheduling for medical measurement, e.g.,
- Patient to measure blood pressure daily.  MP will receive an alert if it not done.
- Temperature is higher or lower than a value.  MP will get an alert if the measurement is outside acceptable range
- MP can input data for any patient
- MP can chat with patients using text, voice or videos.
- MP can read transcripts of Patient uploaded videos and messages
- MP can search for keywords in messages and chats
- MP have a calendar where they can show open time slots for appointments
- MP can see all appointments booked at any time

