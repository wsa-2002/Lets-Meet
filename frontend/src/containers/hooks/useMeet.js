import { useState, useEffect, createContext, useContext } from "react";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? window.location.origin.replace(/^http/, "ws")
    : "ws://localhost:4000";
const client = new WebSocket(WS_URL);

const MeetContext = createContext({
    user: "",
    eventRange: [],
    eventName: "",
    eventList: [],
    showList: [],
    showId: "",
    roSchedule: [],
});

const MeetProvider = (props) => {
    const [user, setUser] = useState("");
    const [eventRange, setEventRange] = useState([]);
    const [eventName, setEventName] = useState("");
    const [eventList, setEventList] = useState([]);
    const [showList, setShowList] = useState([]);
    const [showId, setShowId] = useState("");
    const [roSchedule, setRoSchedule] = useState([]);

    /* Call the methods below to notify server */
    // request user data for homepage
    const homepage = (username) => {
        sendData(["homepage", username]);
    }
    // send data of created schedule
    const createEvent = (event) => {
        sendData(["createEvent", event]);
    }
    // join an event using event id(need to add user to this event and update the user's eventlist)
    const joinEvent = (eventId) => {
        sendData(["joinEvent", eventId]);
    }
    // edit event
    const editEvent = (eventId) => {
        sendData(["editEvent", eventId]);
    }
    // submit event
    const submitEvent = (event) => {
        sendData(["submitEvent", event]);
    }
    // change event
    const changeEvent = (eventId) => {
        sendData(["reviseEvent", eventId]);
    }
    // routine schedule
    const routineSchedule = () => {
        sendData(["routineSchedule", ""]);
    }

    const sendData = async (data) => {
        await client.send(JSON.stringify(data));
    };

    client.onmessage = (byteString) => {
        const { data } = byteString;
        const [task, payload] = JSON.parse(data);
        console.log(`task: ${task}`);
        console.log(`payload: ${payload}`);
        switch(task) {

            // receive user data to switch to homepage(return user's whole events)
            case "homepage": {
                // payload: user schema
                const temp = [];
                for(var event of payload.events){
                    temp.push({
                        title: event.name,
                        description: `Creator: ${event.creator} | Participants: ${event.pplNum} | Event ID: ${event.id}`,
                        id: event.id,
                        submitted: payload.eventSubmitted[event.id]
                    })
                }
                setEventList([...temp]);
                break;
            }

            // receive event data to switch to editing
            case "editEvent": {
                // payload: event schema
                console.log(payload)
                const { timeSlots } = payload;
                setEventRange(timeSlots);
                break;
            }

            // receive event data to switch to showing
            case "showEvent": {
                // payload: event schema
                console.log(payload);
                setShowList(payload.timeSlots);
                setShowId(payload.id);
                break;
            }

            // receive event data when someone else updates
            case "updateEvent": {
                // payload: event schema
                console.log(payload);
                setShowList(payload.timeSlots);
                setShowId(payload.id);
                break;
            }

            // receive routine schedule
            case "routineSchedule": {
                setRoSchedule(payload);
                break;
            }
            
            default: break;
        }
    }

    return (
        <MeetContext.Provider
            value={{
                user, setUser, eventRange, setEventRange, eventName, setEventName, eventList, setEventList, changeEvent,
                homepage, createEvent, joinEvent, editEvent, submitEvent, routineSchedule, showList, setShowList,
                showId, setShowId, roSchedule, setRoSchedule
            }}
            {...props}
        />
    );
}

const useMeet = () => useContext(MeetContext);

export { MeetProvider, useMeet };