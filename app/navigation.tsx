import Link from "next/link";

const Navigation = () => {
    return (
        <nav className=" w-full p-4 flex flex-row gap-3 justify-center bg-black text-[#edde19] font-medium mb-8">
            <Link href={"/"}> Main </Link>
            <Link href={"/auth"}> Auth </Link>
        </nav>
    );
};

export default Navigation;
