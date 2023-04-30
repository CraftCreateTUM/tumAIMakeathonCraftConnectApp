import { useState, useCallback, ChangeEvent } from "react";

import {
  getBulletPointList,
  getDescriptionSentence,
  translateText,
  getAudioTranscription,
  getPdfFromServer,
  getOcr,
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
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";

import { ChatIcon } from "@chakra-ui/icons";
import { FaCamera } from "react-icons/fa";

function App() {
  const [showTextReportBox, setShowTextReportBox] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [descriptionSentence, setDescriptionSentence] = useState("Unfilled");
  const [wholeText, setWholetext] = useState("Unfilled");
  const [bulletList, setBulletList] = useState("Unfilled");
  const [pdfReadyToBeMade, setPdfReadyToBeMade] = useState(false);
  const [cameraButtonPressed, setCameraButtonPressed] = useState(false);
  const [audioToTextLoading, setAudioToTextLoading] = useState(false);
  const [personRecording, setPersonRecording] = useState(false);

  const [audioFile, setAudioFile] = useState("");

  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob: Blob) => {
    setPersonRecording(false);
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    setAudioFile(url);
    console.log("File was set");
    const iconRow = document.getElementById("icon-row");
    const parentDiv = document.getElementById("parent-div");
    parentDiv ? parentDiv.insertBefore(audio, iconRow) : null;
  };

  const transcribeAudio = () => {
    setAudioToTextLoading(true);
    getAudioTranscription(audioFile)
      .then((response) => {
        setShowTextReportBox(true);
        console.log("Transcription response: ", response);
        setTextAreaValue(response.data.transcription);
        setAudioToTextLoading(false);
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
    setShowTextReportBox(false);

    // set pdf ready to be made
    setPdfReadyToBeMade(true);
  };

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      //setFile(event.target.files[0]);
      getOcr(event.target.files[0])
        .then((response) => {
          setShowTextReportBox(true);
          console.log(response.data.text);
          setTextAreaValue(response.data.text);
        })
        .catch((error) => {
          console.log("error in frontend: ", error);
        });
    },
    []
  );

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTextAreaValue(event.target.value);
  };

  const handlePdfDownloading = () => {
    getPdfFromServer({
      name: "Jan Meyer",
      company: "electrovolt",
      location: "Bayern, Germany",
      codeWordEquipment: "0203030401",
      descriptionnumber: "0203030401",
      description: descriptionSentence,
      servicenumber: "123456789",
      jobdescription: wholeText,
      dotlist: bulletList,
      date: new Date().toISOString().split("T")[0].toString(),
    })
      .then((response) => {
        // open pdf in new tab
        const file = new Blob([response.data], {
          type: "application/pdf;base64",
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);

        // reset all states

        setShowTextReportBox(false);
        setTextAreaValue("");
        setDescriptionSentence("Unfilled");
        setWholetext("Unfilled");
        setBulletList("Unfilled");
        setPdfReadyToBeMade(false);
      })
      .catch((error) => {
        console.log("error in pdf: ", error);
      });
  };

  return (
    <Box bg="#189AB4" h="100vh">
      <ChakraProvider>
        <Center>
          <Stack>
            <Center>
              <Box style={{ marginTop: "2em" }}>
                <Heading color="white">Craft Connect</Heading>
              </Box>
            </Center>
            <Box
              borderRadius="md"
              style={{
                height: "75%",
                width: "100%",
                backgroundColor: "#e9e9e9",
              }}
            ></Box>
            <Center style={{ marginBottom: "0.3em" }}>
              <Heading size="md">Choose input source</Heading>
            </Center>
            <div id="parent-div">
              <Center>
                {!personRecording && (
                  <>
                    <IconButton
                      onDragOver={() => {
                        "Click this to input text";
                      }}
                      aria-label="Open chat"
                      rounded={"full"}
                      icon={<ChatIcon />}
                      onClick={() => {
                        setShowTextReportBox(!showTextReportBox);
                      }}
                      style={{ margin: "1em" }}
                    />
                    <IconButton
                      onDragOver={() => {
                        "Click this to input a photo";
                      }}
                      aria-label="Open camera"
                      rounded={"full"}
                      icon={<FaCamera />}
                      onClick={() => {
                        setCameraButtonPressed(!cameraButtonPressed);
                      }}
                      style={{ margin: "1em" }}
                    />
                  </>
                )}

                <Box
                  style={{ margin: "1em" }}
                  onClick={() => {
                    setPersonRecording(true);
                  }}
                >
                  <AudioRecorder
                    onRecordingComplete={(blob: Blob) => addAudioElement(blob)}
                    recorderControls={recorderControls}
                  />
                </Box>
              </Center>
              <div id="icon-row"></div>
              {cameraButtonPressed && (
                <Box>
                  <Input
                    type="file"
                    name="myImage"
                    borderRadius={20}
                    onChange={handleFileChange}
                    accept="image/*"
                    padding="0.4em"
                    paddingLeft="1.2em"
                    borderWidth="0.1em"
                  />
                </Box>
              )}

              {audioFile !== "" && (
                <Box>
                  <Center marginTop="1em">
                    <Button onClick={transcribeAudio}>Transcribe audio</Button>
                  </Center>
                  {audioToTextLoading && (
                    <Center marginTop="1em">
                      <p style={{ marginRight: "0.5em" }}>
                        Turning speach to text
                      </p>
                      <Spinner />
                    </Center>
                  )}
                </Box>
              )}

              {showTextReportBox && (
                // align on top of each other
                <Center>
                  <Box style={{ marginLeft: "1em" }}>
                    <Heading
                      size="md"
                      style={{ marginBottom: "1em", marginTop: "1em" }}
                    >
                      {" "}
                      What have you done today?
                    </Heading>
                    <FormControl onSubmit={handleSubmit}>
                      <Textarea
                        value={textAreaValue}
                        onChange={handleTextAreaChange}
                        placeholder="Please write here..."
                        style={{ backgroundColor: "white" }}
                      ></Textarea>

                      <Box style={{ marginTop: "0.5em", marginBottom: "1em" }}>
                        <Button
                          colorScheme="green"
                          type="submit"
                          className="report-button"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </Box>
                    </FormControl>
                  </Box>
                </Center>
              )}
            </div>

            {pdfReadyToBeMade && (
              <div style={{ marginTop: "1em" }}>
                <Center>
                  <Heading
                    as="h2"
                    size="md"
                    style={{
                      marginBottom: "5px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  >
                    Preview of PDF
                  </Heading>
                </Center>
                <Box
                  borderRadius="md"
                  style={{
                    height: "75%",
                    width: "100%",
                    backgroundColor: "#e9e9e9",
                  }}
                >
                  <Box style={{ padding: "0.8em" }}>
                    <div style={{ marginLeft: "3px", marginTop: "6px" }}>
                      <Box
                        overflow="auto"
                        overflowY="hidden"
                        style={{ height: "75%", width: "100%" }}
                        as="p"
                        fontSize="xs"
                        fontWeight="bold"
                        color="black"
                      >
                        <Heading as="h4" size="md">
                          {" "}
                          Description{" "}
                        </Heading>
                        <Box
                          overflow="auto"
                          overflowY="hidden"
                          style={{ height: "75%", width: "100%" }}
                          as="p"
                          fontSize="xs"
                          fontWeight="bold"
                          color="black"
                        ></Box>
                        {descriptionSentence}
                      </Box>

                      <Stack>
                        <Heading as="h4" size="md">
                          {" "}
                          Reason{" "}
                        </Heading>
                        <Stack>
                          <Box
                            overflowY="scroll"
                            style={{ height: "75%", width: "100%" }}
                            as="p"
                            fontSize="xs"
                            fontWeight="bold"
                            color="black"
                          >
                            {wholeText}
                          </Box>
                        </Stack>
                      </Stack>

                      <Heading as="h4" size="md">
                        {" "}
                        List{" "}
                      </Heading>
                      <Box
                        overflowY="scroll"
                        style={{ height: "75%", width: "100%" }}
                        as="p"
                        fontSize="xs"
                        fontWeight="bold"
                        color="black"
                      >
                        {bulletList}
                      </Box>
                    </div>
                  </Box>
                </Box>
                <Center>
                  {descriptionSentence === "Loading..." ||
                  wholeText === "Loading..." ||
                  bulletList === "Loading..." ? (
                    <Spinner
                      style={{ marginLeft: "1em", marginRight: "1em", marginTop: "1em", marginBottom: "1em"}}
                    />
                  ) : (
                    descriptionSentence !== "Unfilled" &&
                    wholeText !== "Unfilled" &&
                    bulletList !== "Unfilled" && (
                      <Button
                        colorScheme="green"
                        onClick={handlePdfDownloading}
                        padding="2em"
                        borderRadius="20px"
                        style={{
                          marginTop: "1em",
                          marginLeft: "1em",
                          marginRight: "1em",
                          marginBottom: "1em",
                        }}
                      >
                        Download PDF
                      </Button>
                    )
                  )}
                </Center>
              </div>
            )}
          </Stack>
        </Center>
      </ChakraProvider>
    </Box>
  );
}
export default App;
