export default function MultiChoice(props) {
    const optionsArray = props.data.options;

    function handleSubmit(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const eventChoice = formData.get("eventChoice");
        console.log(eventChoice);
        if (eventChoice != null) {
            props.valueResponseFunction(eventChoice);
        }
    }

    return (
        <>
            <form method="post" onSubmit={handleSubmit}>
                {/*this div generates the array of multichoice radio buttons */}
                <div className="MultiChoice">
                    <header key="thequestion">{props.data.questionText}</header>
                    {optionsArray.map((option, currentIndex) => {
                        return (
                            <div key={currentIndex} className="Radio_Section">
                                <label className="label-for-check">
                                    <input
                                        className="check-with-label"
                                        type="radio"
                                        name="eventChoice"
                                        value={option.value}
                                    />

                                    {option.label}
                                </label>
                                <br />
                            </div>
                        );
                    })}
                    <button>Answer</button>
                </div>
            </form>
        </>
    );
}
