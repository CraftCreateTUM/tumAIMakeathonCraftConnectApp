import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
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
}

export const getDescriptionSentence = (summary: string) => {
  return axiosInstance.post("/description_sentence", {
    message: summary,
  });
}


