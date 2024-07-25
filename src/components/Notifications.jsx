"use client";

import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckCheck, MessageCircleOff, SquareX } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react";

const Notifications = () => {
  const {
    inboxNotifications,
    isLoading: inboxNotificationLoading,
    error: inboxNotificationError,
  } = useInboxNotifications();

  const {
    count: unreadInboxNotificationCount,
    isLoading: unreadInboxNotificationLoading,
    error: unreadInboxNotificationError,
  } = useUnreadInboxNotificationsCount();

  // const unreadNotifications = inboxNotifications.filter(
  //   (notification) => !notification.readAt // Filter unread notifications
  // );

  const unreadNotifications = inboxNotifications;

  if (inboxNotificationLoading || unreadInboxNotificationLoading) {
    return (
      <Image
        src="/assets/icons/loader.svg"
        alt="loader"
        width={32}
        height={32}
        className="animate-spin"
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        title="Show Notifications"
        className="relative flex size-10 items-center justify-center rounded-lg"
      >
        <Image
          src="/assets/icons/bell.svg"
          alt="inbox"
          width={30}
          height={30}
        />
        {unreadInboxNotificationCount > 0 &&
          unreadInboxNotificationCount <= 99 && (
            // <div className="absolute right-2 top-2 z-20 size-3.5 rounded-full bg-blue-500">
            <span className="absolute right-0.5 -top-0.5 z-20 size-[18px] pt-[1px] rounded-full bg-blue-500 text-[10px]">
              {unreadInboxNotificationCount}
            </span>
            // </div>
          )}
        {unreadInboxNotificationCount > 0 &&
          unreadInboxNotificationCount > 99 && (
            <div className="absolute right-2 top-2 z-20 size-3.5 rounded-full bg-blue-500" />
          )}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        {unreadNotifications.length > 0 && (
          <div className="text-neutral-100 flex justify-around items-center text-xs mb-2">
            <p> Total Notifications : {unreadNotifications.length}</p>
            <p> Unread Notifications : {unreadInboxNotificationCount}</p>
          </div>
        )}

        <ScrollArea className={unreadNotifications.length > 0 && "h-[285px]"}>
          <LiveblocksUIConfig
            overrides={{
              INBOX_NOTIFICATION_TEXT_MENTION: (user, room) => {
                return <>{user} mentioned you</>;
              },
            }}
          >
            {unreadNotifications.length > 0 && (
              <p className="h-[1px] w-full bg-[#0f1c34] mt-2" />
            )}

            <InboxNotificationList>
              {unreadNotifications.length <= 0 && (
                <p className="py-2 text-center text-dark-500 flex items-center justify-center gap-x-3 rounded-sm">
                  No notifications to show
                  <MessageCircleOff />
                </p>
              )}

              {unreadNotifications.length > 0 &&
                unreadNotifications.map((inboxNotification) => (
                  <Fragment key={inboxNotification.id}>
                    <InboxNotification
                      inboxNotification={inboxNotification}
                      className="bg-dark-200 text-white text-xs flex items-center"
                      href={`/documents/${inboxNotification.roomId}`}
                      onClick={() => {
                        inboxNotification.readAt = new Date();
                      }}
                      showActions={true}
                      kinds={{
                        thread: (props) => (
                          <InboxNotification.Thread
                            {...props}
                            showRoomName={false}
                            showActions={true}
                          />
                        ),

                        textMention: (props) => {
                          return (
                            <InboxNotification.TextMention
                              {...props}
                              showRoomName={false}
                            />
                          );
                        },

                        $documentAccess: (props) => {
                          const { title, avatar } =
                            props.inboxNotification.activities[0].data;

                          return (
                            <InboxNotification.Custom
                              {...props}
                              title={title}
                              markAsReadOnClick={true}
                              aside={
                                <InboxNotification.Icon className="bg-transparent">
                                  <Image
                                    src={avatar || ""}
                                    width={36}
                                    height={36}
                                    alt="avatar"
                                    className="rounded-full"
                                  />
                                </InboxNotification.Icon>
                              }
                            >
                              {props.children}
                            </InboxNotification.Custom>
                          );
                        },
                      }}
                    />
                    <p className="h-[1px] w-full bg-[#0f1c34] mb-2" />
                  </Fragment>
                ))}
            </InboxNotificationList>
          </LiveblocksUIConfig>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
