import { useState } from "react";

import {
  getBulletPointList,
  getDescriptionSentence,
  translateText,
  getAudioTranscription,
} from "./services/axiosService";

// dont check for types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
// Check quick-start docs here: https://www.npmjs.com/package/react-audio-voice-recorder

import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
// import chakraTheme from "@chakra-ui/theme";
import {
  Button,
  Heading,
  Center,
  Stack,
  IconButton,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { FaCamera } from "react-icons/fa";
// import { FaMicrophone } from "react-icons/fa";

function App() {
  const [showReportSurvey, setShowReportSurvey] = useState(false);
  const [showTextReportBox, setShowTextReportBox] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [descriptionSentence, setDescriptionSentence] = useState("Unfilled");
  const [wholeText, setWholetext] = useState("Unfilled");
  const [bulletList, setBulletList] = useState("Unfilled");

  const [audioFile, setAudioFile] = useState("");

  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    setAudioFile(url);
    console.log("File was set");
    document.body.appendChild(audio);
  };

  const transcribeAudio = () => {
    getAudioTranscription(audioFile)
      .then((response) => {
        setShowTextReportBox(true);
        console.log("Transcription response: ", response);
        setTextAreaValue(response.data.transcription);
      })
      .catch((error) => {
        console.log("error in frontend: ", error);
      });
  };

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
    translateText(textAreaValue)
      .then((response) => {
        console.log(response.data);
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

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTextAreaValue(event.target.value);
  };

  return (
    <ChakraProvider>
      <Box bg="#9AE6B4">
        <Center>
          <Stack>
            <Heading>Craft Connect</Heading>
            <Button
              colorScheme="blue"
              onClick={() => {
                setShowReportSurvey(!showReportSurvey);
              }}
            >
              Create new report
            </Button>

            {showReportSurvey && (
              <div>
                <Box
                  borderRadius="md"
                  style={{
                    height: 300,
                    width: 230,
                    backgroundColor: "#e9e9e9",
                  }}
                >
                  <div style={{ marginLeft: "3px", marginTop: "6px" }}>
                    <Center>
                      <Heading
                        as="h3"
                        size="md"
                        style={{ marginBottom: "3px" }}
                      >
                        Status of work{" "}
                      </Heading>
                    </Center>
                    <Box as="p" fontSize="xs" fontWeight="bold" color="black">
                      <Heading as="h4" size="md">
                        {" "}
                        Description{" "}
                      </Heading>
                      {descriptionSentence.slice(0, 100) + "..."}
                    </Box>
                    <Heading as="h4" size="md">
                      {" "}
                      Reason{" "}
                    </Heading>
                    <Box as="p" fontSize="xs" fontWeight="bold" color="black">
                      {wholeText.slice(0, 100) + "..."}
                    </Box>
                    <Heading as="h4" size="md">
                      {" "}
                      List{" "}
                    </Heading>
                    <Box as="p" fontSize="xs" fontWeight="bold" color="black">
                      {bulletList.slice(0, 100) + "..."}
                    </Box>
                  </div>
                </Box>
                <div>
                  <Center>
                    <IconButton
                      aria-label="Open chat"
                      icon={<ChatIcon />}
                      onClick={() => {
                        setShowTextReportBox(!showTextReportBox);
                      }}
                    />
                    <IconButton
                      aria-label="Open chat"
                      icon={<FaCamera />}
                      onClick={() => {
                        //Insert function here;
                      }}
                    />
                    <button
                      className="transcribe-button"
                      onClick={transcribeAudio}
                    >
                      Transcribe audio
                    </button>

                    <div>
                      <AudioRecorder
                        onRecordingComplete={(blob: Blob) =>
                          addAudioElement(blob)
                        }
                        recorderControls={recorderControls}
                      />
                      <br />
                      <button onClick={recorderControls.stopRecording}>
                        Stop recording
                      </button>
                      <br />
                    </div>
                  </Center>
                </div>
                {showTextReportBox && (
                  // align on top of each other
                  <Box>
                    <p>What have you done today?</p>
                    <form onSubmit={handleSubmit}>
                      <Textarea
                        value={textAreaValue}
                        onChange={handleTextAreaChange}
                      ></Textarea>
                      <Box>
                        <button type="submit" className="report-button">
                          Submit
                        </button>
                      </Box>
                    </form>
                  </Box>
                )}
              </div>
            )}
          </Stack>
        </Center>
      </Box>
    </ChakraProvider>
  );
}

export default App;
