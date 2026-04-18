import React from "react";
export default function MultiMulti(props) {
    const questionNameArray = props.data.options.questionNameArray;
    const choiceArrays = props.data.options.choiceArrays;

    //The answer array will also serve as our counter via it's length.
    const [answerArray, setAnswerArray] = React.useState([]);

    //handles the form, updates the array of answers.
    function handleSubmit(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const eventChoice = formData.get("eventChoice");

        if (eventChoice != null) {
            console.log("poke");
            //const newNumber = testNumber + 1;
            //setTestNumber(newNumber);
            setAnswerArray([...answerArray, eventChoice]);
            document.getElementById("theForm").reset();

            //props.valueResponseFunction(eventChoice); <<--- you want this for final submit tho
        }
    }

    //Updates the main variable (and kicks off sending to the server) once all answers are collected.
    React.useEffect(() => {
        if (answerArray.length >= questionNameArray.length) {
            props.valueResponseFunction(answerArray);
        }
    }, [answerArray]);

    //If for whatever reason, they've answered all the questions but data hasn't been sent yet, this'll show.
    if (answerArray.length >= questionNameArray.length) {
        return (
            <div className="MultiChoice">
                <header key="thequestion">{props.data.questionText}</header>
                <p>All Answers Submitted!</p>
            </div>
        );
    }

    return (
        <>
            <form method="post" onSubmit={handleSubmit} id="theForm">
                {/*this div generates the array of multichoice radio buttons */}
                <div className="MultiChoice">
                    <header key="thequestion">{props.data.questionText}</header>
                    <header key="thesubquestion">
                        {questionNameArray[answerArray.length]}
                    </header>
                    {choiceArrays[answerArray.length].map(
                        (option, currentIndex) => {
                            return (
                                <>
                                    <label
                                        key={currentIndex}
                                        htmlFor={option.value}
                                        className="label-for-check"
                                    >
                                        <input
                                            className="check-with-label"
                                            type="radio"
                                            name="eventChoice"
                                            value={option.value}
                                            id={option.value}
                                        />

                                        {option.label}
                                    </label>
                                    <br />
                                </>
                            );
                        },
                    )}
                    <button>Answer</button>
                </div>
            </form>
        </>
    );
}
