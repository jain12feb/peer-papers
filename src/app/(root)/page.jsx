import AddDocumentBtn from "@/components/AddDocumentBtn";
import { DeleteModal } from "@/components/DeleteModal";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
              name={`${clerkUser.firstName} ${clerkUser.lastName}`}
              image={clerkUser.imageUrl}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }) => (
              <li key={id} className="document-list-item">
                <Link
                  href={`/documents/${id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="hidden  sm:block">
                    <Image
                      src="/assets/icons/doc.svg"
                      alt="file"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>

                    <div className="flex items-center gap-x-2">
                      <Avatar>
                        <AvatarImage
                          src={
                            metadata.avatar ||
                            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUtdXNlci1yb3VuZCI+PHBhdGggZD0iTTE4IDIwYTYgNiAwIDAgMC0xMiAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iNCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+"
                          }
                        />
                        <AvatarFallback className="text-black">
                          ?
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-light text-blue-100">
                        Created {dateConverter(createdAt)} by{" "}
                        {clerkUser.emailAddresses[0].emailAddress ===
                        metadata.email
                          ? "you"
                          : metadata.createdBy}{" "}
                        ({metadata.email})
                      </p>
                    </div>
                  </div>
                </Link>
                {metadata.creatorId === clerkUser.id && (
                  <DeleteModal roomId={id} />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <AddDocumentBtn
          userId={clerkUser.id}
          email={clerkUser.emailAddresses[0].emailAddress}
          name={`${clerkUser.firstName} ${clerkUser.lastName}`}
          image={clerkUser.imageUrl}
          type="document"
        />
      )}
    </main>
  );
};

export default Home;
