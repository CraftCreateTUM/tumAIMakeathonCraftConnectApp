import { useState } from "react";
import {
  postTextReport,
  getBulletPointList,
  getDescriptionSentence,
} from "./services/axiosService";
import "./App.css";

function App() {
  const [showReportSurvey, setShowReportSurvey] = useState(false);
  const [showTextReportBox, setShowTextReportBox] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [descriptionSentence, setDescriptionSentence] = useState("Unfilled");
  const [wholeText, setWholetext] = useState("Unfilled");
  const [bulletList, setBulletList] = useState("Unfilled");

  const handleSubmit = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    console.log("submitting text: ", textAreaValue);
    setDescriptionSentence("Loading...");
    getDescriptionSentence(textAreaValue)
      .then((response) => {
        setDescriptionSentence(
          response.data.message ? response.data.message : "Error in response"
        );
      })
      .catch((error) => {
        console.log("error in frontend: ", error);
      });
    setBulletList("Loading...");
    getBulletPointList(textAreaValue)
      .then((response) => {
        setBulletList(
          response.data.message ? response.data.message : "Error in response"
        );
        //setWholetext(response.data.message ? response.data.message : "Error in response");
      })
      .catch((error) => {
        console.log("error in frontend: ", error);
      });

    // send text area respons to backend
    setWholetext("Loading...");
    postTextReport(textAreaValue)
      .then((response) => {
        console.log("response message backend: ", response.data.message);
        setWholetext(
          response.data.message ? response.data.message : "Error in response"
        );
      })
      .catch((error) => {
        console.log("error in frontend: ", error);
      });

    // reset text area
    setTextAreaValue("");

    // close text report box
    setShowTextReportBox(!setShowTextReportBox);
  };

  return (
    <>
      <h2>Craft Connect</h2>
      <button
        onClick={() => {
          setShowReportSurvey(!showReportSurvey);
        }}
      >
        Create new report
      </button>
      {showReportSurvey && (
        <div>
          <div style={{ height: 300, width: 200, backgroundColor: "#e9e9e9" }}>
            <div style={{ marginLeft: "3px", marginTop: "6px" }}>
              <h5 style={{ marginBottom: "3px" }}>Status of work: </h5>
              <p>{descriptionSentence.slice(0, 50) + "..."}</p>
              <p>{wholeText.slice(0, 50) + "..."}</p>
              <p>{bulletList.slice(0, 50) + "..."}</p>
            </div>
          </div>
          <div>
            <button
              className="report-button"
              onClick={() => {
                setShowTextReportBox(!showTextReportBox);
              }}
            >
              text
            </button>
            <button className="report-button">speech</button>
            <button className="report-button">image</button>
          </div>
          {showTextReportBox && (
            // align on top of each other
            <div>
              <p>What have you done today?</p>
              <form onSubmit={handleSubmit}>
                <textarea
                  style={{ height: 100, width: 400 }}
                  value={textAreaValue}
                  onChange={(event) => {
                    setTextAreaValue(event.target.value);
                  }}
                ></textarea>
                <div>
                  <button type="submit" className="report-button">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
