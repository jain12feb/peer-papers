import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Users } from "lucide-react";

const ActiveCollaborators = () => {
  const others = useOthers();

  const collaborators = others.map((other) => other.info);

  return (
    <>
      <div className="hidden md:block">
        <ul className="collaborators-list">
          {collaborators.map(({ id, avatar, name, email, color }) => (
            <li key={id}>
              <Popover>
                <PopoverTrigger>
                  <Image
                    src={avatar}
                    alt={name}
                    width={100}
                    height={100}
                    className="inline-block size-8 rounded-full ring-2 ring-dark-100"
                    style={{ border: `3px solid ${color}` }}
                  />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col justify-center items-center h-11 w-fit bg-dark-100 text-neutral-100 font-normal">
                  <h3 className="text-sm">{name}</h3>
                  <p className="text-xs">{email}</p>
                </PopoverContent>
              </Popover>
            </li>
          ))}
        </ul>
        <div className="divider2 hidden md:block" />
      </div>
      <div className="block md:hidden">
        <Dialog>
          <DialogTrigger asChild title="View Collaborators">
            <Button
              variant="icon"
              size="icon"
              // className="gradient-blue flex h-9 gap-1 px-4"
            >
              <Users />
            </Button>
          </DialogTrigger>
          <DialogContent className="shad-dialog">
            <DialogHeader>
              <DialogTitle>View Collaborators</DialogTitle>
              <DialogDescription>
                Below are those who can access this project
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 space-y-2">
              <ul className="flex flex-col">
                {collaborators.map((collaborator) => (
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
                        </p>
                        <p className="text-sm font-light text-blue-100">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ActiveCollaborators;
