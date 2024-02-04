import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function UsernameSelectionModal({
  onUsernameSelect,
  username,
  onClose,
}) {
  const [newUsername, setNewUsername] = useState(""); // State to store the username input value
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleChange = (e) => {
    setNewUsername(e.target.value); // Update the username state as the user types
  };

  const handleChangeUsername = async () => {
    const trimmedUsername = newUsername.trim();
    if (!trimmedUsername) {
      setError("Username cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/changeUsername", {
        newUsername: trimmedUsername,
        username,
      });
      console.log("Username updated successfully:", response.data);
      session.user.username = trimmedUsername; // Update the username in the session
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update username");
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    // Call the onUsernameSelect callback with the selected username
    onUsernameSelect(username);
  };

  return (
    <div className=" h-screen  items-center justify-center bg-[url('/bground_menu.png')] text-white">
      <div className="flex flex-col">
        <div className="mb-8 flex w-full justify-center py-10 font-boom text-6xl xl:text-4xl 2xl:text-6xl">
          <div className="text-with-stroke w-4/5 bg-red-500 p-8 text-center">
            Welcome to Factually
          </div>
        </div>
        <div className="flex items-center">
          <div className="ml-48 mt-4 w-3/5">
            <p className="text-with-stroke mb-4 w-3/5 font-ogoby xl:text-4xl 2xl:text-6xl">
              To start your journey, please choose your username:
            </p>
            <div className="flex flex-col">
              {" "}
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your username"
                className=" w-64 rounded-lg border border-white px-4 py-2 font-retropix text-lg text-black focus:outline-none"
              />
              <button
                onClick={handleChangeUsername}
                className="mt-2 w-64 rounded-lg bg-red-500 px-6 py-2 font-ogoby text-white transition duration-300 hover:bg-red-600  hover:text-slate-200 xl:text-xl 2xl:text-2xl"
              >
                Get Started
              </button>
              {error && (
                <p className="text-stroke mt-4 bg-black font-ogoby text-2xl text-red-500 ">
                  {error}
                </p>
              )}
            </div>
          </div>
          <div className="relative flex w-1/2 items-center justify-center bg-black">
            <img
              className="robot-image fixed bottom-5 w-2/5"
              src="/robbie/r_welcome.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
