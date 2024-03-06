import Layout from "../../components/InstructorLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function StudentProgression() {
  const [studentProgression, setStudentProgression] = useState([]);
  const { data: session, status } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name"); // default to search by name
  const [loading, setLoading] = useState(true);
  const uid = session?.user.uid;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/progression?uid=${uid}`);
        const allScores = response.data;
        // Organize scores by username and activity
        const progression = {};
        allScores.forEach((score) => {
          const username = score.user.username;
          const section = score.user.section; // Assuming there's a section property for users
          const firstName = score.user.firstName;
          const lastName = score.user.lastName;
          if (!progression[username]) {
            progression[username] = {
              username,
              firstName,
              lastName,
              section,
              activities: {},
            };
          }
          const activityId = score.activity.aid;
          progression[username].activities[activityId] =
            score.score < 67 ? (
              <div className="flex h-full w-full flex-col items-center justify-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="orange"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h1 className="text-sm text-yellow-500">Started</h1>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="green"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h1 className="text-sm text-green-600">{score.score}</h1>
              </div>
            );
        });

        const sortedProgression = Object.values(progression).sort((a, b) => {
          if (a.section !== b.section) {
            return a.section.localeCompare(b.section);
          } else {
            return a.firstName.localeCompare(b.firstName);
          }
        });

        setStudentProgression(sortedProgression);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [uid]);

  const activityIds = Array.from(
    { length: 10 },
    (_, index) => `AID00000${index + 1}`
  );
  const activityTitles = Array.from(
    { length: 10 },
    (_, index) => `Chapter ${index + 1}`
  );

  const filteredProgression = studentProgression.filter((student) => {
    if (searchType === "name") {
      return student.firstName
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    } else if (searchType === "section") {
      return student.section.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  });

  return (
    <Layout>
      <div className="mt-24 flex h-4/5 flex-col bg-white p-8">
        <h1 className="p-4 text-center text-xl font-extrabold uppercase text-gray-700 2xl:text-3xl">
          CHAPTER PROGRESSION
        </h1>
        {loading ? ( // Conditionally render loading indicator
          <div className="mt-4 text-center text-black">Loading...</div>
        ) : (
          <div className="container mx-auto flex flex-col text-gray-500">
            <div className="mb-4 flex w-full p-4 ">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder={`Search by ${searchType}`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="mr-2 rounded-md border border-gray-400 px-2 py-1"
                />
                <div className="mr-2">
                  <input
                    type="radio"
                    id="searchByName"
                    name="searchType"
                    value="name"
                    checked={searchType === "name"}
                    onChange={() => setSearchType("name")}
                  />
                  <label htmlFor="searchByName" className="ml-1 mr-3">
                    Name
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="searchBySection"
                    name="searchType"
                    value="section"
                    checked={searchType === "section"}
                    onChange={() => setSearchType("section")}
                  />
                  <label htmlFor="searchBySection" className="ml-1">
                    Section
                  </label>
                </div>
              </div>
            </div>
            <div className="h-[500px] w-full overflow-auto scrollbar-thin scrollbar-thumb-white">
              {filteredProgression.length === 0 && searchValue ? (
                <div className="p-4 text-center">
                  No results found for &quot;{searchValue}&quot;.
                </div>
              ) : (
                <table className="w-full table-auto bg-white">
                  <thead className="sticky top-[-1px] bg-white text-gray-600">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Section</th>
                      {activityTitles.map((activityId) => (
                        <th key={activityId} className="px-4 py-2">
                          {activityId}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-center text-gray-500">
                    {filteredProgression.map((student) => (
                      <tr key={student.username}>
                        <td className="px-4 py-2 capitalize">
                          {student.firstName.trim()}&nbsp;
                          {student.lastName.trim()}
                        </td>
                        <td className=" px-4 py-2">{student.section}</td>
                        {activityIds.map((activityId) => (
                          <td
                            key={activityId}
                            className={` px-4 py-2 ${
                              student.activities[activityId]
                                ? student.activities[activityId].props
                                    .children[1].props.children === "Started"
                                  ? "bg-yellow-100"
                                  : "bg-green-200"
                                : "bg-red-200"
                            }`}
                          >
                            {student.activities[activityId] || (
                              <div className="flex flex-col items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="red"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                                <h1 className="text-center text-sm text-red-600">
                                  Not Opened
                                </h1>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
