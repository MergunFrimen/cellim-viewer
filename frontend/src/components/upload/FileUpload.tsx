import { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(undefined);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setSuccess(false);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Example FastAPI endpoint
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      setSuccess(true);
      // Optionally handle the successful response
      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (err) {
      setError(err.message || "There was an error uploading your file");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError("");
    setSuccess(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
          ${file ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
          transition-colors duration-200 cursor-pointer`}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        {!file ? (
          <>
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="mb-1 text-lg font-medium">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX, JPG, PNG
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={uploadFile}
          disabled={!file || uploading || success}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            File uploaded successfully!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
