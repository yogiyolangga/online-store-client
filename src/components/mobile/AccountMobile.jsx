import { FaRegUser } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TiDocumentText } from "react-icons/ti";
import { FaRocketchat } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { PiPackageDuotone } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsHouses } from "react-icons/bs";
import { IoStorefrontOutline } from "react-icons/io5";
import Axios from "axios";

export default function AccountMobile() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const userLogin = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");
  const baseUrl = "http://localhost:3000";
  const [storeStatus, setStoreStatus] = useState(true);

  const getData = () => {
    Axios.get(`${baseUrl}/api/client/data/${userLogin}`).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        setUserFullName(response.data[0].fullname);
        setUserEmail(response.data[0].email);
        setUserNumber(response.data[0].number);
      }
    });
  };

  const handleStoreStatus = () => {
    Axios.get(`${baseUrl}/api/client/checkstore/${userLogin}`).then(
      (response) => {
        if (response.data.set) {
          setStoreStatus(true);
        } else if (response.data.notset) {
          setStoreStatus(false);
        } else {
          console.log("Server Error!");
        }
      }
    );
  };

  useEffect(() => {
    if (token != null) {
      setLoginStatus(true);
      getData();
      handleStoreStatus();
    } else {
      setLoginStatus(false);
    }
  }, []);

  return (
    <>
      <div className="w-full bg-white py-2 min-h-screen">
        <h1 className="font-bold text-lg px-2">My Account</h1>
        {loginStatus === true ? (
          <AccountData
            userLogin={userLogin}
            userFullName={userFullName}
            userNumber={userNumber}
            storeStatus={storeStatus}
          />
        ) : (
          <NotLoginYet />
        )}
      </div>
    </>
  );
}

const AccountData = ({ userLogin, userFullName, userNumber, storeStatus }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center py-3">
        <img src="assets/img/user.png" alt="User" className="w-10 h-10" />
        <p className="font-semibold">{userFullName}</p>
        <p className="font-light">{userLogin}</p>
        <p className="font-light text-xs">{userNumber}</p>
      </div>
      <div className="w-full flex flex-col gap-8 py-4 bg-white px-3 rounded-md border-t-2">
        <a
          href="/account/settings"
          className="w-full flex justify-between items-center gap-1"
        >
          <FaRegUser className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">Personal Info</div>
          <IoIosArrowForward className="text-lg" />
        </a>
        <a
          href="/account/address"
          className="w-full flex justify-between items-center gap-1"
        >
          <BsHouses className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">My Address</div>
          <IoIosArrowForward className="text-lg" />
        </a>
        <a
          href="/account/orders"
          className="w-full flex justify-between items-center gap-1"
        >
          <PiPackageDuotone className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">My Orders</div>
          <IoIosArrowForward className="text-lg" />
        </a>
        <a
          href="/cart"
          className="w-full flex justify-between items-center gap-1"
        >
          <IoCartOutline className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">My Cart</div>
          <IoIosArrowForward className="text-lg" />
        </a>
        <div
          className="w-full flex justify-between items-center gap-1 cursor-pointer"
          onClick={() => alert("sorry support not available yet!")}
        >
          <FaRocketchat className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">Livechat Support</div>
          <IoIosArrowForward className="text-lg" />
        </div>
        {storeStatus === false ? (
          <a
            href="/account/openstore"
            className="w-full flex justify-between items-center gap-1"
          >
            <IoStorefrontOutline className="text-xl text-[#032ea1]" />
            <div className="font-semibold flex-1">Become a Seller</div>
            <IoIosArrowForward className="text-lg" />
          </a>
        ) : (
          <a
            href="/account/store"
            className="w-full flex justify-between items-center gap-1"
          >
            <IoStorefrontOutline className="text-xl text-[#032ea1]" />
            <div className="font-semibold flex-1">My Store</div>
            <IoIosArrowForward className="text-lg" />
          </a>
        )}
        <div className="w-full flex justify-between items-center gap-1">
          <TiDocumentText className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">Policies</div>
          <IoIosArrowForward className="text-lg" />
        </div>
        <div className="w-full flex justify-between items-center gap-1">
          <IoMdHelpCircleOutline className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">Help</div>
          <IoIosArrowForward className="text-lg" />
        </div>
        <div
          className="w-full flex justify-between items-center gap-1 cursor-pointer"
          onClick={handleLogout}
        >
          <RiLogoutBoxRLine className="text-xl text-[#032ea1]" />
          <div className="font-semibold flex-1">Logout</div>
          <IoIosArrowForward className="text-lg" />
        </div>
      </div>
    </>
  );
};

const NotLoginYet = () => {
  return (
    <>
      <div className="w-full flex flex-col gap-3 items-center py-16">
        <div className="bg-white">
          <img
            src="assets/img/needlogin.png"
            alt="Login Account"
            className="w-full"
          />
        </div>
        <p>Your not login yet</p>
        <div className="w-full px-2 flex justify-center gap-1 items-center">
          <a
            href="/"
            className="border flex items-center justify-center border-[#e00025] text-[#e00025] rounded-md w-32 text-sm py-2"
          >
            Go Shopping
          </a>
          or
          <a
            href="/login"
            className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-md w-32 text-white text-sm py-2 flex items-center justify-center"
          >
            Sign in/Sign Up
          </a>
        </div>
      </div>
    </>
  );
};
