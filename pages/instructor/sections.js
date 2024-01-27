import Layout from "../../components/InstructorLayout";

import { useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);

  const addUserRow = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
      },
    ]);
  };

  const saveUserRow = (index) => {
    // Handle saving user data here
    console.log("Saving user:", users[index]);
    // After saving, you can update the UI as needed
  };

  const cancelUserRow = (index) => {
    setUsers((prevUsers) => prevUsers.filter((user, i) => i !== index));
  };

  const handleInputChange = (e, index, key) => {
    const { value } = e.target;
    setUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, [key]: value } : user
      )
    );
  };

  return (
    <Layout>
      {" "}
      <div className="container mx-auto h-full w-full flex-col bg-white">
        <h1 className="mb-4 text-2xl font-bold text-black">Manage Students</h1>
        <div className="w-full">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-black">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td
                    className="px-4 py-2"
                    contentEditable
                    onBlur={(e) => handleInputChange(e, index, "username")}
                  >
                    {user.username}
                  </td>
                  <td
                    className="px-4 py-2"
                    contentEditable
                    onBlur={(e) => handleInputChange(e, index, "firstName")}
                  >
                    {user.firstName}
                  </td>
                  <td
                    className="px-4 py-2"
                    contentEditable
                    onBlur={(e) => handleInputChange(e, index, "lastName")}
                  >
                    {user.lastName}
                  </td>
                  <td
                    className="px-4 py-2"
                    contentEditable
                    onBlur={(e) => handleInputChange(e, index, "email")}
                  >
                    {user.email}
                  </td>
                  <td className="flex items-center px-4 py-2">
                    <button
                      className="rounded bg-red-500 px-4 py-1 text-white"
                      onClick={() => cancelUserRow(index)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-b border-gray-300">
                <td
                  colSpan="5"
                  className="flex w-full justify-center px-4 py-2"
                >
                  <button
                    className="rounded bg-blue-500 px-4 py-1 text-white"
                    onClick={addUserRow}
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
