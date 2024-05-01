# ec530 health system project -- Flask + React

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

    - GET: /api/MP/browsePatient <br/>
      API test:
      <img width="792" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/b2c28db0-5318-4f89-be55-78bad4766efe">

11. Make Appointments:

- POST: /api/patient/makeAppointment

12. View Appointments:

- GET: /api/MP/view_appointment
  <img width="1043" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/7e4c98bb-30aa-4efd-822e-97c1ca2a48ef">

13. Add Measurement data:

- POST: /api/MP/addMeasureData

14. View Latest Measurement Report ( All Measurements up to date)

- GET: /api/patient/view_measurements/<int:user_id>

   <img width="1048" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/eb45f653-6b5f-49c9-a12d-fcb9182885e1">

15. Add New Chat with patients

- POST: /api/MP/add_chat_patient

   <img width="1045" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/fd0596d8-5d2d-4cf0-ba89-e11d11832147">

16. Remove A Chat with patient

- DELETE: /api/MP/remove_chat_patient
  <img width="1050" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/786f22bf-3e0f-40ba-96f4-9d0b6ee3c862">

17. View Chat List

- GET: /api/gen/view_chat_pairs/<int:user_id>
  <img width="1054" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/a1dc878c-4470-456f-9125-2cc71330fce4">

18. View Chat History

- GET: /api/gen/view_chat_history
  <img width="1053" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/daec2d45-64ec-40d1-ab26-6dd7eed56fe7">

19. Send and Store Messages to Database

- POST: /api/gen/send_store_message

   <img width="579" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/61e54a4a-43c8-4547-ae2f-e3e8ae786524">

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

7. Table ChatPairs:

   - pairid int PK
   - MPid int
   - patientid int

8. Table ChatHisroty:
   - msgid int PK
   - MPid int
   - patientid int
   - message varchar(255)
   - sendtime datetime
   - status enum('sent','unsent')
   - direction enum('recv','send')

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

<img src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/87a15603-161e-4751-ab84-1ee434b0a88f" width="600" height="400" alt="home_page">

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

2. Browse appointments / Add Latest Patient Measurement Data<br/>

   <img width="1071" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/df97cd51-e6c0-4b42-b9cd-74f001ad4b62">

3. Browse All Chats with different patients. / Add new chats with patients.

   <img width="1296" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/d250ca06-4687-4c24-b163-a59c6dc0bcdd">

4. View chatting history in detail by clicking different chats.

   <img width="1338" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/c9dceb4e-fd3f-42cd-8c2e-388e305f7218">

<br/>

### Patient Functions:

- Browse Latest Measurement Data list.(Refresh function is implemented.)
- Make appointments with doctors.
- Browse Basic Personal Info.
- Chat with different doctors and browse chat history.

<img width="1392" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/8f58caf1-132d-4de2-923e-2fddbc2f8174">

<img width="1032" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/09afebdd-e0a2-4228-aae8-47dcff2ce96d">

<img width="1363" alt="image" src="https://github.com/Mrkingggg/health-system/assets/105716817/53b2467e-e5ba-4c0b-8b91-97395b1d0de2">

### Integrate Tests /backend/test_app.py, /backend/test_notification_queue.py, /backend/test_report_queue.py

## Hello App Framework

1. helloapp() function in app.py. Definition of helloapp API, return a message of hello app.
   <br/>

<img width="435" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/2f649a25-7bd2-470f-9d7d-894bb4efbc76">

2. fetch this api response in HelloApp.js

<img width="596" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/33981dc7-36d2-43c1-b1bf-5e755e218407">

3. add HelloApp.js to homepage.

<img width="652" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/391f7dc4-5595-4b09-960f-320c208f486c">
<br/>

<img width="1439" alt="image" src="https://github.com/Mrkingggg/ec530-health-system/assets/105716817/1ddaf1c6-e833-42d5-970f-e6ede30ca768">
