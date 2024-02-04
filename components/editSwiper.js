import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const EditSwiperModal = ({ activityId, onClose }) => {
  const [swipers, setSwipers] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [changesSaved, setChangesSaved] = useState(false);
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

  useEffect(() => {
    const fetchSwipers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/editSwiper/?sectionId=${selectedSectionId}&activityId=${activityId}`
        );
        setSwipers(response.data);
      } catch (error) {
        console.error("Error fetching swipers:", error);
      }
      setLoading(false);
    };

    if (selectedSectionId) {
      fetchSwipers();
    }
  }, [activityId, selectedSectionId]);

  const handleInputChange = (index, field, value) => {
    const updatedSwipers = [...swipers];
    updatedSwipers[index][field] = value;
    setSwipers(updatedSwipers);
  };

  const addSwiper = () => {
    setSwipers([
      ...swipers,
      {
        correct_option: "",
        option_one: "",
        option_two: "",
        imageUrl: "",
        description: "",
        topic_name: "",
        section: "",
      },
    ]);
  };

  const removeSwiper = (index) => {
    if (window.confirm("Are you sure you want to remove this swiper?")) {
      const updatedSwipers = [...swipers];
      updatedSwipers.splice(index, 1);
      setSwipers(updatedSwipers);
    }
  };

  const handleSave = () => {
    // Check if any field is empty
    const isEmpty = questions.some((question) =>
      Object.values(question).some((value) => value === "")
    );

    if (isEmpty) {
      // Set save status to error
      setSaveStatus("error");
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
    }

    // If no empty fields, proceed to save
    setShowSaveModal(true);
  };
  const handleApplyChanges = async () => {
    try {
      for (const sectionId of selectedSections) {
        await axios.post(`/api/editSwiper/`, {
          swipers,
          sectionId,
          activityId,
        });
      }
      setChangesSaved(true);
      setShowSaveModal(false);
    } catch (error) {
      console.error("Error saving swipers:", error);
    }
  };

  const handleModalClose = () => {
    setShowSaveModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="w-4/5 rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">
          Edit Swipers for Activity: {activityId}
        </h2>
        <div className="flex gap-2">
          <h1 className="mt-1 text-lg font-bold">View Swipers for:</h1>{" "}
          <select
            value={selectedSectionId || ""}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="mb-4 p-2"
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.sectionId}>
                {section.sectionId}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : swipers.length === 0 ? (
          <p className="text-center">
            No customized swipers found. Add swipers to replace the default
            swipers for this activity.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <p className="mt-1 mb-1 text-xs text-gray-500">
              <span>For the Image URL, please follow these steps: </span>.
              <br />
              <span>Note: </span> You do not have to create an account to
              upload.
              <br />
              <span>Step 1: </span> Click this link:{" "}
              <a
                href="https://postimages.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Postimages
              </a>
              .<br />
              <span>Step 2: </span> Click choose images and upload your photo.
              <br />
              <span>Step 3: </span> Copy the direct link of the uploaded photo
              and paste under image url.
              <br />
            </p>
            <table className="border border-gray-300 bg-white">
              <thead>
                <tr>
                  <th className="border-b py-2 px-4">Option 1</th>
                  <th className="border-b py-2 px-4">Option 2</th>
                  <th className="border-b py-2 px-4">Image URL</th>
                  <th className="border-b py-2 px-4">Description</th>
                  <th className="border-b py-2 px-4">Topic Name</th>
                  <th className="border-b py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {swipers.map((swiper, index) => (
                  <tr key={index}>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={swiper.option_one}
                        onChange={(e) =>
                          handleInputChange(index, "option_one", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={swiper.option_two}
                        onChange={(e) =>
                          handleInputChange(index, "option_two", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={swiper.imageUrl}
                        onChange={(e) =>
                          handleInputChange(index, "imageUrl", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={swiper.description}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={swiper.topic_name}
                        onChange={(e) =>
                          handleInputChange(index, "topic_name", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <button
                        onClick={() => removeSwiper(index)}
                        className="rounded bg-red-500 p-2 font-bold text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex w-full justify-between">
          <div>
            <button
              onClick={addSwiper}
              className="mr-2 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            >
              Add Swiper
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="ml-2 rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>

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
                  onClick={handleApplyChanges}
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

export default EditSwiperModal;
