import { useEffect, useState } from "react";

export default function JoinCodeBox(props) {
    let isLoading = false;

    //The joinCode and the username which will be submitted to the server.
    // I think these should be in one useState as an object but (makes jerk off motion)
    const [codeToTry, setCodeToTry] = useState("");
    const [nameToTry, setNameToTry] = useState("");

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

    //Hit the server
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
                    const newGameData = {
                        ...props.masterGameDataObject,
                        playerID: res.playerID,
                        gameOwnerName: res.gameOwnerName,
                        joinCode: codeToTry,
                    };
                    props.setGameDataFunction(newGameData);
                }
            });
    }, [codeToTry]);

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
