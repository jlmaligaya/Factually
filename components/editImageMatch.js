import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const EditImageMatchModal = ({ onClose, activityId }) => {
  const [tableData, setTableData] = useState([
    { title: "", image1: "", image2: "", image3: "" },
    { title: "", image1: "", image2: "", image3: "" },
    { title: "", image1: "", image2: "", image3: "" },
  ]);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get("/api/sections");
        setSections(response.data);
        // Set the default selected section ID if available
        if (response.data.length > 0) {
          setSelectedSectionId(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  };

  const handleSave = () => {
    // Check if any field is empty
    const isEmpty = tableData.some((question) =>
      Object.values(question).some((value) => value === "")
    );

    if (isEmpty) {
      // Set save status to error
      setSaveStatus("error");
      alert("Please do not leave empty fields.");
      // Highlight empty fields in red
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        if (input.value === "") {
          input.classList.add("border-red-500");
        } else {
          input.classList.remove("border-red-500");
        }
      });
      return; // Exit early if there are empty fields
    } else {
      setSaveStatus();
    }

    // If no empty fields, proceed to save
    setShowSaveModal(true);
  };

  const handleModalClose = () => {
    setShowSaveModal(false);
  };

  const handleSubmit = async () => {
    try {
      const firstTopic = tableData[0];
      const secondTopic = tableData[1];
      const thirdTopic = tableData[2];

      const formattedData = tableData.map((row) => ({
        title: row.title,
        activityId: activityId,
        topic_name: row.title,
        images: [
          [firstTopic.image1, firstTopic.title, row.title],
          [firstTopic.image2, firstTopic.title, row.title],
          [firstTopic.image3, firstTopic.title, row.title],
          [secondTopic.image1, secondTopic.title, row.title],
          [secondTopic.image2, secondTopic.title, row.title],
          [secondTopic.image3, secondTopic.title, row.title],
          [thirdTopic.image1, thirdTopic.title, row.title],
          [thirdTopic.image2, thirdTopic.title, row.title],
          [thirdTopic.image3, thirdTopic.title, row.title],
        ],
      }));

      for (const sectionId of selectedSections) {
        await axios.post("/api/editImageMatch", {
          formattedData,
          sectionId,
          activityId,
        });
      }
      console.log("Submitting data:", formattedData);
      // Close the modal after submission
      onClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="rounded-lg bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Edit Image Match</h2>
        {/* Dropdown for selecting section */}
        <div className="flex gap-2">
          <h1 className="mt-1 text-lg font-bold">View Questions for:</h1>{" "}
          <select
            value={selectedSectionId || ""}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="mb-4 rounded-md border p-2"
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.sectionId}>
                {section.sectionId}
              </option>
            ))}
            {/* Add new section option */}
          </select>
        </div>
        <table className="border border-gray-300 bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Image 1</th>
              <th className="px-4 py-2">Image 2</th>
              <th className="px-4 py-2">Image 3</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="border-b py-2 px-4">
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="border-b py-2 px-4">
                  <input
                    type="text"
                    value={row.image1}
                    onChange={(e) =>
                      handleChange(index, "image1", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="border-b py-2 px-4">
                  <input
                    type="text"
                    value={row.image2}
                    onChange={(e) =>
                      handleChange(index, "image2", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="border-b py-2 px-4">
                  <input
                    type="text"
                    value={row.image3}
                    onChange={(e) =>
                      handleChange(index, "image3", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
          >
            Submit
          </button>
        </div>
        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
            <div className="rounded-md bg-white p-8 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Save changes to:</h2>
              <Select
                options={sections.map((section) => ({
                  value: section.sectionId,
                  label: section.sectionId,
                }))}
                onChange={(selectedOptions) =>
                  setSelectedSections(
                    selectedOptions.map((option) => option.value)
                  )
                }
                defaultValue={selectedSectionId}
                closeMenuOnSelect={false}
                className="mb-4"
                isSearchable
                isMulti
                placeholder="Select Sections to Apply Changes"
              />
              <div className="mt-4 flex justify-end">
                {saveStatus === "success" && (
                  <p className="mr-4 text-green-600">
                    Changes saved successfully!
                  </p>
                )}
                {saveStatus === "error" && (
                  <p className="mr-4 text-red-600">
                    Failed to save changes. Please try again.
                  </p>
                )}

                <button
                  onClick={handleModalClose}
                  className="mr-2 rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditImageMatchModal;
