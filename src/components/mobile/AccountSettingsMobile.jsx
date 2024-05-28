import { IoMdArrowDropright } from "react-icons/io";
import { IoArrowUndo } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AccountSettingsMobile() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [userGender, setUserGender] = useState(null);
  const [userBirthday, setUserBirthday] = useState(null);
  const userLogin = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");
  const baseUrl = import.meta.env.VITE_API_URL;
  const [showName, setShowName] = useState("translate-x-[100%]");
  const [showNumber, setShowNumber] = useState("translate-x-[100%]");
  const [showEmail, setShowEmail] = useState("translate-x-[100%]");
  const [showGender, setShowGender] = useState("translate-x-[100%]");
  const [showBirthday, setShowBirthday] = useState("translate-x-[100%]");
  const navigate = useNavigate();

  const getData = () => {
    Axios.get(`${baseUrl}/api/client/data/${userLogin}`).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        setUserFullName(response.data[0].fullname);
        setUserEmail(response.data[0].email);
        setUserNumber(response.data[0].number);
        setUserGender(response.data[0].gender);
        setUserBirthday(response.data[0].birthday);
      }
    });
  };

  useEffect(() => {
    if (token != null) {
      setLoginStatus(true);
      getData();
    } else {
      setLoginStatus(false);
    }
  }, []);

  const handleShowName = () => {
    setShowName("");
  };

  const handleCloseName = () => {
    setShowName("translate-x-[100%]");
  };

  const updateName = () => {
    Axios.put(`${baseUrl}/api/client/upname/${userLogin}`, {
      userFullName: userFullName,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("Error!");
      }
    });
  };

  const handleShowNumber = () => {
    setShowNumber("");
  };

  const handleCloseNumber = () => {
    setShowNumber("translate-x-[100%]");
  };

  const updateNumber = () => {
    Axios.put(`${baseUrl}/api/client/upnumber/${userLogin}`, {
      userNumber: userNumber,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("Error!");
      }
    });
  };
  const handleShowEmail = () => {
    setShowEmail("");
  };

  const handleCloseEmail = () => {
    setShowEmail("translate-x-[100%]");
  };

  const updateEmail = () => {
    Axios.put(`${baseUrl}/api/client/upemail/${userLogin}`, {
      userEmail: userEmail,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("Error!");
      }
    });
  };

  const handleShowGender = () => {
    setShowGender("");
  };

  const handleCloseGender = () => {
    setShowGender("translate-x-[100%]");
  };

  const updateGender = () => {
    Axios.put(`${baseUrl}/api/client/upgender/${userLogin}`, {
      userGender: userGender,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("Error!");
      }
    });
  };

  const handleShowBirthday = () => {
    setShowBirthday("");
  };

  const handleCloseBirthday = () => {
    setShowBirthday("translate-x-[100%]");
  };

  const updateBirthday = () => {
    Axios.put(`${baseUrl}/api/client/upbirthday/${userLogin}`, {
      userBirthday: userBirthday,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("Error!");
      }
    });
  };

  return (
    <>
      <div className="py-10 relative overflow-hidden">
        <div className="flex flex-col gap-3 w-full px-2">
          <div className="w-full flex gap-2 items-center">
            <IoArrowUndo className="text-lg" onClick={(e) => navigate("/account")} />
            <h1 className="font-bold text-lg">Info Profile</h1>
          </div>
          <div className="w-full h-[1px] bg-zinc-300"></div>
          {loginStatus === true ? (
            <Profile
              userFullName={userFullName}
              userLogin={userLogin}
              userNumber={userNumber}
              userEmail={userEmail}
              userGender={userGender}
              userBirthday={userBirthday}
              handleShowName={handleShowName}
              handleShowNumber={handleShowNumber}
              handleShowEmail={handleShowEmail}
              handleShowGender={handleShowGender}
              handleShowBirthday={handleShowBirthday}
            />
          ) : (
            <NotLoginYet />
          )}
        </div>
        <div
          className={`absolute min-h-screen w-full z-10 top-0 bg-white duration-200 ${showName}`}
        >
          <NamePage
            handleCloseName={handleCloseName}
            userFullName={userFullName}
            updateName={updateName}
            setUserFullName={setUserFullName}
          />
        </div>
        <div
          className={`absolute min-h-screen w-full z-10 top-0 bg-white duration-200 ${showNumber}`}
        >
          <NumberPage
            handleCloseNumber={handleCloseNumber}
            userNumber={userNumber}
            updateNumber={updateNumber}
            setUserNumber={setUserNumber}
          />
        </div>
        <div
          className={`absolute min-h-screen w-full z-10 top-0 bg-white duration-200 ${showEmail}`}
        >
          <EmailPage
            handleCloseEmail={handleCloseEmail}
            userEmail={userEmail}
            updateEmail={updateEmail}
            setUserEmail={setUserEmail}
          />
        </div>
        <div
          className={`absolute min-h-screen w-full z-10 top-0 bg-white duration-200 ${showGender}`}
        >
          <GenderPage
            handleCloseGender={handleCloseGender}
            userGender={userGender}
            updateGender={updateGender}
            setUserGender={setUserGender}
          />
        </div>
        <div
          className={`absolute min-h-screen w-full z-10 top-0 bg-white duration-200 ${showBirthday}`}
        >
          <BirthdayPage
            handleCloseBirthday={handleCloseBirthday}
            userBirthday={userBirthday}
            updateBirthday={updateBirthday}
            setUserBirthday={setUserBirthday}
          />
        </div>
      </div>
    </>
  );
}

