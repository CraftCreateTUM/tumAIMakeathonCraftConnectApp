import { useState } from "react";
import {
  getBulletPointList,
  getDescriptionSentence,
  translateText,
} from "./services/axiosService";
import "./App.css";
import { ChakraProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme'
import { Button, Heading, ButtonGroup, Center, Stack, IconButton, Box, Textarea} from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import { FaCamera } from 'react-icons/fa';
import { FaMicrophone } from 'react-icons/fa';




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
    translateText(textAreaValue)
      .then((response) => {
        console.log(response.data)
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
    <ChakraProvider>
      <Box bg="#9AE6B4">
      <Center>
      <Stack>
      <Heading>Craft Connect</Heading>
      <Button colorScheme='blue' onClick={() => {
          setShowReportSurvey(!showReportSurvey);
        }}>
        Create new report
      </Button>
      
      {showReportSurvey && (
        <div>
          <Box borderRadius="md" style={{ height: 300, width: 230, backgroundColor: "#e9e9e9" }}>
            <div style={{ marginLeft: "3px", marginTop: "6px" }}>
              <Center>
              <Heading  as="h3" size="md" style={{ marginBottom: "3px" }}>Status of work </Heading>
              </Center>
              <Box as="p" fontSize="xs" fontWeight="bold" color="black">
                <Heading as="h4" size="md"> Description </Heading>
              {descriptionSentence.slice(0,100) + "..."}
              </Box>
              <Heading as="h4" size="md"> Reason </Heading>
              <Box as="p" fontSize="xs" fontWeight="bold" color="black">
              {wholeText.slice(0,100) + "..."}
              </Box>
              <Heading as="h4" size="md"> List </Heading>
              <Box as="p" fontSize="xs" fontWeight="bold" color="black">
              {bulletList.slice(0,100) + "..."}
              </Box>
            </div>
          </Box>
          <div>
          <Center>
          <IconButton aria-label="Open chat" icon={<ChatIcon />}
              
              onClick={() => {
                setShowTextReportBox(!showTextReportBox);
              }}
            />
            <IconButton aria-label="Open chat" icon={<FaCamera />}
              
              onClick={() => {
               //Insert function here;
              }}
            />
            <IconButton aria-label="Open chat" icon={<FaMicrophone />}
              
              onClick={() => {
               //Insert function here;
              }}
            />
            </Center>
          </div>
          {showTextReportBox && (
            // align on top of each other
            <Box>
              <p>What have you done today?</p>
              <form onSubmit={handleSubmit}>
                <Textarea
                  value={textAreaValue}
                  onChange={(event) => {
                    setTextAreaValue(event.target.value);
                  }}
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
