import { IoStorefront } from "react-icons/io5";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";

export default function MenuMobile() {
    const path = useLocation();
    return(
        <>
            <div className="w-full flex justify-evenly">
                <a href="/" className="flex flex-col justify-center items-center">
                    <IoStorefront className={`${path.pathname === "/" ? "text-[#032ea1]" : "text-zinc-500"} text-2xl`} />
                    <p className="text-zinc-600 text-xs font-semibold">Home</p>
                </a>
                <a href="/categories" className="flex flex-col justify-center items-center">
                    <BiSolidCategoryAlt className={`${path.pathname === "/categories" ? "text-[#032ea1]" : "text-zinc-500"} text-2xl`} />
                    <p className="text-zinc-600 text-xs font-semibold">Categories</p>
                </a>
                <a href="/cart" className="flex flex-col justify-center items-center">
                    <FaShoppingCart className={`${path.pathname === "/cart" ? "text-[#032ea1]" : "text-zinc-500"} text-2xl`} />
                    <p className="text-zinc-600 text-xs font-semibold">Cart</p>
                </a>
                <a href="/account" className="flex flex-col justify-center items-center">
                    <RiAccountPinCircleLine className={`${path.pathname === "/account" ? "text-[#032ea1]" : "text-zinc-500"} text-2xl`} />
                    <p className="text-zinc-600 text-xs font-semibold">Account</p>
                </a>
            </div>
        </>
    )
}