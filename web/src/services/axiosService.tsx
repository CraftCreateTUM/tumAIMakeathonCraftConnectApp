import axios from "axios";

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