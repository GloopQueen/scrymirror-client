export default function MessageBox(props) {

  //Generate random IDs in case these get stacked
    const rando = Math.floor(Math.random() * 10000);
    const randoDivNum = "div" + rando;
    const randoSpanNum = "spam" + rando;

    return (
        <>
          <div id={randoDivNum} className="MessageBox">
            <span id={randoSpanNum} className="MessageBox">{props.message}</span>
            </div>
        </>
    );
}
