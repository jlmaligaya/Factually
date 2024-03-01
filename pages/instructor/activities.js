import Layout from "../../components/InstructorLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import EditMCQModal from "../../components/EditMCQModal"; // Import the EditMCQModal component
import { useRouter } from "next/router";
import UploadVideoModal from "../../components/UploadVideoModal";
import EditSwiperModal from "../../components/editSwiper";
import EditImageMatchModal from "../../components/editImageMatch";

const ManageActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState(null);
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const [isIDragModalOpen, setIsIDragModalOpen] = useState(false);
  const [isIMatchModalOpen, setIsImatchModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`/api/viewInstructorActivities`);
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
      console.log("Activities: ", activities);
    };

    fetchActivities();
  }, []);

  const getActivityType = (type) => {
    switch (type) {
      case 1:
        return "Multiple-Choice Questions";
      case 2:
        return "Image Match";
      case 3:
        return "Image Drag";
      default:
        return "Unknown";
    }
  };

  const uploadVideo = (activity) => {
    setSelectedActivityId(activity.aid);
    setIsUploadModalOpen(true);
  };

  const editActivity = (activity) => {
    setSelectedActivityId(activity.aid);
    setSelectedActivityName(activity.topic);
    console.log("Activity name: ", selectedActivityName);
    if (activity.type === 3) {
      // Open editSwiperModal
      setIsIDragModalOpen(true);
    }
    if (activity.type === 2) {
      // Open editSwiperModal

      setIsImatchModalOpen(true);
    } else if (activity.type === 1) {
      // Open EditMCQModal for Multiple-Choice Questions

      setIsMCQModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsMCQModalOpen(false);
    setIsIDragModalOpen(false);
    setIsImatchModalOpen(false);
    console.log(selectedActivityId);
  };

  return (
    <Layout>
      <div className="mt-24 h-4/5 bg-white">
        {" "}
        <h1 className="mt-10 p-4 text-center text-xl font-extrabold uppercase text-gray-700 2xl:text-3xl">
          Manage Activities
        </h1>
        <div className="container mx-auto flex flex-col text-black">
          <div className="mb-32 h-4/5 w-full 2xl:w-4/5">
            <table className="min-w-full border border-gray-300 bg-white text-center">
              <thead className="bg-white text-gray-600">
                <tr>
                  <th className="border-b py-2 px-4">Activity ID</th>
                  <th className="border-b py-2 px-4">Topic</th>
                  <th className="border-b py-2 px-4">Activity Type</th>
                  <th className="border-b py-2 px-4">Customize</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="border-b py-2 px-4">{activity.aid}</td>
                    <td className="border-b py-2 px-4">{activity.topic}</td>
                    <td className="border-b py-2 px-4">
                      {getActivityType(activity.type)}
                    </td>
                    <td className="flex justify-center gap-2 border-b py-2 px-4">
                      <button
                        onClick={() => {
                          editActivity(activity);
                        }} // Open modal for editing MCQs
                        className=" rounded-md bg-blue-600 p-2 text-sm font-medium uppercase text-white hover:bg-blue-700 hover:text-slate-200"
                      >
                        Questions
                      </button>
                      <button
                        onClick={() => uploadVideo(activity)} // Open modal for editing MCQs
                        className=" rounded-md bg-blue-600 p-2 text-sm font-medium uppercase text-white hover:bg-blue-700 hover:text-slate-200"
                      >
                        Video
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Render the EditMCQModal component */}
        {isMCQModalOpen && (
          <EditMCQModal
            activityId={selectedActivityId}
            activityName={selectedActivityName}
            onClose={closeModal}
          />
        )}
        {isIDragModalOpen && (
          <EditSwiperModal
            activityId={selectedActivityId}
            activityName={selectedActivityName}
            onClose={closeModal}
          />
        )}
        {isUploadModalOpen && (
          <UploadVideoModal
            activityId={selectedActivityId}
            activityName={selectedActivityName}
            onClose={() => setIsUploadModalOpen(false)} // Pass a function reference
          />
        )}
        {isIMatchModalOpen && (
          <EditImageMatchModal
            activityId={selectedActivityId}
            activityName={selectedActivityName}
            onClose={closeModal} // Pass a function reference
          />
        )}
      </div>
    </Layout>
  );
};

export default ManageActivitiesPage;
