CREATE TABLE scheduleSwift.userData(
	ID int NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(200) NOT NULL,
    lastName VARCHAR(200) NOT NULL,
    username VARCHAR(200) NOT NULL,
    emailAddress VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    PRIMARY KEY (ID)
    );
    
CREATE TABLE scheduleSwift.reservations (
	confirmationID int NOT NULL,
    firstName VARCHAR(200) NOT NULL,
    lastName VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phoneNumber VARCHAR(12) NOT NULL,
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    numItem1 int NOT NULL,
    numItem2 int NOT NULL,
    additionalInfo VARCHAR(1000) NOT NULL,
    communicationMethod VARCHAR(200)
    );
    

