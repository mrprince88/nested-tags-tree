import Tag from "src/components/Tag";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";

import { Tag as TagType } from "src/types";

const App = () => {
  const { data } = useQuery<TagType[]>("tag", async () => {
    const response = await fetch("http://localhost:5000/tag");
    return response.json();
  });

  return (
    <div className="p-4">
      {data?.map((tag) => (
        <Tag key={tag.name} data={tag} />
      ))}
      <ToastContainer position="bottom-center" theme="colored" />
    </div>
  );
};

export default App;
