import Tag from "src/components/Tag";
import { useQuery } from "react-query";

import { Tag as TagType } from "src/types";

const App = () => {
  const { data } = useQuery<TagType[]>(
    "tag",
    async () => {
      const response = await fetch("http://localhost:5000/tag");
      return response.json();
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <div className="p-4">
      {data?.map((tag) => (
        <Tag key={tag.name} data={tag} />
      ))}
    </div>
  );
};

export default App;
