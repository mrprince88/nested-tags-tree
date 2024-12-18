import { useState } from "react";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Tag as TagType } from "src/types";
import Tag from "src/components/Tag";

const App = () => {
  const [isDataExported, setIsDataExported] = useState(false);

  const { data, isLoading } = useQuery<TagType>("tag", async () => {
    const response = await fetch("http://localhost:5000/tag");
    return response.json();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="p-4">
      <Tag key={data?.id} data={data} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
        onClick={() => setIsDataExported(true)}
      >
        Export
      </button>
      {isDataExported && <div>{JSON.stringify(data)}</div>}
      <ToastContainer position="bottom-center" theme="colored" />
    </div>
  );
};

export default App;
