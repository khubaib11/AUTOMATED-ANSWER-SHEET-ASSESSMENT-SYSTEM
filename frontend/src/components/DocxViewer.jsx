import React, { useState, useRef, useEffect } from "react";
import { renderAsync } from "docx-preview";

export default function DocxViewer2() {
  const viewerElement = useRef(null);
  const [preview, setPreview] = useState(false);

  const blobToArrayBuffer = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to convert Blob to ArrayBuffer"));
      reader.readAsArrayBuffer(blob);
    });

  const fetchAndRenderDoc = async () => {
    setPreview(true);
    try {
      const response = await fetch("/api/result/file.docx");
      if (!response.ok) throw new Error("Failed to fetch document");

      const blob = await response.blob();
      const arrayBuffer = await blobToArrayBuffer(blob);

      if (viewerElement.current) {
        await renderAsync(arrayBuffer, viewerElement.current);
      }
    } catch (error) {
      console.error("Error during document rendering:", error);
    }
  };

  useEffect(() => {
    if (preview && viewerElement.current) {
      fetchAndRenderDoc();
    }
  }, [preview]);

  const downloadFile = async () => {
    try {
      const response = await fetch("/api/result/file.docx");
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "result.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during file download:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-gray-50 p-4">
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setPreview(!preview)}
          className="bg-gray-500 hover:bg-gray-900 text-white font-semibold py-1 px-3 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
        >
          { !preview?"View Document":"cancel View" }
        </button>

        <button
          onClick={downloadFile}
          className="bg-gray-500 hover:bg-gray-900 text-white font-semibold py-1 px-3 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
        >
          Download File
        </button>
      </div>
      {preview && (
        <div
          ref={viewerElement}
          className="mt-4 w-full bg-white shadow-md overflow-auto"
          style={{
            maxHeight: '800px', 
            width: '100%',
            overflowX: 'auto', 
            overflowY: 'auto', 
            whiteSpace: 'nowrap'
          }}
        ></div>
      )}
    </div>
  );
}
