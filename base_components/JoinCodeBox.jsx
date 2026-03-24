import { useEffect, useState } from "react";

export default function JoinCodeBox(props) {
    let isLoading = false;

    const [codeToTry, setCodeToTry] = useState(null);

    //Grab the code out of the form.
    function handleSubmit(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const typedCode = formData.get("code");
        //console.log(typedCode);
        setCodeToTry(typedCode);
    }

    //Hit the server
    useEffect(() => {
        if (codeToTry == null) {
            return;
        }
        isLoading = true;
        //console.log(props.urlStart);
        fetch(props.urlStart + "scryGameData/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                joinCode: codeToTry,
                fullUpdate: false,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                isLoading = false;
                console.log(res);
                //Check if a Game Owner name got returned and assume that means a valid game is running.
                if (Object.hasOwn(res, "gameOwnerName")) {
                    //console.log(res.gameOwnerName);
                    const newRandomPlayerID = Math.floor(
                        Math.random() * 100000,
                    );
                    const newGameData = {
                        ...props.masterGameDataObject,
                        playerID: newRandomPlayerID,
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
                    <button disabled={isLoading}>Send</button>
                </div>
            </form>
        </>
    );
}
