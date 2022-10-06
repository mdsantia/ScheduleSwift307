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
    ID VARCHAR(200) NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (ID)
)

CREATE TABLE scheduleSwift.events(
    ID VARCHAR(200) NOT NULL AUTO_INCREMENT,
    organizers VARCHAR(200) NOT NULL,
    date VARCHAR(6) NOT NULL,
    starttime VARCHAR(4) NOT NULL;
    endtime VARCHAR(4) NOT NULL;
)