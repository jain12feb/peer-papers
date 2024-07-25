import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import {
  removeCollaborator,
  updateDocumentAccess,
} from "@/lib/actions/room.actions";

const Collaborator = ({ roomId, creatorId, collaborator, email, user }) => {
  const [userType, setUserType] = useState(collaborator.userType || "viewer");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const shareDocumentHandler = async (type) => {
    setUpdating(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: type,
      updatedBy: user,
    });

    setUpdating(false);
  };

  const removeCollaboratorHandler = async (email) => {
    setDeleting(true);

    await removeCollaborator({ roomId, email });

    setDeleting(false);
  };

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {updating && "updating..."}
              {deleting && "removing..."}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm font-semibold text-blue-100">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType}
            setUserType={setUserType || "viewer"}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            size="xs"
            variant="destructive"
            type="button"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

export default Collaborator;