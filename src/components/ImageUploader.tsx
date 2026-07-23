import React, { useState, useRef } from "react";
import api from "../api";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  initialUrl?: string;
}

export default function ImageUploader({
  label,
  onUploadSuccess,
  initialUrl,
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(initialUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }

    setError("");
    setIsUploading(true);
    setProgress(10);

    try {
      // 1. Get Pre-signed URL from Go API
      const response = await api.get("/admin/upload/url", {
        params: {
          filename: file.name,
          filetype: file.type,
        },
      });

      const { uploadUrl, downloadUrl } = response.data;
      setProgress(40);

      // 2. Perform direct binary upload to S3 via PUT request
      await api.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
          // Exclude Authorization header since this goes directly to S3
          Authorization: undefined,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 50) / (progressEvent.total || 1),
          );
          setProgress(40 + percentCompleted); // Maps 40% - 90%
        },
      });

      setProgress(100);
      setImageUrl(downloadUrl);
      onUploadSuccess(downloadUrl);
    } catch (err: any) {
      setError("Upload failed. Please verify S3 CORS policies & keys.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2 border border-slate-200/60 p-4 rounded-2xl bg-slate-50/50">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {imageUrl ? (
          <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white">
            <img
              src={imageUrl}
              alt="Uploaded Mockup"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-16 rounded-lg border border-dashed border-slate-300 flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
            <UploadCloud className="w-6 h-6" />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={triggerSelectFile}
              className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading
                ? "Uploading..."
                : imageUrl
                  ? "Replace Image"
                  : "Select Image"}
            </button>

            {imageUrl && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  onUploadSuccess("");
                }}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>

          {isUploading && (
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && (
            <span className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </span>
          )}

          {imageUrl && !isUploading && (
            <span className="text-xs text-green-600 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              S3 Upload Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
