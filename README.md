# Let's Meet

## Overview
Let’s Meet is a web-based application designed to help coordinate events for a large number of people. Let's Meet allows users to record their own routine which they are not able to participate in a meet every week. Based on those routine records, the system recommends users the proper time to vote for every meet. 
In addition, users are allowed to import their own Google Calendar, when the time of the meet is confirmed, the system will show it as an event together with users’ own calendar.
Additionally, the system provides a feature to remind users about their event. An email will be automatically sent to every member of the event. If users connect their LINE account with Let’s Meet, the reminder will be able to be sent through the LINE application.


## Set up
#### Backend and Database
*Note: You are required to install Docker and fill in environment variable in backend directory first.*
```shell
make build
make
```

#### Frontend
```shell
cd frontend
yarn
yarn start
```