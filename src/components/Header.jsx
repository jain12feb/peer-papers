import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Header = ({ children, className }) => {
  return (
    <div className={cn("header", className)}>
      <Link title="PeerDocx" href="/" className="flex items-center">
        {/* <Image
          src="/assets/icons/logo.svg"
          alt="Logo with name"
          width={120}
          height={32}
          className="hidden md:block"
        /> */}
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={40}
          height={40}
          //   className="mr-1"
        />
        <span className="font-bold text-xl text-neutral-100 hidden md:block select-none">
          PeerDocx
        </span>
      </Link>
      {children}
    </div>
  );
};

export default Header;
