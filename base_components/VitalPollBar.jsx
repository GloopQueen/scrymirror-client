import { useEffect, useState } from "react";

const VitalPollBar = (props) => {
    const [data, setData] = useState(null);

    //contin
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch(props.urlStart + "scryGameData/", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    joinCode: props.joinCode,
                    fullUpdate: false,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    //Update the Game Data, make sure to carry over the joincode and playerID cuz otherwise itll get dropped
                    const newGameData = {
                        ...res,
                        joinCode: props.masterGameDataObject.joinCode,
                        playerID: props.masterGameDataObject.playerID,
                        gameOwnerName: props.masterGameDataObject.gameOwnerName,
                    };
                    setData(newGameData);
                    props.setGameDataFunction(newGameData);
                });
            //.then((data) => {
            //        setData(data);
            //   });
        }, 3000); // poll every 5 seconds

        return () => clearInterval(intervalId); // cleanup on unmount
    }, []);

    return (
        <div className="VitalPollBar">
            <div>Your Host: {props.masterGameDataObject.gameOwnerName}</div>
            <div>Event Number: {props.masterGameDataObject.eventNum}</div>
            <div>
                Event Active?{" "}
                {props.masterGameDataObject.isActive ? "Yes" : "No"}
            </div>
        </div>
    );
};
//<div>{JSON.stringify(data, null, 2)}</div>
//
export default VitalPollBar;
