import React from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

import Ascii from "./Ascii";
import { useDispatch } from "react-redux";
import { deleteAscii } from "@/redux/asciiSlice";
import { UserContext } from "@/context/userContext";

interface Props {
  id: string;
  username: string;
  authorId: string;
  ascii: string;
  dateCreated: string;
}

export default function GalleryItem({
  id,
  username,
  authorId,
  ascii,
  dateCreated,
}: Props) {
  const dispatch = useDispatch();
  const { user } = React.useContext(UserContext);

  async function delAscii(id: string) {
    try {
      await fetch("/api/deleteAscii", {
        method: "POST",
        body: JSON.stringify({
          userId: authorId,
          asciiId: id
        }),
      });
      dispatch(deleteAscii(id));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="bg-slate-100 rounded m-5 p-10">
      <div className="flex justify-between">
        <p>
          Uploaded by {username} on {dateCreated}
        </p>
        {authorId === user?.userId && (
          <TrashIcon
            className="text-red-500 block h-6 w-6 cursor-pointer"
            onClick={() => {
              delAscii(id);
            }}
          />
        )}
      </div>
      <Ascii ascii={ascii} />
    </div>
  );
}
