// // import React, { useState } from "react";
// // import CanvasArea from "./components/CanvasArea";
// // import ImageDisplay from "./components/ImageDisplay";
// // import "./App.css";

// // const App = () => {
// //   const [image, setImage] = useState(null);
// //   const [maskImage, setMaskImage] = useState(null);
// //   const [brushDiameter, setBrushDiameter] = useState(10); // Default diameter

// //   const handleImageUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
// //       const reader = new FileReader();
// //       reader.onload = () => setImage(reader.result);
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleMaskExport = (maskDataUrl) => {
// //     setMaskImage(maskDataUrl);
// //   };

// //   return (
// //     <div className="app-container">
// //       <h1>Image Mask Drawing Tool</h1>
// //       <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
// //       {image && (
// //         <CanvasArea image={image} onExportMask={handleMaskExport} />
// //       )}
// //       {image && maskImage && (
// //         <ImageDisplay original={image} mask={maskImage} />
// //       )}
// //     </div>
// //   );
// // };

// // export default App;

// import React, { useState } from "react";
// import CanvasArea from "./components/CanvasArea";
// import ImageDisplay from "./components/ImageDisplay";
// import axios from "axios";
// import "./App.css";

// const App = () => {
//   const [image, setImage] = useState(null);
//   const [maskImage, setMaskImage] = useState(null);
//   const [uploadedData, setUploadedData] = useState(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
//       const reader = new FileReader();
//       reader.onload = () => setImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleMaskExport = async (maskDataUrl) => {
//     setMaskImage(maskDataUrl);

//     const formData = new FormData();
//     formData.append("original", dataURLtoBlob(image));
//     formData.append("mask", dataURLtoBlob(maskDataUrl));

//     try {
//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setUploadedData(response.data.data);
//     } catch (error) {
//       console.error("Error uploading images:", error);
//     }
//   };

//   const dataURLtoBlob = (dataURL) => {
//     const byteString = atob(dataURL.split(",")[1]);
//     const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   };

//   return (
//     <div className="app-container">
//       <h1>Image Mask Drawing Tool</h1>
//       <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
//       {image && <CanvasArea image={image} onExportMask={handleMaskExport} />}
//       {uploadedData && (
//         <ImageDisplay
//           original={uploadedData.originalImageUrl}
//           mask={uploadedData.maskImageUrl}
//         />
//       )}
//     </div>
//   );
// };

// export default App;
import React, { useState } from "react";
import CanvasArea from "./components/CanvasArea";
import ImageDisplay from "./components/ImageDisplay";
import axios from "axios";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [brushSize, setBrushSize] = useState(5); // Default brush size

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle mask export and send data to backend
  const handleMaskExport = async (maskDataUrl) => {
    setMaskImage(maskDataUrl);

    const formData = new FormData();
    formData.append("original", dataURLtoBlob(image));
    formData.append("mask", dataURLtoBlob(maskDataUrl));

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadedData(response.data.data);
      localStorage.setItem("url",response.data.data.maskImageUrl);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // Convert Data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="app-container bg-gray-200 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        Image Mask Drawing Tool
      </h1>

      {/* Image Upload Section */}
      <div className="upload-section mb-6">
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
          className="border border-gray-300 p-2 rounded-md text-lg"
        />
      </div>
      <div className="brush-size-slider flex items-center gap-4 mb-4">
        <label htmlFor="brush-size" className="text-lg font-medium">
          Brush Size:
        </label>
        <input
          id="brush-size"
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="slider w-40"
        />
        <span className="text-lg">{brushSize}px</span>
      </div>

      {/* Canvas Area for Drawing */}
      {image && (
        <div className="w-full flex justify-center mb-6">
          <CanvasArea
            brushSize={brushSize}
            image={image}
            onExportMask={handleMaskExport}
          />
        </div>
      )}

      {/* Display the uploaded and processed images */}
      {uploadedData && (
        <div className="image-display flex flex-col items-center mt-6">
          <ImageDisplay
            original={uploadedData.originalImageUrl}
            mask={uploadedData.maskImageUrl}
          />
        </div>
      )}
    </div>
  );
};

export default App;
