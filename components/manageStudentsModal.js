// pages/instructor/users.js
import Layout from "./InstructorLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { sectionId } = router.query; // You may want to get the sectionId dynamically

  useEffect(() => {
    const fetchData = async () => {
      if (sectionId) {
        const response = await axios.get(
          `/api/students?sectionId=${sectionId}`
        );
        setUsers(response.data);
      }
    };
    fetchData();
  }, [sectionId]);

  const handleDownloadTemplate = () => {
    // Implement logic to download the template Excel file
    console.log("Downloading template Excel file");
  };

  const handleUploadFile = async (file) => {
    // Implement logic to upload the file and save data to the database
    console.log("Uploading file:", file);
  };

  const handleSaveData = () => {
    // Implement logic to save the uploaded data to the database
    console.log("Saving data to the database");
  };

  return (
    <Layout>
      <div className="w-full">
        <h1 className="mt-10 text-center text-3xl font-bold text-black">
          Students in Section {sectionId}
        </h1>
        <div className="my-4 mr-8 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Upload Excel File
          </button>
        </div>
      </div>
      <div className="container mx-auto flex flex-col py-8 text-black">
        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="min-w-full border border-gray-300 bg-white">
              {/* Table header */}
              {/* Table body */}
            </table>
          ) : (
            <p className="mt-4 text-center">No students yet</p>
          )}
        </div>
      </div>

      {/* Modal for downloading/uploading Excel file */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-8 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">
              Download/Upload Excel File
            </h2>
            <div className="mb-4 flex justify-between">
              <button
                onClick={handleDownloadTemplate}
                className="mr-2 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              >
                Download Template
              </button>
              <input
                type="file"
                onChange={(e) => handleUploadFile(e.target.files[0])}
                accept=".xlsx,.xls"
                className="p-2"
              />
            </div>
            {/* Table to confirm uploaded data */}
            <button
              onClick={handleSaveData}
              className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
            >
              Save Data
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UsersPage;
