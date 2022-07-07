/*account id will have to be something complex, haven't figured it out yet*/

CREATE TABLE ACCOUNT ( 
	AccountID SERIAL NOT NULL,
    AccountName varchar(16) NOT NULL UNIQUE, 
    AccountPassword varchar(100) NOT NULL, 
	FullName varchar(100), 
	Email varchar(100) NOT NULL,
    AdminRights boolean DEFAULT FALSE NOT NULL, 
    PRIMARY KEY(AccountID)
);

/*C_int where int is the same as order on reservations table*/ 

CREATE TABLE COURT (
    CourtID varchar(100) NOT NULL, 
    PRIMARY KEY (CourtID)
);

/*TT_int where int is the same as order on reservations table*/ 

CREATE TABLE TABLETIMES(
    TableTimeID integer NOT NULL, 
    TableHour varchar(5) NOT NULL, 
    PRIMARY KEY(TableTimeID)
);


/*RES_date_int where date is simplified date and int is lenght of selections, deleted when date past*/

CREATE TABLE RESERVATION ( 
    ReservationID SERIAL NOT NULL, 
    ReservationDate varchar(10) NOT NULL, 
    ReservationTime varchar(5) NOT NULL, 
    CourtID varchar(100) NOT NULL,
    ReserveeID integer NOT NULL,
    FOREIGN KEY(ReserveeID) REFERENCES ACCOUNT (AccountID),
    FOREIGN KEY(CourtID) REFERENCES COURT (CourtID), 
    PRIMARY KEY(ReservationID) 
);

/*TOUR_int where int is place on tournaments table*/ 

CREATE TABLE TOURNAMENT (
    TournamentID varchar(100) NOT NULL, 
    Title text NOT NULL, 
    StartDate date, 
    EndDate date, 
    SkillLevel integer, 
    AgeRestrictions integer,
    Details text,
    Poster text,
    PRIMARY KEY(TournamentID)
);

CREATE TABLE joins ( 
    ParticipantID integer NOT NULL, 
    TournamentID varchar(100) NOT NULL, 
    comments text,
    FOREIGN KEY(ParticipantID) REFERENCES ACCOUNT(AccountID) ON DELETE CASCADE ON UPDATE CASCADE, 
    FOREIGN KEY(TournamentID) REFERENCES TOURNAMENT(TournamentID) ON DELETE CASCADE ON UPDATE CASCADE
);

