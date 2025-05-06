import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

// Import the required CSS
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/progress-bar/dist/style.min.css";

export const ResumableUploader = () => {
  const [uppy, setUppy] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Initialize Uppy when component mounts
    const uppyInstance = new Uppy({
      id: "resumable-uploader",
      autoProceed: false, // Don't start uploading automatically
      allowMultipleUploadBatches: true,
      debug: true,
      restrictions: {
        maxFileSize: 1000 * 1024 * 1024, // 1GB
        maxNumberOfFiles: 10,
      },
    });

    // Add Tus plugin for resumable uploads
    uppyInstance.use(Tus, {
      endpoint: "http://localhost:8000/uploads/",
      retryDelays: [0, 1000, 3000, 5000], // Retry delays in ms
      chunkSize: 5 * 1024 * 1024, // 5MB chunks
      removeFingerprintOnSuccess: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest", // Add this header to identify AJAX requests
      },
      // By setting this to true, TUS client will use a custom header instead of relying on the Location response header
      overridePatchMethod: true, // This helps with CORS issues related to PATCH requests
    });

    // Add event listeners
    uppyInstance.on("upload-success", (file, response) => {
      console.log("File uploaded successfully:", file.name);
      console.log("Server response:", response);

      // Update the list of uploaded files
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
          url: response.uploadURL,
        },
      ]);
    });

    uppyInstance.on("upload-error", (file, error, response) => {
      console.error("Upload error:", error);
      console.error("Response:", response);
    });

    // Set uppy instance to state
    setUppy(uppyInstance);

    // Cleanup function to close Uppy instance when component unmounts
  }, []);

  return (
    <div>
      <h2 className="text-3xl">File Uploader</h2>

      {uppy && (
        <Dashboard
          uppy={uppy}
          plugins={["Webcam"]}
          width="100%"
          height={350}
          showProgressDetails={true}
        />
      )}
    </div>
  );
};
