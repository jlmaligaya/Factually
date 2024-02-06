import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const EditMCQModal = ({ activityId, onClose }) => {
  const [questions, setQuestions] = useState([]);
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
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/editMCQ/?sectionId=${selectedSectionId}&activityId=${activityId}`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
      setLoading(false);
    };

    if (selectedSectionId) {
      fetchQuestions();
      console.log(sections);
    }
  }, [activityId, selectedSectionId]);

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    // Also update the section ID
    updatedQuestions[index]["sectionId"] = selectedSectionId;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    // Add a new question row to the table
    setQuestions([
      ...questions,
      {
        quiz_question: "",
        option_one: "",
        option_two: "",
        option_three: "",
        option_four: "",
        correct_option: "",
        topic_name: "", // Add an empty topic name for the new question
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
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
    }

    // If no empty fields, proceed to save
    setShowSaveModal(true);
  };

  const handleApplyChanges = async () => {
    try {
      // Make API call to save questions for each selected section
      for (const sectionId of selectedSections) {
        await axios.post(`/api/editMCQ/`, {
          questions,
          sectionId,
          activityId,
        });
      }
      setChangesSaved(true);
      setShowSaveModal(false);
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  const handleModalClose = () => {
    setShowSaveModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="w-4/5 rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">
          Edit Multiple-Choice Questions for {activityId}
        </h2>
        {/* Dropdown for selecting section */}
        <div className="flex gap-2">
          <h1 className="mt-1 text-lg font-bold">View Questions for:</h1>{" "}
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
            {/* Add new section option */}
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-center">
            No customized questions found. Add questions to replace the default
            questionnaire for this activity.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <table className=" border border-gray-300 bg-white ">
              <thead>
                <tr>
                  <th className="border-b py-2 px-4">Question</th>
                  <th className="border-b py-2 px-4">Option 1</th>
                  <th className="border-b py-2 px-4">Option 2</th>
                  <th className="border-b py-2 px-4">Option 3</th>
                  <th className="border-b py-2 px-4">Option 4</th>
                  <th className="border-b py-2 px-4">Correct Option</th>
                  <th className="border-b py-2 px-4">Topic Name</th>
                  <th className="border-b py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index}>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.quiz_question}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "quiz_question",
                            e.target.value
                          )
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.option_one}
                        onChange={(e) =>
                          handleInputChange(index, "option_one", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.option_two}
                        onChange={(e) =>
                          handleInputChange(index, "option_two", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.option_three}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "option_three",
                            e.target.value
                          )
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.option_four}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "option_four",
                            e.target.value
                          )
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.correct_option}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "correct_option",
                            e.target.value
                          )
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <input
                        type="text"
                        value={question.topic_name}
                        onChange={(e) =>
                          handleInputChange(index, "topic_name", e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    <td className="border-b py-2 px-4">
                      <button
                        onClick={() => removeQuestion(index)} // Bind removeQuestion function
                        className="rounded bg-red-500 p-4 font-bold text-white hover:bg-red-600"
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
              onClick={addQuestion}
              className="mr-2 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>

          <div className="flex gap-2">
            {" "}
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

export default EditMCQModal;