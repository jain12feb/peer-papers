"use client";

import { createDocument } from "@/lib/actions/room.actions";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FilePlus, Plus } from "lucide-react";
import { useState } from "react";

const AddDocumentBtn = ({ userId, email, name, image, type = "button" }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const addDocumentHandler = async () => {
    setLoading(true);
    try {
      const room = await createDocument({ userId, email, name, image });
      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setLoading(false), 5000);
    }
  };

  if (type === "document") {
    return (
      <div
        className="document-list-empty cursor-pointer"
        onClick={addDocumentHandler}
        title="Click to create New Document"
      >
        {/* <Image
          src="/assets/icons/add.svg"
          alt="Document"
          width={100}
          height={100}
          className="mx-auto text-dark-500"
        /> */}

        <Plus size={100} className="mx-auto text-dark-500" />

        <div className="flex gap-1">
          {/* <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} /> */}
          {loading ? (
            <div className="flex flex-col gap-y-2 items-center">
              {/* <div
                className="animate-spin h-5 w-5 border-b-4 border
        rounded-full border-black"
              ></div> */}
              <Image
                src="/assets/images/document.png"
                alt="Document"
                width={50}
                height={50}
                className="animate-bounce"
              />
              <p className="text-2xl animate-bounce text-dark-500">Creating</p>
            </div>
          ) : (
            <div className="flex flex-col gap-y-1 items-center justify-center">
              {/* <FilePlus className="h-5 w-5" /> */}
              <p className="text-lg text-dark-500">click to create</p>
              <p className="text-2xl text-dark-500">New Document</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Button
      type="submit"
      onClick={addDocumentHandler}
      className="gradient-blue flex gap-1 shadow-md"
    >
      {/* <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} /> */}
      {loading ? (
        <>
          <div
            className="animate-spin h-5 w-5 border-b-2 border
        rounded-full"
          ></div>
          <p className="ml-1">Creating...</p>
        </>
      ) : (
        <>
          <FilePlus className="h-5 w-5" />
          <p className="">New Document</p>
        </>
      )}
    </Button>
  );
};

export default AddDocumentBtn;
