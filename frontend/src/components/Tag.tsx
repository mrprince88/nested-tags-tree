import { useState } from "react";

import { useMutation, useQueryClient } from "react-query";

import { Tag as TagType } from "src/types";

type TagProps = {
  data: TagType;
};

const Tag = ({ data }: TagProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: addChild } = useMutation(
    async (name: string) => {
      const response = await fetch("http://localhost:5000/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parent_id: data.id }),
      });
      return response.json();
    },
    {
      onSuccess: () => {
        setIsAddingChild(false);
        setIsExpanded(true);
        queryClient.invalidateQueries("tag");
      },
    }
  );

  const { mutateAsync: addData } = useMutation(
    async (dataStr: string) => {
      const response = await fetch(
        `http://localhost:5000/tag/${data.id}/data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: dataStr, tag_id: data.id }),
        }
      );
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tag");
      },
    }
  );

  return (
    <div className="border-2 border-blue-400 p-4 mt-4">
      <div className="bg-blue-400 rounded-md p-4 flex gap-4 items-center">
        <button
          className={`bg-slate-200 text-black px-4 py-2 rounded-md,
            ${isExpanded ? "transform rotate-90" : ""}`}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          disabled={!data.children?.length}
        >
          {">"}
        </button>
        <h1>{data.name}</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-auto"
          onClick={() => {
            setIsAddingChild(!isAddingChild);
          }}
        >
          Add Child
        </button>
      </div>

      {!isAddingChild && data.children?.length === 0 && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (e.currentTarget.data.value) {
              addData(e.currentTarget.data.value);
            }
          }}
        >
          <label htmlFor="data" className="mr-2">
            Data:
          </label>
          <input
            type="text"
            name="data"
            placeholder="Data"
            className="border-2 border-blue-400 p-2"
            defaultValue={data?.data}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
            type="submit"
          >
            Add
          </button>
        </form>
      )}

      {isExpanded && (
        <ul className="ml-8 mt-2 mb-2">
          {data?.children?.map((child) => (
            <li key={child.name}>
              <Tag data={child} />
            </li>
          ))}
        </ul>
      )}

      {isAddingChild && (
        <div className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const name = formData.get("name") as string;
              addChild(name);
            }}
          >
            <label htmlFor="name" className="mr-2">
              Child name:
            </label>
            <input
              type="text"
              placeholder="Child name"
              className="border-2 border-blue-400 p-2"
              name="name"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tag;
