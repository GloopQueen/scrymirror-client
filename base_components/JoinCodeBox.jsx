import { useEffect, useState } from "react";

export default function JoinCodeBox(props) {
    let isLoading = false; //Used to shut off the Submit button.
    let scryExistingGame = {}; //Used to store data out of localStorage if we're trying to rejoin an existing game

    //The joinCode and the username which will be submitted to the server.
    // I think these should be in one useState as an object but (makes jerk off motion)
    const [codeToTry, setCodeToTry] = useState("");
    const [nameToTry, setNameToTry] = useState("");
    //On first run, client will try and auto rejoin a game if
    const [didAutoRejoinRun, setDidAutoRejoinRun] = useState(false);

    //Grab the code out of the form.
    function handleSubmit(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        let typedCode = formData.get("code");
        typedCode = typedCode.toUpperCase();
        let typedName = formData.get("playerName");
        setNameToTry(typedName.replace(/\W/g, "")); //I don't know regex lol that should remove any nonsense
        setCodeToTry(typedCode);
    }

    //Hit the server on input. Runs when "code to try" updates as a result of the form being submitted.
    useEffect(() => {
        //check that they actually put in a code and name
        if (codeToTry.length < 1 || nameToTry.length < 1) {
            console.log("Code and/or Name looks too short.");
            return;
        }

        isLoading = true;
        //console.log(props.urlStart);
        fetch(props.urlStart + "scryGameData/new", {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                joinCode: codeToTry,
                name: nameToTry,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                isLoading = false;
                console.log(res);
                //Check if there's no error.
                if (Object.hasOwn(res, "error") && res.error == false) {
                    //console.log(res.gameOwnerName);
                    /* const newRandomPlayerID = Math.floor(
                        Math.random() * 100000,
                    ); */
                    //Circumsize the team code, if there was one.
                    const shortCode = codeToTry.split("-");
                    //oh it's [0]

                    //Create new game state info to pass up to the main App.jsx
                    const newGameData = {
                        ...props.masterGameDataObject,
                        playerID: res.playerID,
                        gameOwnerName: res.gameOwnerName,
                        joinCode: shortCode[0],
                    };
                    //Save to local storage
                    const newLocalGameDeets = {
                        playerID: res.playerID,
                        joinCode: shortCode[0],
                    };
                    localStorage.setItem(
                        "scryExistingGame",
                        JSON.stringify(newLocalGameDeets),
                    );
                    //Pass the data up, finally.
                    //App.jsx is looking for a gameOwnerName to be set, which will hide the join stuff and kick off real polling.
                    props.setGameDataFunction(newGameData);
                }
            });
    }, [codeToTry]);

    //Auto rejoin. Runs once, attempts to connect to localstorage game data.
    useEffect(() => {
        console.log("Attempting to rejoin existing game.");
        if (localStorage.getItem("scryExistingGame") === null) {
            console.log("No existing game data found.");
            return;
        }
        isLoading = true;
        scryExistingGame = JSON.parse(localStorage.getItem("scryExistingGame")); //pull vars out of local storage
        //Attempt to do a "normal" scoreboard check in. If there's no error, assume life is "real."
        fetch(props.urlStart + "scryGameData", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                joinCode: scryExistingGame.joinCode,
                playerID: scryExistingGame.playerID,
                fullUpdate: true,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                isLoading = false;
                console.log(res);
                //Check if there's no error.
                if (Object.hasOwn(res, "error") && res.error == false) {
                    //console.log(res.gameOwnerName);
                    /* const newRandomPlayerID = Math.floor(
                        Math.random() * 100000,
                    ); */
                    console.log("Rejoining existing game!");
                    const newGameData = {
                        ...props.masterGameDataObject,
                        playerID: scryExistingGame.playerID,
                        gameOwnerName: res.gameOwnerName,
                        joinCode: scryExistingGame.joinCode,
                    };
                    props.setGameDataFunction(newGameData);
                } else {
                    localStorage.removeItem("scryExistingGame");
                    console.log(
                        "Unable to rejoin existing game. Deleting stored playerID.",
                    );
                }
            });
    }, []);

    return (
        <>
            <form method="post" onSubmit={handleSubmit} disabled={isLoading}>
                <div className="JoinBox">
                    <label>
                        Enter Join Code: <input name="code" />
                    </label>
                    <br />
                    <label>
                        Enter Your Name: <input name="playerName" />
                    </label>
                    <button disabled={isLoading}>Send</button>
                </div>
            </form>
        </>
    );
}
