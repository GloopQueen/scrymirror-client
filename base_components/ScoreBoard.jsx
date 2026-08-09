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
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        queryFn: () =>
            fetch(props.urlStart + "scryGameData/", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    joinCode: props.masterGameDataObject.joinCode,
                    playerID: props.masterGameDataObject.playerID,
                    fullUpdate: true,
                }),
            })
                .then((res) => {
                    //console.log(res.json()); //probably cleanupable
                    let response = res.json();
                    //console.log("local:");
                    //console.log(props.masterGameDataObject);
                    //You can get the data to barf to the console client-side, you just need to get it into the data structure here so it can be put in the "main" State.
                    return response;
                })
                .then((val) => {
                    //console.log("remote:");
                    //console.log(val);
                    return val;
                }),
    });

    //If data from the server is actually new, syncs it up with the "proper" game state
    useEffect(() => {
        if (typeof data !== "undefined") {
            console.log(data);
            const newGameData = {
                ...data,
                joinCode: props.masterGameDataObject.joinCode,
                playerID: props.masterGameDataObject.playerID,
                gameOwnerName: props.masterGameDataObject.gameOwnerName,
            };
            props.setGameDataFunction(newGameData);
        }
    }, [data]);

    const scoreVarsTest = {
        boatName: {
            label: "Boat Name",
            value: "The Hlungus",
            row: 1,
            column: 1,
            width: 4,
            height: 1,
        },
        averageStyle: {
            label: "Average Style",
            value: 4.12,
            row: 2,
            column: 1,
            width: 1,
            height: 2,
        },
        averageACAB: {
            label: "Average ACAB",
            value: 5.36,
            row: 2,
            column: 2,
            width: 1,
            height: 2,
        },
        averageRide: {
            label: "Average Desire",
            value: 3.82,
            row: 2,
            column: 3,
            width: 1,
            height: 2,
        },
    };

    //Reads the score information and maps it out for the grid.
    function renderScores() {
        const scoreVars = props.masterGameDataObject.scoreVars;
        if (scoreVars == undefined) {
            return null;
        }
        const scoreArray = Object.keys(scoreVars);
        const scoreDivs = scoreArray.map((item) => {
            console.log(item);
            return (
                <div
                    className="gridDiv"
                    key={item}
                    style={{
                        gridRow: `${scoreVars[item].row}/ span ${scoreVars[item].height}`,
                        gridColumn: `${scoreVars[item].column}/ span ${scoreVars[item].width}`,
                    }}
                >
                    {/*Grab a different CSS and add a break if the box is tall. */}
                    <span
                        className={
                            scoreVars[item].height > 1
                                ? "gridDivLabel"
                                : "gridDivLabel1line"
                        }
                    >
                        {scoreVars[item].label}
                    </span>

                    {scoreVars[item].height > 1 ? <br /> : " : "}

                    <span
                        className={
                            scoreVars[item].height > 1
                                ? "gridDivValue"
                                : "gridDivValue1line"
                        }
                    >
                        {scoreVars[item].value}
                    </span>
                </div>
            );
        });
        console.log(scoreDivs);
        return <div className="gridParent">{scoreDivs}</div>;
    }

    function renderTeamName() {
        if (Object.hasOwn(props.masterGameDataObject, "yourTeamName")) {
            return (
                <div>👤 {props.masterGameDataObject.yourTeamName} </div>
          )
      }
    }

    return (
        <>
            <div className="wholeScoreboard">
                <div className="VitalPollBar">
                    <div>
                        Host: {props.masterGameDataObject.gameOwnerName}
                    </div>
                    <div>
                        Event #{props.masterGameDataObject.eventNum}, {props.masterGameDataObject.isActive ? "Active" : "Not Active"}.
                    </div>
                    {renderTeamName()}
                </div>
                {renderScores()}
            </div>
        </>
    );
}
//<div>{JSON.stringify(data, null, 2)}</div>
//
