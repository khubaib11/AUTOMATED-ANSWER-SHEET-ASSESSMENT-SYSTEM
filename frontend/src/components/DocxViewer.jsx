import React, { useState, useEffect } from 'react';

export default function DocxViewer() {
  const [loading, setLoading] = useState(true); // Starts as true to simulate progress
  const [progress, setProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false); // Controls button visibility

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false);  // Set loading to false when complete
            setDownloadReady(true); // Enable the download button after loading
            return 100;
          }
          return prev + 10;
        });
      }, 500); // Simulating the progress every 500ms
    }
  }, [loading]);

  const downloadFile = async () => {
    setLoading(true);
    setDownloadReady(false); // Hide the button during loading
    try {
      const response = await fetch("api/result/file.docx", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "result.docx"; // Change the filename if needed
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-48 bg-gray-100 p-4">
      {loading ? (
        <div className="flex flex-col text-center w-full mt-4">
          <h1 className="text-xl font-medium title-font text-gray-900">Processing...</h1>
          <div className="relative pt-2 w-3/4 sm:w-1/2 mx-auto">
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
            <p className="text-sm text-gray-700">{progress}% Completed</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600">Ready to Download the Document</p>
        </div>
      )}

      {downloadReady && !loading && (
        <button
          onClick={downloadFile}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 rounded mt-4 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
        >
          Download File
        </button>
      )}
    </div>
  );
}
