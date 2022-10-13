CREATE TABLE scheduleSwift.userData(
	ID int NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(200) NOT NULL,
    lastName VARCHAR(200) NOT NULL,
    username VARCHAR(200) NOT NULL,
    emailAddress VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    PRIMARY KEY (ID)
    );

CREATE TABLE scheduleSwift.facilities(
    ID int NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    -- uniqueID VARCHAR(10) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE scheduleSwift.events(
    ID int NOT NULL AUTO_INCREMENT,
    organizers VARCHAR(200) NOT NULL,
    date VARCHAR(8) NOT NULL,
    starttime VARCHAR(4) NOT NULL,
    endtime VARCHAR(4) NOT NULL,
    confID VARCHAR(10) NOT NULL,
    PRIMARY KEY (ID)
),