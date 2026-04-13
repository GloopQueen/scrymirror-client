import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

//const VitalPollBar = (props) =>
export default function ScoreBoard(props) {
    const [dataToCompare, setDataToCompare] = useState({
        eventNum: 0,
        isActive: false,
    });

    //Polling tool
    const { isPending, isError, data, error } = useQuery({
        queryKey: ["repoData"],
        enabled: true,
        refetchInterval: 4000,
        refetchIntervalInBackground: true,
        queryFn: () =>
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
            }).then((res) => res.json()),
    });

    //If data from the server is actually new, syncs it up with the "proper" game state
    useEffect(() => {
        if (typeof data !== "undefined") {
            const newGameData = {
                ...data,
                joinCode: props.masterGameDataObject.joinCode,
                playerID: props.masterGameDataObject.playerID,
                gameOwnerName: props.masterGameDataObject.gameOwnerName,
            };
            props.setGameDataFunction(newGameData);
        }
    }, [data]);

    //Update master info.
    //Should only fire
    /*if (typeof data !== "undefined") {
        const newGameData = {
            ...data,
            joinCode: props.masterGameDataObject.joinCode,
            playerID: props.masterGameDataObject.playerID,
            gameOwnerName: props.masterGameDataObject.gameOwnerName,
        };
        props.setGameDataFunction(newGameData);
    }*/

    //const prevEventNum = props.masterGameDataObject.eventNum;
    //const prevIsActive = props.masterGameDataObject.isActive;

    //contin
    /*
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
                    //Check if it's actually new. I was spamming setting the state oops
                    setData({ eventNum: res.eventNum, isActive: res.isActive });
                    //console.log("in the loop data:");
                    //console.log(data);
                });
            //.then((data) => {
            //        setData(data);
            //   });
        }, 3000); // poll every 5 seconds

        return () => clearInterval(intervalId); // cleanup on unmount
        }, []); */

    /* if (
        data.eventNum != props.masterGameDataObject.eventNum ||
        data.isActive != props.masterGameDataObject.isActive
    ) {
        //Update the Game Data, make sure to carry over the joincode and playerID cuz otherwise itll get dropped
        console.log(
            "props.masterGameDataObject.eventNum:" +
                props.masterGameDataObject.eventNum,
        );
        console.log("prevEventNum:" + data.eventNum);
        console.log(
            "props.masterGameDataObject.isActive:" +
                props.masterGameDataObject.isActive,
        );
        console.log("prevIsActive:" + data.isActive);

        const newGameData = {
            ...data,
            joinCode: props.masterGameDataObject.joinCode,
            playerID: props.masterGameDataObject.playerID,
            gameOwnerName: props.masterGameDataObject.gameOwnerName,
        };
        props.setGameDataFunction(newGameData);
        }*/

    return (
        <>
            <div className="VitalPollBar">
                <div>Your Host: {props.masterGameDataObject.gameOwnerName}</div>
                <div>Event Number: {props.masterGameDataObject.eventNum}</div>
                <div>
                    Event Active?{" "}
                    {props.masterGameDataObject.isActive ? "Yes" : "No"}
                </div>
            </div>
        </>
    );
}
//<div>{JSON.stringify(data, null, 2)}</div>
//
