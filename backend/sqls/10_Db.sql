
CREATE TABLE Evaluations
(
  id         int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_id    INT     NOT NULL,
  subject_id INT     NOT NULL,
  title      varchar NOT NULL,
  points     int     NOT NULL,
  max_points int     NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Events
(
  id         int       NOT NULL GENERATED ALWAYS AS IDENTITY,
  subject_id INT       NOT NULL,
  title      varchar   NOT NULL,
  type       varchar   NOT NULL,
  date_till  timestamp NOT NULL,
  PRIMARY KEY (id)
);

COMMENT ON TABLE Events IS 'Exam etc.';

CREATE TABLE Lectures
(
  id         INT       NOT NULL GENERATED ALWAYS AS IDENTITY,
  subject_id INT       NOT NULL,
  from_time  timestamp NOT NULL,
  to_time    timestamp NOT NULL,
  day        varchar   NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Permissions
(
  id         INT     NOT NULL GENERATED ALWAYS AS IDENTITY,
  permission VARCHAR NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Posts
(
  id      INT       NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_id INT       NOT NULL,
  title   VARCHAR   NOT NULL,
  text    VARCHAR   NOT NULL,
  image   varchar  ,
  created timestamp DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMENT ON COLUMN Posts.user_id IS 'Owner';

COMMENT ON COLUMN Posts.image IS 'Path to img';

CREATE TABLE Seminars
(
  id         INT       NOT NULL GENERATED ALWAYS AS IDENTITY,
  subject_id INT       NOT NULL,
  from_time  timestamp NOT NULL,
  to_time    timestamp NOT NULL,
  day        varchar   NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Subjects
(
  id          INT     NOT NULL GENERATED ALWAYS AS IDENTITY,
  title       varchar NOT NULL,
  description varchar NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE User_Events
(
  user_id  INT NOT NULL,
  event_id int NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE User_Lectures
(
  user_id    INT NOT NULL,
  lecture_id INT NOT NULL,
  PRIMARY KEY (user_id, lecture_id)
);

CREATE TABLE User_Permissions
(
  user_id       INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE User_Seminars
(
  user_id    INT NOT NULL,
  seminar_id INT NOT NULL,
  PRIMARY KEY (user_id, seminar_id)
);

CREATE TABLE User_Subjects
(
  user_id    INT NOT NULL,
  subject_id INT NOT NULL,
  PRIMARY KEY (user_id, subject_id)
);

CREATE TABLE UserAccounts
(
  id              INT     NOT NULL GENERATED ALWAYS AS IDENTITY,
  first_name      VARCHAR NOT NULL,
  last_name       VARCHAR NOT NULL,
  email           VARCHAR NOT NULL UNIQUE,
  password        VARCHAR NOT NULL,
  active          boolean DEFAULT true,
  role            VARCHAR DEFAULT 'USER',
  profile_img     varchar,
  expo_push_token varchar,
  PRIMARY KEY (id)
);

COMMENT ON TABLE UserAccounts IS 'Login/auth related things of the user';

CREATE TABLE UserPreferences
(
  user_id        INT     NOT NULL,
  notifications  boolean DEFAULT true,
  dark_mode      boolean DEFAULT true,
  use_biometrics boolean DEFAULT false,
  PRIMARY KEY (user_id)
);

COMMENT ON TABLE UserPreferences IS 'User prefs. + misc. info';

ALTER TABLE User_Permissions
  ADD CONSTRAINT FK_Permissions_TO_User_Permissions
    FOREIGN KEY (permission_id)
    REFERENCES Permissions (id);

ALTER TABLE User_Lectures
  ADD CONSTRAINT FK_Lectures_TO_User_Lectures
    FOREIGN KEY (lecture_id)
    REFERENCES Lectures (id);

ALTER TABLE User_Subjects
  ADD CONSTRAINT FK_Subjects_TO_User_Subjects
    FOREIGN KEY (subject_id)
    REFERENCES Subjects (id);

ALTER TABLE Lectures
  ADD CONSTRAINT FK_Subjects_TO_Lectures
    FOREIGN KEY (subject_id)
    REFERENCES Subjects (id);

ALTER TABLE User_Events
  ADD CONSTRAINT FK_Events_TO_User_Events
    FOREIGN KEY (event_id)
    REFERENCES Events (id);

ALTER TABLE Events
  ADD CONSTRAINT FK_Subjects_TO_Events
    FOREIGN KEY (subject_id)
    REFERENCES Subjects (id);

ALTER TABLE User_Permissions
  ADD CONSTRAINT FK_UserAccounts_TO_User_Permissions
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE User_Lectures
  ADD CONSTRAINT FK_UserAccounts_TO_User_Lectures
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE User_Subjects
  ADD CONSTRAINT FK_UserAccounts_TO_User_Subjects
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE User_Seminars
  ADD CONSTRAINT FK_UserAccounts_TO_User_Seminars
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE User_Events
  ADD CONSTRAINT FK_UserAccounts_TO_User_Events
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE Posts
  ADD CONSTRAINT FK_UserAccounts_TO_Posts
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE UserPreferences
  ADD CONSTRAINT FK_UserAccounts_TO_UserPreferences
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE User_Seminars
  ADD CONSTRAINT FK_Seminars_TO_User_Seminars
    FOREIGN KEY (seminar_id)
    REFERENCES Seminars (id);

ALTER TABLE Seminars
  ADD CONSTRAINT FK_Subjects_TO_Seminars
    FOREIGN KEY (subject_id)
    REFERENCES Subjects (id);

ALTER TABLE Evaluations
  ADD CONSTRAINT FK_UserAccounts_TO_Evaluations
    FOREIGN KEY (user_id)
    REFERENCES UserAccounts (id);

ALTER TABLE Evaluations
  ADD CONSTRAINT FK_Subjects_TO_Evaluations
    FOREIGN KEY (subject_id)
    REFERENCES Subjects (id);
