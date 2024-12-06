import { useState } from "react";

export default function UploadFiles({ setEvaluated,setLoading,setShowDoc }) {
  const [isHovered, setIsHovered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      setErrorMessage("No files selected. Please upload valid files.");
      setEvaluated(false);
      return;
    }

    // Validate file types
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    const isValid = Array.from(files).every((file) => validTypes.includes(file.type));

    if (!isValid) {
      setErrorMessage("Invalid file types. Only PNG, JPEG, and SVG are allowed.");
      setEvaluated(false);
      return;
    }

    setErrorMessage(""); // Clear error if all validations pass
    setEvaluated(true); // Set evaluation state
    setLoading(false); // Set loading state
    setShowDoc(false); // Hide document viewer
    e.target.value = ""; // Reset file input for re-upload
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative flex h-48 w-3/4 max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <label
          htmlFor="folder-upload"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
        >
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
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Folders or individual files (SVG, PNG, JPEG)
            </p>
          </div>
          <input
            id="folder-upload"
            type="file"
            className="hidden"
            multiple
            webkitdirectory=""
            onChange={handleFileUpload}
          />
        </label>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
        )}

        <div
          className="absolute top-2 right-2 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6 text-gray-500 dark:text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17h.01M12 12v.01M12 7h.01M10 21.22a10 10 0 1 1 4.99-.01M12 3v1"
            />
          </svg>

          {isHovered && (
            <div className="absolute top-8 right-0 z-50 w-64 max-w-sm p-4 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              <p className="mb-2 font-bold">Upload Rules:</p>
              <ul className="list-disc pl-4">
                <li>Allowed file types: SVG, PNG, JPEG</li>
                <li>Upload a single folder (e.g., paper).</li>
                <li>
                  Inside the paper folder, create a subfolder for each student.
                  Name each subfolder according to the student (e.g., student1, student2, etc.).
                </li>
                <li>
                  Inside each student's folder, include the images related to
                  that student.
                </li>
                <li>
                  Each image should contain only one question and its
                  corresponding answer. Ensure images are clear and readable.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
