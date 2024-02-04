import { useState } from "react";
import { useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { useSession } from "next-auth/react";

const UploadVideoModal = ({ activityId, onClose }) => {
  const [video, setvideo] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const supabaseUrl = "https://bpfzmwxcibqsyzrpgyeg.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZnptd3hjaWJxc3l6cnBneWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUwOTk3ODAsImV4cCI6MTk5MDY3NTc4MH0.OYM4ba2MoGZ4ASEoIOoEtaq-qCIsg_GnZcMUaj-OApA";
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: session, status } = useSession();
  const videoRef = useRef(null);

  const handleFileChange = (event) => {
    setvideo(event.target.files[0]);
  };

  const handleUpload = async () => {
    const videoName = `videos/${activityId}_${session.user.uid}`;
    if (!video) {
      alert("Please select a video file to upload.");
      return;
    }

    // Check if file size exceeds 50MB
    if (video.size > 50 * 1024 * 1024) {
      alert(
        "Maximum file size exceeded. Please upload a file smaller than 50MB."
      );
      setVideo(null);
      return;
    }

    const formData = new FormData();
    formData.append("customVideos", video);
    formData.append("activityId", activityId);

    try {
      // Perform the upload request
      setUploadStatus("Uploading...");
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("upload") // Assuming a 'videos' bucket
        .upload(videoName, video, {
          upsert: true,
        });

      const url = supabase.storage
        .from("upload") // Assuming a 'videos' bucket
        .getPublicUrl(videoName).data.publicUrl;

      await axios.post(`/api/uploadVideo/`, {
        videoId: videoName,
        activityId: activityId,
        sections: session.user.section_handled,
        videoFile: url,
      });

      setUploadStatus("Upload successful!");
      onClose();
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
    // Set the selected video file
    setVideo(selectedFile);
  };

  // Function to handle displaying the video preview
  const handleShowVideo = () => {
    videoRef.current.src = URL.createObjectURL(video);
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50 text-black">
      <div className="rounded-md bg-white p-8">
        <h2 className="mb-4 text-xl font-bold">Upload Video</h2>
        <input type="file" onChange={handleFileChange} accept="video/*" />
        <p className="mt-2 text-sm text-gray-500">
          Please upload MP4 video less than 50MB. <br />
          Other formats or larger sizes require conversion/compression.
        </p>
        <div className="grid w-96  grid-flow-row">
          {" "}
          {video && (
            <button
              onClick={handleShowVideo}
              className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Show Video Preview
            </button>
          )}
          {/* Video preview */}
          {video && (
            <video
              ref={videoRef}
              controls
              className="mt-4"
              style={{ display: "block", maxWidth: "100%" }}
            />
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="mr-4 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Upload
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700"
          >
            Cancel
          </button>
        </div>
        {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default UploadVideoModal;
