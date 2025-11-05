import { useEffect, useState } from "react";

const VitalPollBar = (props) => {
    const [data, setData] = useState(null);

    //contin
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch("http://192.168.86.45:3000/scryGameData/")
                .then((res) => res.json())
                .then((res) => {
                    setData(res);
                    props.setGameDataFunction(res);
                });
            //.then((data) => {
            //        setData(data);
            //   });
        }, 3000); // poll every 5 seconds

        return () => clearInterval(intervalId); // cleanup on unmount
    }, []);

    return (
        <div className="VitalPollBar">
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
