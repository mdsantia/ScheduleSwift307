CREATE TABLE `employeeData` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(200) DEFAULT NULL,
  `lastName` varchar(200) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `emailAddress` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `businessName` varchar(200) DEFAULT NULL,
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
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `managerData` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(200) DEFAULT NULL,
  `lastName` varchar(200) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `emailAddress` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `businessName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
