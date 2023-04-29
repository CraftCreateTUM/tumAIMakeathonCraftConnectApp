// import React, { useRef, useState } from "react";
// import { IconButton } from "@chakra-ui/react";
// import { FaCamera } from "react-icons/fa";

// type CameraComponentProps = {
//   onCapture: () => void;
// };

// export const CameraComponent = ({ onCapture }: CameraComponentProps) => {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const [isCameraOpen, setIsCameraOpen] = useState(false);

//   const openCamera = async () => {
//     setIsCameraOpen(true);
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     videoRef.current.srcObject = stream;
//     videoRef.current.play();
//   };

//   const captureImage = () => {
//     const context = canvasRef.current.getContext("2d");
//     context.drawImage(videoRef.current, 0, 0, 640, 480);
//     const image = canvasRef.current.toDataURL("image/png");
//     onCapture(image);
//     videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//     setIsCameraOpen(false);
//   };

//   return (
//     <>
//       <IconButton
//         aria-label="Open chat"
//         icon={<FaCamera />}
//         onClick={() => {
//           if (!isCameraOpen) {
//             openCamera();
//           } else {
//             captureImage();
//           }
//         }}
//       />
//       {isCameraOpen && (
//         <>
//           <video ref={videoRef} width="640" height="480" />
//           <canvas
//             ref={canvasRef}
//             width="640"
//             height="480"
//             style={{ display: "none" }}
//           />
//         </>
//       )}
//     </>
//   );
// };

// export default CameraComponent;
