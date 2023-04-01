CREATE TYPE status_type AS ENUM (
    'VOTING',
    'WAITING_FOR_CONFIRM',
    'CONFIRMED',
    'FINISHED'
);

CREATE TYPE week_day_type AS ENUM (
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
);

CREATE TYPE notification_preference AS ENUM (
    'email',
    'line'
);

CREATE TABLE account (
    id                       SERIAL  PRIMARY KEY,
    email                    VARCHAR UNIQUE,
    username                 VARCHAR NOT NULL UNIQUE,   -- require username?
    pass_hash                VARCHAR,
    line_token               VARCHAR,                   -- TBD?
    google_token             VARCHAR,                    -- TBD?
    notification_preference  notification_preference NOT NULL
);

CREATE TABLE email_verification (
    code          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR NOT NULL,
    account_id    INTEGER NOT NULL  REFERENCES account(id),
    is_consumed   BOOLEAN NOT NULL  DEFAULT FALSE
);

CREATE TABLE meet (
    id                    SERIAL      PRIMARY KEY,
    status                status_type NOT NULL,
    start_date            DATE        NOT NULL,
    end_date              DATE        NOT NULL,
    start_time            TIME        NOT NULL, -- meet 可供選擇的時間
    end_time              TIME        NOT NULL, -- meet 可供選擇的時間
    voting_end_time       TIMESTAMP,
    title                 VARCHAR     NOT NULL,
    description           TEXT,
    invite_code           VARCHAR     UNIQUE  NOT NULL,  -- https://host/invite_code
    meet_url              VARCHAR,
    finalized_start_time  TIMESTAMP,
    finalized_end_time    TIMESTAMP,
    is_deleted            BOOLEAN     DEFAULT FALSE
);

-- only when meet is confirmed and user is able to attend at that time, event record will be inserted.
CREATE TABLE event (
    meet_id    INTEGER REFERENCES meet(id),
    account_id INTEGER REFERENCES account(id),
    PRIMARY KEY (meet_id, account_id)
);

CREATE TABLE meet_member (
    id        SERIAL  PRIMARY KEY,
    name      VARCHAR NOT NULL, -- TBD, a little bit weird?
    member_id INTEGER REFERENCES account (id),
    meet_id   INTEGER NOT NULL REFERENCES meet (id),
    is_host   BOOLEAN DEFAULT FALSE
);

CREATE TABLE time_slot (
    id         SERIAL PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time   TIME NOT NULL
);

CREATE TABLE meet_member_available_time (
    meet_member_id INTEGER REFERENCES meet_member (id),
    date           DATE    NOT NULL,
    time_slot_id   INTEGER NOT NULL REFERENCES time_slot (id),
    PRIMARY KEY (meet_member_id, date, time_slot_id)
);

CREATE TABLE routine (
    account_id   INTEGER REFERENCES account (id),
    weekday      week_day_type NOT NULL,
    time_slot_id INTEGER REFERENCES time_slot (id),
    PRIMARY KEY (account_id, weekday, time_slot_id)
);
