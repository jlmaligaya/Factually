import Layout from "../../components/InstructorLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [sectionId, setSectionId] = useState(null);
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("username");
  const { data: session, status } = useSession();
  const uid = session?.user.uid;
  const section_handled = session?.user.section_handled;
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    // Customize this logic based on your search requirements
    if (searchColumn === "username") {
      return user.username.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "firstName") {
      return user.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "lastName") {
      return user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "email") {
      return user.email.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "section") {
      return user.section.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get(`/api/sections?userId=${uid}`);
        setSections(sectionsResponse.data);

        // Pass section_handled as a query parameter to the GET request
        const usersResponse = await axios.get(
          `/api/students?sections=${JSON.stringify(section_handled)}`
        );

        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };

    console.log("Section handled: ", section_handled);
    fetchData();
  }, [uploading]);

  // Function to handle adding a new section
  const handleAddNewSection = async () => {
    try {
      const response = await axios.post(`/api/sections`, {
        sectionId: newSectionName,
      });
      const newSection = response.data;
      setSections([...sections, newSection]);
      setSectionId(newSection.sectionId); // Set the newly added section as selected
      setNewSectionName(""); // Clear the new section name input
    } catch (error) {
      console.error("Error adding new section:", error);
      alert("Failed to add new section. Please try again.");
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["First Name", "Last Name", "Email"];
    const data = [headers];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "SectionName.xlsx");
  };
  const handleUploadFile = async (file) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Check if the headers are correct
        const headers = jsonData[0];
        const expectedHeaders = ["First Name", "Last Name", "Email"];
        if (
          headers.length !== expectedHeaders.length ||
          !expectedHeaders.every((header, index) => header === headers[index])
        ) {
          alert(
            "Invalid file format. Please upload a file with headers: 'First Name', 'Last Name', 'Email'."
          );
          return;
        }

        // Extract sectionId from the file name
        const fileNameWithoutExtension = file.name.split(".")[0];
        const sectionId = fileNameWithoutExtension.trim(); // Assuming the sectionId is directly based on the file name

        // Set the parsed data and sectionId
        setParsedData(jsonData);
        setSectionId(sectionId);
        setShowModal(true);
        setUploading(false);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Show error prompt
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleSaveData = async () => {
    console.log("Section selected: ", sectionId);
    setUploading(true);
    try {
      // Make an API call to save the parsed data to the database
      const response = await axios.post("/api/users/saveStudents", {
        data: parsedData.slice(1),
        sectionId: sectionId,
        uid: uid, // Include the sectionId in the request payload
      });
      console.log("Data saved successfully:", response.data);
      // Clear the parsed data after saving
      setParsedData([]);
      // Fetch the updated data after saving
      const updatedResponse = await axios.get(
        `/api/students?sectionId=${sectionId}`
      );
      setShowModal(false);
      setUploading(false);
      setUsers(updatedResponse.data); // Update the users state with the new data
    } catch (error) {
      console.error("Error saving data:", error);
      setUploading(false);
      setShowModal(false);
      console.error("Failed to save data. Please try again.");
    }
  };

  const handleRemoveUser = async (userId, uid) => {
    // Show a confirmation dialog before removing the user
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await axios.delete(`/api/users/removeUser?userId=${userId}&uid=${uid}`);
        console.log(`User with ID ${userId} removed`);
        // Remove the user from the local state
        setUsers(users.filter((user) => user.id !== userId));
        // Show success prompt
        alert("User removed successfully!");
      } catch (error) {
        console.error("Failed to remove user:", error);
        // Show error prompt
        alert("Failed to remove user. Please try again.");
      }
    }
  };

  const handleResetPassword = async (userId, uid) => {
    // Show a confirmation dialog before resetting the password
    if (
      window.confirm("Are you sure you want to reset this user's password?")
    ) {
      try {
        await axios.post(`/api/users/resetPassword`, { userId, uid });
        console.log(`Password reset for user with ID ${userId}`);
        // Show success prompt
        alert("Password reset successfully!");
      } catch (error) {
        console.error("Failed to reset password:", error);
        // Show error prompt
        alert("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <div className="mt-24 h-4/5 w-full bg-gray-300 shadow-md">
        <div className="w-full">
          <h1 className="mt-10 p-4 text-center text-xl font-extrabold uppercase text-gray-700 2xl:text-3xl">
            Manage Students
          </h1>
        </div>
        <div className="container mx-auto flex  flex-col  text-black">
          <div className="my-8 flex w-full flex-row items-center justify-between font-bold  2xl:w-4/5">
            <div>
              <button
                onClick={() => setShowModal(true)}
                className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              >
                Upload students data
              </button>
            </div>
            <div className="flex gap-2">
              <div>
                <input
                  type="text"
                  id="search"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="ml-2 rounded-md border border-gray-300 p-2 font-thin"
                />
              </div>
              <div className="overflow-x-auto">
                <select
                  id="column"
                  value={searchColumn}
                  onChange={handleColumnChange}
                  className="rounded-md border border-gray-300 p-2"
                >
                  <option value="username">Username</option>
                  <option value="firstName">First Name</option>
                  <option value="lastName">Last Name</option>
                  <option value="email">Email</option>
                  <option value="section">Section</option>
                </select>
              </div>
            </div>
          </div>
          <div className="h-4/5 w-full 2xl:w-4/5">
            {/* Search input and dropdown */}
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                Loading...
              </div>
            ) : users.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {" "}
                <table className="w-full table-auto border border-gray-300 bg-white shadow-md">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="border-b py-2 px-4">User Id</th>
                      <th className="border-b py-2 px-4">Username</th>
                      <th className="border-b py-2 px-4">First Name</th>
                      <th className="border-b py-2 px-4">Last Name</th>
                      <th className="border-b py-2 px-4">Email</th>
                      <th className="border-b py-2 px-4">Section</th>
                      <th className="border-b py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="border-b py-2 px-4">{user.uid}</td>
                        <td className="border-b py-2 px-4">{user.username}</td>
                        <td className="border-b py-2 px-4">{user.firstName}</td>
                        <td className="border-b py-2 px-4">{user.lastName}</td>
                        <td className="border-b py-2 px-4">{user.email}</td>
                        <td className="border-b py-2 px-4">{user.section}</td>
                        <td className=" flex border-b py-2 px-4 text-sm ">
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className=" mr-2 rounded-3xl bg-blue-600 p-2 font-semibold uppercase text-white hover:bg-blue-700 hover:text-slate-200"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleRemoveUser(user.id, user.uid)}
                            className="rounded-3xl bg-red-600 p-2 font-semibold uppercase text-white hover:bg-red-700 hover:text-slate-200"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-center">No students yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for downloading/uploading Excel file */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="rounded-md bg-white p-8 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">
              Download/Upload Template File
            </h2>
            <div className="mb-4 flex flex-col gap-4">
              <h1>
                1. Download and fill the Template with Students&apos; Data
              </h1>
              <button
                onClick={handleDownloadTemplate}
                className="mr-2 bg-blue-500 p-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                Download Template
              </button>
              {/* <h1>2. Select the section for Students</h1>
              <select
                value={sectionId || ""}
                onChange={(e) => setSectionId(e.target.value)}
                className="p-2"
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.sectionId}>
                    {section.sectionId}
                  </option>
                ))}

              </select> */}
              {/* Modal for adding new section */}
              {/* {sectionId === "add_new_section" && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="New Section Name"
                    className="mr-2 rounded-md border border-gray-300 p-2"
                  />
                  <button
                    onClick={handleAddNewSection}
                    className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Add New Section
                  </button>
                </div>
              )} */}
              <h1>
                2. Rename the file with the section name and upload the filled
                template with students&apos; data
              </h1>
              <input
                type="file"
                onChange={(e) => handleUploadFile(e.target.files[0])}
                accept=".xlsx,.xls,.csv"
                className=" p-2"
              />
            </div>

            {/* Table to display parsed data */}
            {parsedData.length > 0 && (
              <div className="max-h-60 w-full overflow-y-auto">
                <table className="min-w-full border border-gray-300 bg-white">
                  <thead>
                    <tr>
                      {parsedData[0].map((header, index) => (
                        <th key={index} className="border-b py-2 px-4">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border-b py-2 px-4">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false), setParsedData([]);
                }}
                className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveData}
                className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
              >
                {uploading ? "Saving..." : "Upload students data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UsersPage;
