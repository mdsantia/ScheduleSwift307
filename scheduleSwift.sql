CREATE TABLE `employeeData` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(200) DEFAULT NULL,
  `lastName` varchar(200) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `emailAddress` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `businessName` varchar(200) DEFAULT NULL,
  UNIQUE KEY `username_UNIQUE` (`username`),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `userData` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(200) NOT NULL,
  `lastName` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `emailAddress` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `creationDate` varchar(200) DEFAULT NULL,
  `confirmCode` varchar(200) NOT NULL,
  `active` boolean NOT NULL DEFAULT 0,
  UNIQUE KEY `username_UNIQUE` (`username`),
  PRIMARY KEY (`ID`),
  UNIQUE KEY `confirmCode_UNIQUE` (`confirmCode`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `managerData` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(200) DEFAULT NULL,
  `lastName` varchar(200) DEFAULT NULL,
  `username` varchar(200) NOT NULL,
  `emailAddress` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `businessName` varchar(200) DEFAULT NULL,
  `confirmCode` varchar(200) NOT NULL,
  `active` boolean NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `confirmCode_UNIQUE` (`confirmCode`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reservations` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(200) DEFAULT NULL,
  `reservationDate` varchar(200) DEFAULT NULL,
  `reservableItem` varchar(200) DEFAULT NULL,
  `price` varchar(200) DEFAULT NULL,
  `isReserved` varchar(3) DEFAULT NULL,
  `startTime` varchar(200) DEFAULT NULL,
  `endTime` varchar(200) DEFAULT NULL,
  `reservedBy` varchar(200) DEFAULT NULL,
  `numPeople` varchar(200) DEFAULT NULL,
  `numReservable` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `facilityData` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `businessName` VARCHAR(200) DEFAULT NULL,
  `reservableItem` VARCHAR(200) DEFAULT NULL,
  `prices` VARCHAR(200) DEFAULT NULL,
  `maxs` VARCHAR(200) DEFAULT NULL,
  `mins` VARCHAR(200) DEFAULT NULL,
  `numPeople` VARCHAR(200) DEFAULT NULL,
  `numReservable` VARCHAR(200) DEFAULT NULL,
  `Sun` VARCHAR(200) DEFAULT NULL,
  `Mon` VARCHAR(200) DEFAULT NULL,
  `Tues` VARCHAR(200) DEFAULT NULL,
  `Wed` VARCHAR(200) DEFAULT NULL,
  `Thurs` VARCHAR(200) DEFAULT NULL,
  `Fri` VARCHAR(200) DEFAULT NULL,
  `Sat` VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  UNIQUE KEY `businessName_UNIQUE` (`businessName`)
)  ENGINE=INNODB AUTO_INCREMENT=57 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

CREATE TABLE `managerNotes` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `date` VARCHAR(200) NULL,
  `businessName` VARCHAR(200) NULL,
  `noteSubject` VARCHAR(200) NULL,
  `noteBody` TEXT(500) NULL,
  PRIMARY KEY (`ID`)
) ENGINE=INNODB AUTO_INCREMENT=57 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

CREATE TABLE `managerFAQ` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `businessName` VARCHAR(200) NULL,
  `question` VARCHAR(200) NULL,
  `answer` TEXT(500) NULL,
  PRIMARY KEY (`ID`)
) ENGINE=INNODB AUTO_INCREMENT=57 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;
