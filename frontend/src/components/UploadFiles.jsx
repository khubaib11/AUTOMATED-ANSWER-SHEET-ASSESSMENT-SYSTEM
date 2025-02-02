import { useState, useEffect } from "react";

export default function UploadFiles({ setEvaluated, setLoading, setShowDoc,setImagesData }) {
  const [isHovered, setIsHovered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileSummary, setFileSummary] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "folder"
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    if (Object.keys(fileSummary).length > 0) {
      // console.log("File Summary:", fileSummary);
      setImagesData(fileSummary);
    }
  }, [fileSummary]);

  const handleFileProcessing = async (files) => {
    const validTypes = ["image/png", "image/jpeg"];
    const organizedData = {}; // To store files categorized by folders
    let isValid = true; // To ensure all files are of valid types
    const papers = []; // Array to store structured data for MongoDB
  
    // Step 1: Organize files by folder structure
    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        isValid = false;
        return;
      }
  
      // Extract the relative path (e.g., folder/subfolder/file.png)
      const pathParts = file.webkitRelativePath?.split("/") || [];
      let key;
  
      if (pathParts.length === 1) {
        // Single image upload (no folder structure)
        key = "Ungrouped";
      } else if (pathParts.length === 2) {
        // Single folder of images
        key = pathParts[0];
      } else {
        // Folder of folders (nested structure)
        key = pathParts.slice(0, -1).join("/");
      }
  
      // Organize files by folder key
      if (!organizedData[key]) {
        organizedData[key] = [];
      }
      organizedData[key].push(file);
    });
  
    if (!isValid) {
      setErrorMessage("Invalid file types. Only PNG, JPEG are allowed.");
      setEvaluated(false);
      return;
    }
  
    // Step 2: Convert organized data into MongoDB schema format
    for (const [folderName, images] of Object.entries(organizedData)) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const reader = new FileReader();
  
        // Wrap FileReader in a Promise
        const bufferPromise = new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result); // Convert to Buffer
          };
          reader.onerror = () => {
            reject("Error reading file");
          };
          reader.readAsArrayBuffer(image);
        });
  
        const buffer = await bufferPromise;
        //split folder name to get student name
        const studentName = folderName.split("/").pop();
  
        papers.push({
          studentName: studentName, // Use folder name as studentName
          questionNo: i + 1, // Sequential question number starting from 1
          result: "", // Empty result field
          submittedAnswerImage: buffer, // Image as binary Buffer
        });
      }
    }
  
    setErrorMessage("");
    setFileSummary(papers); // Set data for backend upload
    setEvaluated(true);
    setLoading(false);
    setShowDoc(false);
  };
  
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      setErrorMessage("No files selected. Please upload valid files.");
      setEvaluated(false);
      return;
    }
    setFileSize(files.length);
    handleFileProcessing(files);
    e.target.value = ""; // Reset file input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length === 0) {
      setErrorMessage("No files selected. Please upload valid files.");
      setEvaluated(false);
      return;
    }
    setFileSize(files.length);
    handleFileProcessing(files);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Toggle Buttons for File/Folder */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 text-white ${
            uploadMode === "file" ? "bg-gray-500" : "bg-gray-800"
          } rounded hover:bg-gray-600`}
          onClick={() => setUploadMode("file")}
        >
          Upload Files
        </button>
        <button
          className={`px-4 py-2 text-white ${
            uploadMode === "folder" ? "bg-gray-500" : "bg-gray-800"
          } rounded hover:bg-gray-600`}
          onClick={() => setUploadMode("folder")}
        >
          Upload Folders
        </button>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`flex w-full items-center justify-center ${
          dragActive ? "bg-gray-200 dark:bg-gray-800" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative flex h-48 w-3/4 max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="flex flex-col items-center justify-center pb-4 pt-4">
              <svg
                className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              {Object.keys(fileSummary).length > 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                 {fileSize}:  File uploaded successfully!
                </p>
              ) : (
                <>
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {uploadMode === "file"
                      ? "Individual files ( PNG, JPEG)"
                      : "Folders containing files"}
                  </p>
                </>
              )}
            </div>
            {uploadMode === "file" ? (
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple  
                onChange={handleFileUpload}
              />
            ) : (
              <input
                id="folder-upload"
                type="file"
                className="hidden"
                multiple
                webkitdirectory=""
                onChange={handleFileUpload}
              />
            )}
          </label>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}
          <div
            className="absolute top-2 right-2 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6 text-gray-500 dark:text-gray-400"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17h.01M12 12v.01M12 7h.01M10 21.22a10 10 0 1 1 4.99-.01M12 3v1"
              />{" "}
            </svg>{" "}
            {isHovered && (
              <div className="absolute top-8 right-0 z-50 w-64 max-w-sm p-4 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                {" "}
                <p className="mb-2 font-bold">Upload Rules:</p>{" "}
                <ul className="list-disc pl-4">
                  {" "}
                  <li>Allowed file types: PNG, JPEG</li>{" "}
                  <li>Upload a single folder (e.g., paper).</li>{" "}
                  <li>
                    {" "}
                    Inside the paper folder, create a subfolder for each
                    student. Name each subfolder according to the student (e.g.,
                    student1, student2, etc.).{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    Inside each student's folder, include the images related to
                    that student.{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    Each image should contain only one question and its
                    corresponding answer. Ensure images are clear and readable.{" "}
                  </li>{" "}
                </ul>{" "}
              </div>
            )}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
