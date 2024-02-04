import { useState } from "react";

const UploadTableForm = () => {
  const [tableData, setTableData] = useState([
    { title: "", activityId: "", image1: "", image2: "", image3: "" },
    { title: "", activityId: "", image1: "", image2: "", image3: "" },
    { title: "", activityId: "", image1: "", image2: "", image3: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  };

  const handleSubmit = () => {
    const firstTopic = tableData[0];
    const secondTopic = tableData[1];
    const thirdTopic = tableData[2];
    const formattedImages = [];
    const formattedData = tableData.map((row) => ({
      title: row.title,
      activityId: row.activityId,
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

    console.log(formattedData);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Activity ID</th>
            <th>Image 1</th>
            <th>Image 2</th>
            <th>Image 3</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.activityId}
                  onChange={(e) =>
                    handleChange(index, "activityId", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.image1}
                  onChange={(e) =>
                    handleChange(index, "image1", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.image2}
                  onChange={(e) =>
                    handleChange(index, "image2", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.image3}
                  onChange={(e) =>
                    handleChange(index, "image3", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default UploadTableForm;
