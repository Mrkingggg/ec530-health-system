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
    val DECIMAL(10,2),
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