const Profile = ({
  userFullName,
  userLogin,
  userNumber,
  userEmail,
  userGender,
  userBirthday,
  handleShowName,
  handleShowNumber,
  handleShowEmail,
  handleShowGender,
  handleShowBirthday,
}) => {
  const formatDate = (originalDate) => {
    const dateObject = new Date(originalDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div
          className="w-full flex justify-start items-center"
          onClick={handleShowName}
        >
          <div className="w-28 text-zinc-400 text-sm font-light">Name</div>
          <div className="flex-1">{userFullName}</div>
          <IoMdArrowDropright />
        </div>
        <div className="w-full flex justify-start items-center">
          <div className="w-28 text-zinc-400 text-sm font-light">Username</div>
          <div className="flex-1">{userLogin}</div>
          {/* <IoMdArrowDropright /> */}
          <p className="text-xs font-semibold text-zinc-600">contact support</p>
        </div>
        <div
          className="w-full flex justify-start items-center"
          onClick={handleShowNumber}
        >
          <div className="w-28 text-zinc-400 text-sm font-light">
            Phone Number
          </div>
          <div className="flex-1">{userNumber}</div>
          <IoMdArrowDropright />
        </div>
        <div
          className="w-full flex justify-start items-center"
          onClick={handleShowEmail}
        >
          <div className="w-28 text-zinc-400 text-sm font-light">Email</div>
          <div className="flex-1">{userEmail}</div>
          <IoMdArrowDropright />
        </div>
        <div
          className="w-full flex justify-start items-center"
          onClick={handleShowGender}
        >
          <div className="w-28 text-zinc-400 text-sm font-light">Gender</div>
          <div
            className={`flex-1 ${userGender === null ? "text-zinc-400" : ""}`}
          >
            {userGender === null ? "Add your gender" : userGender}
          </div>
          <IoMdArrowDropright />
        </div>
        <div
          className="w-full flex justify-start items-center"
          onClick={handleShowBirthday}
        >
          <div className="w-28 text-zinc-400 text-sm font-light">Birthday</div>
          <div
            className={`flex-1 ${userBirthday === null ? "text-zinc-400" : ""}`}
          >
            {userBirthday === null
              ? "Add your birthday"
              : formatDate(userBirthday)}
          </div>
          <IoMdArrowDropright />
        </div>
      </div>
      <div className="flex py-10 justify-center items-center">
        <button onClick={() => alert("Please contact support!")} className="text-lg font-bold text-[#032ea1] border px-2 py-1 rounded-md shadow">
          Close Account
        </button>
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
            src="../assets/img/needlogin.png"
            alt="Login Account"
            className="w-full"
          />
        </div>
        <p>Your not login yet</p>
        <div className="w-full px-2 flex justify-center gap-1 items-center">
          <button className="border border-[#e00025] text-[#e00025] rounded-md w-32 text-sm py-2">
            Go Shopping
          </button>
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

const NamePage = ({
  handleCloseName,
  userFullName,
  setUserFullName,
  updateName,
}) => {
  const clearNewname = () => {
    setUserFullName("");
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 px-2 py-3">
        <div className="w-full flex gap-2 items-center">
          <IoArrowUndo onClick={handleCloseName} />
          <h1>Change Name</h1>
        </div>
        <div className="w-full">
          <p className="text-zinc-500 text-sm">
            Please use real name to make it easy for verification. This name
            will appear in a few page.
          </p>
        </div>
        <div className="relative">
          <div className="flex w-full items-center px-5 rounded-lg border border-zinc-500 py-2.5">
            <input
              type="text"
              placeholder="Fullname"
              className="flex-1 outline-none text-lg"
              value={userFullName}
              onChange={(e) => {
                setUserFullName(e.target.value);
              }}
            />
            <IoIosCloseCircle
              className="text-zinc-700 text-lg"
              onClick={clearNewname}
            />
          </div>
          <div className="p-1 bg-white font-semibold text-zinc-500 rounded-md text-xs left-3 -top-2 absolute">
            Name
          </div>
        </div>
        <div className="w-full flex">
          <button
            className="w-full py-3 shadow-md bg-[#032ea1] rounded-md text-white font-semibold"
            onClick={updateName}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

const NumberPage = ({
  handleCloseNumber,
  userNumber,
  setUserNumber,
  updateNumber,
}) => {
  const clearNewNumber = () => {
    setUserNumber("");
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 px-2 py-3">
        <div className="w-full flex gap-2 items-center">
          <IoArrowUndo onClick={handleCloseNumber} />
          <h1>Change Phone Number</h1>
        </div>
        <div className="w-full">
          <p className="text-zinc-500 text-sm">add your new phone number</p>
        </div>
        <div className="relative">
          <div className="flex w-full items-center px-5 rounded-lg border border-zinc-500 py-2.5">
            <input
              type="text"
              placeholder="Fullname"
              className="flex-1 outline-none text-lg"
              value={userNumber}
              onChange={(e) => {
                setUserNumber(e.target.value);
              }}
            />
            <IoIosCloseCircle
              className="text-zinc-700 text-lg"
              onClick={clearNewNumber}
            />
          </div>
          <div className="p-1 bg-white font-semibold text-zinc-500 rounded-md text-xs left-3 -top-2 absolute">
            Phone Number
          </div>
        </div>
        <div className="w-full flex">
          <button
            className="w-full py-3 shadow-md bg-[#032ea1] rounded-md text-white font-semibold"
            onClick={updateNumber}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

const EmailPage = ({
  handleCloseEmail,
  userEmail,
  setUserEmail,
  updateEmail,
}) => {
  const clearNewEmail = () => {
    setUserEmail("");
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 px-2 py-3">
        <div className="w-full flex gap-2 items-center">
          <IoArrowUndo onClick={handleCloseEmail} />
          <h1>Change Email</h1>
        </div>
        <div className="w-full">
          <p className="text-zinc-500 text-sm">add your new email</p>
        </div>
        <div className="relative">
          <div className="flex w-full items-center px-5 rounded-lg border border-zinc-500 py-2.5">
            <input
              type="text"
              placeholder="Fullname"
              className="flex-1 outline-none text-lg"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />
            <IoIosCloseCircle
              className="text-zinc-700 text-lg"
              onClick={clearNewEmail}
            />
          </div>
          <div className="p-1 bg-white font-semibold text-zinc-500 rounded-md text-xs left-3 -top-2 absolute">
            Email
          </div>
        </div>
        <div className="w-full flex">
          <button
            className="w-full py-3 shadow-md bg-[#032ea1] rounded-md text-white font-semibold"
            onClick={updateEmail}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

const GenderPage = ({ handleCloseGender, setUserGender, updateGender }) => {
  return (
    <>
      <div className="w-full flex flex-col gap-4 px-2 py-3">
        <div className="w-full flex gap-2 items-center">
          <IoArrowUndo onClick={handleCloseGender} />
          <h1>Change Gender</h1>
        </div>
        <div className="w-full">
          <p className="text-zinc-500 text-sm">add your gender</p>
        </div>
        <div className="relative">
          <div className="flex w-full items-center px-5 rounded-lg border border-zinc-500 py-2.5">
            <select
              name="gender"
              id="gender"
              onChange={(e) => {
                setUserGender(e.target.value);
              }}
              className="flex-1 outline-none text-lg"
            >
              <option value="">Choosse a gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="p-1 bg-white font-semibold text-zinc-500 rounded-md text-xs left-3 -top-2 absolute">
            Gender
          </div>
        </div>
        <div className="w-full flex">
          <button
            className="w-full py-3 shadow-md bg-[#032ea1] rounded-md text-white font-semibold"
            onClick={updateGender}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

const BirthdayPage = ({
  handleCloseBirthday,
  setUserBirthday,
  updateBirthday,
}) => {
  return (
    <>
      <div className="w-full flex flex-col gap-4 px-2 py-3">
        <div className="w-full flex gap-2 items-center">
          <IoArrowUndo onClick={handleCloseBirthday} />
          <h1>Change Birthday</h1>
        </div>
        <div className="w-full">
          <p className="text-zinc-500 text-sm">add your Birthday</p>
        </div>
        <div className="relative">
          <div className="flex w-full items-center px-5 rounded-lg border border-zinc-500 py-2.5">
            <input
              type="date"
              name="birthday"
              id="birthday"
              className="flex-1 outline-none text-lg"
              onChange={(e) => {
                setUserBirthday(e.target.value);
              }}
            />
          </div>
          <div className="p-1 bg-white font-semibold text-zinc-500 rounded-md text-xs left-3 -top-2 absolute">
            Birthday
          </div>
        </div>
        <div className="w-full flex">
          <button
            className="w-full py-3 shadow-md bg-[#032ea1] rounded-md text-white font-semibold"
            onClick={updateBirthday}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};
