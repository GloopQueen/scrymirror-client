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
        console.log(typedCode);
        setCodeToTry(typedCode);
    }

    //Hit the server
    useEffect(() => {
        if (codeToTry == null) {
            return;
        }
        fetch("http://192.168.86.45:3000/scryGameData/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                joinCode: props.joinCode,
                fullUpdate: false,
            }),
        });
    }, [codeToTry]);

    return (
        <>
            <form method="post" onSubmit={handleSubmit} disabled={isLoading}>
                <div className="JoinBox">
                    <label>
                        Enter Join Code: <input name="code" />
                    </label>
                    <button>Send</button>
                </div>
            </form>
        </>
    );
}
