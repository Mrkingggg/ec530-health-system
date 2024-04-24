use HealthApp;

Create table users(
	userId int auto_increment primary key,
    username varchar(150) unique not null,
    email varchar(150),
    dob datetime,
    fullname varchar(150) not null,
    password varchar(255) not null
);
Create table role(
    roleId int auto_increment primary key,
    rolename varchar(50) not null unique
);

Create table rolesmap(
	userId int,
    roleId int,
    primary key(userId, roleId),
    foreign key(userId) references users(userId),
    foreign key(roleId) references role(roleId)

);

Create table device(
	deviceId int auto_increment primary key,
    manufactor varchar(255) not null,
    devType varchar(50) not null,
    `status` int NOT NULL DEFAULT '0',
    unit varchar(50) not null,
);

Create table measurements(
	MeasurementId int auto_increment primary key,
    deviceId int,
    userId int,
    `value` varchar(150),
    measuretime DATETIME default CURRENT_TIMESTAMP,
    foreign key(deviceId) references device(deviceId),
    foreign key(userId) references users(userId)

);

create table appointments(
	appointmentId int auto_increment primary key,
    patientId int,
    doctorId int,
    appointmentTime DATETIME not null,
    status ENUM('scheduled', 'completed', 'cancelled') default 'scheduled',
    foreign key(patientId) references users(userId),
    foreign key(doctorId) references users(userId)
    

);
-- store chat pairs
create table ChatPairs(
	pairid int auto_increment primary key,
    MPid int not null,
    patientid int not null,
    foreign key(MPid) references users(userId),
    foreign key(patientid) references users(userId)
	
);

create table ChatHistory(
	msgid int auto_increment primary key,
    MPid int not null,
    patientid int not null,
    message varchar(255) not null,
    sendtime datetime default current_timestamp,
    status enum('sent','unsent'),
    `direction` enum('recv','send') NOT NULL DEFAULT 'send',
    foreign key(MPid) references users(userId),
    foreign key(patientid) references users(userId)
    
);