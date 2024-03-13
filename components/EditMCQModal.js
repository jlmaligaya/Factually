import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";

const EditMCQModal = ({ activityId, activityName, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSections, setSelectedSections] = useState([]);
  const [changesSaved, setChangesSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { data: session, status } = useSession();
  const [editIndices, setEditIndices] = useState([]); // State to track which questions are in edit mode
  const [isEditing, setIsEditing] = useState(false); // State to track editing
  console.log("Activity name in modal: ", activityName);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(
          `/api/sections?userId=${session.user?.uid}`
        );
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
      setChangesSaved(true);
    };

    if (selectedSectionId) {
      setEditIndices([]);
      fetchQuestions();
    }
  }, [activityId, selectedSectionId]);

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    // Also update the section ID
    updatedQuestions[index]["sectionId"] = selectedSectionId;
    setQuestions(updatedQuestions);
    setUnsavedChanges(true);
  };

  const toggleEdit = (index) => {
    if (editIndices.includes(index)) {
      setEditIndices(editIndices.filter((i) => i !== index));
    } else {
      setEditIndices([...editIndices, index]);
    }
    setChangesSaved(false);
  };

  const addQuestion = () => {
    // Add a new question row to the table
    setEditIndices([...editIndices, questions.length]);
    setIsEditing(true);
    setQuestions([
      ...questions,
      {
        quiz_question: "",
        option_one: "",
        option_two: "",
        option_three: "",
        option_four: "",
        correct_option: "",
        topic_name: "",
      },
    ]);
    setUnsavedChanges(true);
  };

  const removeQuestion = (index) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      setUnsavedChanges(true);
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
      const inputs = document.querySelectorAll("textarea");
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
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  const handleModalClose = () => {
    setShowSaveModal(false);
  };

  const handleSectionChange = (e) => {
    if (unsavedChanges) {
      const confirmChange = window.confirm(
        "There are unsaved changes. Do you want to continue?"
      );
      if (!confirmChange) {
        e.preventDefault();
        return;
      }
    }
    setSelectedSectionId(e.target.value);
    setUnsavedChanges(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="w-full rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">
          Edit Multiple-Choice Questions for {activityName}
        </h2>
        {/* Dropdown for selecting section */}
        <div className="flex gap-2">
          <h1 className="mt-1 text-lg font-bold">View Questions for:</h1>{" "}
          <select
            value={selectedSectionId || ""}
            onChange={handleSectionChange}
            className="mb-4 p-2"
          >
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
          <div className="max-h-80 w-full overflow-y-auto">
            <table className="w-full bg-white">
              <thead className="sticky top-[-1px] h-full bg-white text-gray-600">
                <tr>
                  <th className="border-b py-2 px-4">Actions</th>
                  <th className="w-1/5 border-b py-2 px-4">Question</th>
                  <th className="border-b py-2 px-4">Topic Name</th>
                  <th className="border-b py-2 px-4">Correct Answer</th>
                  <th className="border-b py-2 px-4">Option 1</th>
                  <th className="border-b py-2 px-4">Option 2</th>
                  <th className="border-b py-2 px-4">Option 3</th>
                </tr>
              </thead>
              <tbody className="items-center text-gray-500">
                {questions.map((question, index) => (
                  <tr key={index}>
                    <td className="border-b py-2 px-4">
                      <div className="flex justify-center">
                        {" "}
                        <button
                          onClick={() => removeQuestion(index)} // Bind removeQuestion function
                          className="rounded bg-red-500 p-2 font-bold text-white hover:bg-red-600"
                        >
                          <svg
                            class="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleEdit(index)} // Bind toggleEdit function
                          className="ml-2 rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="h-6 w-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    {/*Topic Name*/}
                    <td className="border-b py-2 px-4">
                      <TextareaAutosize
                        type="text"
                        value={question.quiz_question}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "quiz_question",
                            e.target.value
                          )
                        }
                        className={`w-full resize-none ${
                          editIndices.includes(index)
                            ? ""
                            : "readonly bg-yellow-100"
                        }`}
                        readOnly={!editIndices.includes(index)} // Set readOnly based on editIndices state
                      />
                    </td>
                    {/*Question*/}
                    <td className="border-b py-2 px-4">
                      <TextareaAutosize
                        type="text"
                        value={question.topic_name}
                        onChange={(e) =>
                          handleInputChange(index, "topic_name", e.target.value)
                        }
                        rows={1}
                        className={`h-auto w-full resize-none ${
                          editIndices.includes(index)
                            ? ""
                            : "readonly bg-yellow-100"
                        }`}
                        readOnly={!editIndices.includes(index)} // Set readOnly based on editIndices state
                      />
                    </td>
                    {/*Correct Option*/}
                    <td className="border-b py-2 px-4">
                      <TextareaAutosize
                        type="text"
                        value={question.correct_option}
                        onChange={(e) => {
                          handleInputChange(
                            index,
                            "correct_option",
                            e.target.value
                          ),
                            handleInputChange(
                              index,
                              "option_four",
                              e.target.value
                            );
                        }}
                        className={`w-full resize-none ${
                          editIndices.includes(index)
                            ? ""
                            : "readonly bg-yellow-100"
                        }`}
                        readOnly={!editIndices.includes(index)} // Set readOnly based on editIndices state
                      />
                    </td>
                    {/*Option One*/}
                    <td className="border-b py-2 px-4">
                      <TextareaAutosize
                        type="text"
                        value={question.option_one}
                        onChange={(e) =>
                          handleInputChange(index, "option_one", e.target.value)
                        }
                        className={`w-full resize-none ${
                          editIndices.includes(index)
                            ? ""
                            : "readonly bg-yellow-100"
                        }`}
                        readOnly={!editIndices.includes(index)} // Set readOnly based on editIndices state
                      />
                    </td>
                    {/*Option Two*/}
                    <td className="border-b py-2 px-4">
                      <TextareaAutosize
                        type="text"
                        value={question.option_two}
                        onChange={(e) =>
                          handleInputChange(index, "option_two", e.target.value)
                        }
                        className={`w-full resize-none ${
                          editIndices.includes(index)
                            ? ""
                            : "readonly bg-yellow-100"
                        }`}
                        readOnly={!editIndices.includes(index)} // Set readOnly based on editIndices state
                      />
                    </td>
                    {/*Option Three*/}
                    <td className="border-b py-2 px-4">
                      <TextareaAutosize
                        type="text"
                        value={question.option_three}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "option_three",
                            e.target.value
                          )
                        }
                        className={`w-full resize-none ${
                          editIndices.includes(index)
                            ? ""
                            : "readonly bg-yellow-100"
                        }`}
                        readOnly={!editIndices.includes(index)} // Set readOnly based on editIndices state
                      />
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
