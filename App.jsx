import React from "react";
import MultiChoice from "./event_components/MultiChoice";
import VitalPollBar from "./base_components/VitalPollBar";
import JoinCodeBox from "./base_components/JoinCodeBox";

/* const testArray = [
    { id: 1, name: "math" },
    { id: 2, name: "science" },
    { id: 3, name: "geology" },
    ];*/

export default function App(props) {
    //////THE FUNCTION PARTY
    //Note to me functions you're gonna pass to components have to be here. I guess so they get exported??

    //Handles Event components responding with a value, and submits to server.
    function sendAnswer(newValue) {
        setTheAnswerData({
            ...theAnswerData,
            value: newValue,
            sentStatus: "ready",
        });
        //console.log(theAnswerData);
    }

    //////// MAMA'S HOME COOKED VARIABLES
    //

    //get the server URL
    const [scryServerURL, setScryServerURL] = React.useState(
        import.meta.env.VITE_SCRY_URL,
    );

    //Data from the scryGameData endpoint. This is polled regularly and kicks off pretty much everything else.
    //
    //Crucially, there's an event number in here which kicks off grabbing the full Event.
    //note to me, there's going to need to be an isEventActive variable on the scoreboard to handle joining at weird times.
    const [scryGameData, setScryGameData] = React.useState({
        eventNum: 0,
        isActive: false,
        //joinCode: "LHYS78",
        joinCode: "",
        playerID: 0,
        gameOwnerName: "",
    });
    //
    //data about the current (running) event, basically the JSON event from the server is here
    const [activeEventData, setactiveEventData] = React.useState(null);
    //
    //If the event is "available" aka we have an interaction we want to show the user.
    //This should be false
    // - When the user has completed the interaction and it's successfully reported back to the server.
    // - When the server says so.
    const [isActiveEventAvailable, setisActiveEventAvailable] =
        React.useState(false);
    //
    // The structure and status of the Answer to the server.
    // The Answer includes the verb, the value, the current Event number, the player's ID, the response time, and if the Answer's been sent yet.
    const [theAnswerData, setTheAnswerData] = React.useState({
        sentStatus: "preparing", //must be "preparing", "ready" or "sent" to indicate what's going
        eventNum: 0,
        verb: "",
        value: "",
        playerID: 1,
        responseTime: 0,
    });

    /////////////USEEFFECT CITY
    //
    //Fetch the current Event data whenever the event number changes.
    React.useEffect(() => {
        //TODO: this should probably check if the server says the Event is active, and bail if not.
        //TODO: This should bail if the event is 0. That way it ignores initializing.
        if (scryGameData.eventNum != 0 && scryGameData.isActive == true) {
            fetch(scryServerURL + "scryGameData/", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    joinCode: props.joinCode,
                    fullUpdate: true,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setactiveEventData(data.currentEvent);
                    setisActiveEventAvailable(true);
                    setTheAnswerData({
                        ...theAnswerData,
                        eventNum: data.eventNum,
                        verb: data.currentEvent.verb,
                        value: "",
                        sentStatus: "preparing",
                    });
                });
        }
    }, [scryGameData.eventNum, scryGameData.isActive]);

    // Post the Answer whenever sentStatus changes (if ready)
    React.useEffect(() => {
        if (theAnswerData.sentStatus != "ready") {
            return;
        }
        //setup outgoing words

        const outgoingData = theAnswerData;
        theAnswerData.joinCode = scryGameData.joinCode;
        delete outgoingData.sentStatus;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(outgoingData),
        };
        fetch("http://glooppi:3000/scryGameData/", requestOptions)
            .then((res) => {
                console.log(res.status); //TODO: turn this into actually warning when it was bad.
                return res.json();
            })
            .then((data) => {
                setTheAnswerData({ ...theAnswerData, sentStatus: "sent" });
            });
    }, [theAnswerData.sentStatus]);

    //Renders Event area beneath scoreboard. Future logic on different types of events will be in here
    function renderEventArea() {
        return (
            <MultiChoice
                data={activeEventData}
                valueResponseFunction={sendAnswer}
            />
        );
    }

    // The Poll Bar shows basic game info and also actually polls the server
    function renderVitalPollBar() {
        return (
            <VitalPollBar
                masterGameDataObject={scryGameData}
                setGameDataFunction={setScryGameData}
                urlStart={scryServerURL}
            />
        );
    }

    function renderJoinCodeBox() {
        return (
            <JoinCodeBox
                masterGameDataObject={scryGameData}
                setGameDataFunction={setScryGameData}
                urlStart={scryServerURL}
            />
        );
    }

    //Check if there's a join code
    let isThereAJoinCode = false;
    if (
        Object.hasOwn(scryGameData, "joinCode") &&
        scryGameData.joinCode.length > 0
    ) {
        isThereAJoinCode = true;
    }

    //Actual rendering code
    return (
        <>
            {isThereAJoinCode ? renderVitalPollBar() : renderJoinCodeBox()}

            {isActiveEventAvailable && theAnswerData.sentStatus != "sent"
                ? renderEventArea()
                : null}
            {/*<div>
                <pre>{JSON.stringify(activeEventData, null, 2)}</pre>
            </div>*/}
        </>
    );
}
