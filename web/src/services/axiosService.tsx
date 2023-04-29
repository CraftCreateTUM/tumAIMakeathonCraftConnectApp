import axios, { AxiosResponse } from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "https://craft-connect-api-xztl4.ondigitalocean.app",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// send the text report to the backend
export const postTextReport = (report: string) => {
  return axiosInstance.post("/gpt", {
    message: report,
  });
};

export const getBulletPointList = (bulletPointList: string) => {
  return axiosInstance.post("/bullet_points", {
    message: bulletPointList,
  });
};

export const getDescriptionSentence = (summary: string) => {
  return axiosInstance.post("/description_sentence", {
    message: summary,
  });
};

export const translateText = (text: string) => {
  return axiosInstance.post("/translate", {
    message: text,
  });
};

interface PdfData {
  name: string;
  company: string;
  location: string;
  codeWordEquipment: string;
  descriptionnumber: string;
  description: string;
  servicenumber: string;
  jobdescription: string;
  dotlist: string;
  date: string;
}

export const getPdfFromServer = (pdfData: PdfData) => {
  return axiosInstance.post("/pdf", pdfData);
};

const transcriptionInstance = axios.create({
  baseURL: "https://christopherschuetz.de:5000",
  timeout: 45000,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
});

export const getAudioTranscription = async (audioUrl: string): Promise<AxiosResponse> => {
  let result = {
    data: {
      transcription: "Error in response",
    }
  } as AxiosResponse;

  try {
    const response = await fetch(audioUrl);
    const blob = await response.blob();

    // Create a new FormData object and append the file data to it
    const formData = new FormData();
    formData.append("file", blob, "test_file.webm");

    // Send the file as part of a POST request
    try {
      const transcriptionResponse = await transcriptionInstance.post("/transcribe", formData, {});
      console.log("File uploaded successfully:", transcriptionResponse.data);
      result = transcriptionResponse;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }

  return result;
};
