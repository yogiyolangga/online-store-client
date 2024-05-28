import { useEffect, useState } from "react";
import { CiUser, CiLock, CiPhone, CiMail } from "react-icons/ci";
import { PiEyeSlashThin } from "react-icons/pi";
import { SlEye } from "react-icons/sl";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";

export default function RegisterMobile() {
  return (
    <>
      <div className="min-h-screen w-full bg-white relative z-20 px-4">
        <div className="w-full py-4 flex justify-center items-center">
          <img src="assets/img/register.png" alt="Register" className="w-44" />
        </div>
        <div className="w-full flex flex-col gap-1 ">
          <h1 className="font-bold text-3xl">Register</h1>
          <p className="font-semibold text-sm">Please register to login.</p>
        </div>
        <FormRegis />
      </div>
    </>
  );
}

const FormRegis = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validatePasswordStatus, setValidatePasswordStatus] =
    useState("hidden");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(true);
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(true);
  };

  const handleHideConfirmPassword = () => {
    setShowConfirmPassword(false);
  };

  function validatePasswords() {
    if (password != confirmPassword) {
      setValidatePasswordStatus("");
    } else {
      setValidatePasswordStatus("hidden");
    }
  }

  const [validationErrorInfo, setValidationErrorInfo] = useState([]);

  function validationRegisterForm() {
    let errors = [];

    if (fullname.trim() === "") {
      errors.push("Full name field cannot be empty.");
    }

    if (username.trim() === "") {
      errors.push("Username field can't be empty.");
    }

    if (phoneNumber.trim() === "") {
      errors.push("Phone number field is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Give the valid email");
    }

    if (password.length < 8) {
      errors.push("The password must contain at least 8 characters");
    }

    if (password != confirmPassword) {
      errors.push("Password not match");
    }

    if (errors.length > 0) {
      setValidationErrorInfo(errors);
      return false;
    }
    setValidationErrorInfo([]);
    return true;
  }

  useEffect(() => {}, [validationErrorInfo]);

  const [registerInfo, setRegisterInfo] = useState("");

  const onSubmitForm = async () => {
    const isValid = validationRegisterForm();

    if (isValid) {
      setLoading(true);
      try {
        const response = await Axios.post(`${baseUrl}/api/client/register`, {
          fullname: fullname,
          username: username,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (response.data.errorValidation) {
          setRegisterInfo(response.data.errorValidation);
        } else if (response.data.success) {
          alert(response.data.success);
          navigate("/login");
        } else {
          setRegisterInfo("Server might error!");
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setRegisterInfo("Server error occurred!");
      }
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center text-xs text-red-500">
        {validationErrorInfo.map((val, index) => (
          <p key={index}>{val}</p>
        ))}
        <p className="">{registerInfo}</p>
      </div>
      <div className="w-full flex flex-col gap-4 items-center py-5">
        <div className="flex bg-zinc-200 rounded-3xl w-full items-center py-2 px-4 gap-2">
          <CiUser className="text-lg" />
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Fullname"
            className="outline-none bg-zinc-200 flex-1"
            onChange={(e) => {
              setFullname(e.target.value);
            }}
          />
        </div>
        <div className="flex bg-zinc-200 rounded-3xl w-full items-center py-2 px-4 gap-2">
          <CiUser className="text-lg" />
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="outline-none bg-zinc-200 flex-1"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="flex bg-zinc-200 rounded-3xl w-full items-center py-2 px-4 gap-2">
          <CiPhone className="text-lg" />
          <input
            type="number"
            name="phonenumber"
            id="phonenumber"
            placeholder="Phone Number"
            className="outline-none bg-zinc-200 flex-1"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
        </div>
        <div className="flex bg-zinc-200 rounded-3xl w-full items-center py-2 px-4 gap-2">
          <CiMail className="text-lg" />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email@email.com"
            className="outline-none bg-zinc-200 flex-1"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="flex bg-zinc-200 rounded-3xl w-full items-center py-2 px-4 gap-2">
          <CiLock className="text-lg" />
          <input
            type={showPassword === false ? "password" : "text"}
            name="password"
            id="password"
            placeholder="Password"
            className="outline-none bg-zinc-200 flex-1"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <PiEyeSlashThin
            onClick={handleHidePassword}
            className={`text-lg ${showPassword === false ? "hidden" : ""}`}
          />
          <SlEye
            onClick={handleShowPassword}
            className={`text-lg ${showPassword === true ? "hidden" : ""}`}
          />
        </div>
        <div
          className={`flex bg-zinc-200 rounded-3xl w-full items-center py-2 px-4 gap-2 ${
            password != confirmPassword ? "border border-red-500" : ""
          }`}
        >
          <CiLock className="text-lg" />
          <input
            type={showConfirmPassword === false ? "password" : "text"}
            name="confirmpassword"
            id="confirmpassword"
            placeholder="Confirm Password"
            className="outline-none bg-zinc-200 flex-1"
            onBlur={validatePasswords}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <PiEyeSlashThin
            onClick={handleHideConfirmPassword}
            className={`text-lg ${
              showConfirmPassword === false ? "hidden" : ""
            }`}
          />
          <SlEye
            onClick={handleShowConfirmPassword}
            className={`text-lg ${
              showConfirmPassword === true ? "hidden" : ""
            }`}
          />
        </div>
        <p className={`text-xs text-red-500 ${validatePasswordStatus}`}>
          Passwords do not match
        </p>
        <div className="w-full">
          <button
            className="w-full h-10 rounded-3xl bg-[#032ea1] shadow shadow-black font-semibold py-2 text-white active:scale-95 duration-75 flex justify-center items-center"
            onClick={onSubmitForm}
          >
            {loading ? (
              <ImSpinner2 className="text-lg animate-spin" />
            ) : (
              <p>Sign Up</p>
            )}
          </button>
        </div>
        <div>
          <p>
            Already have account?{" "}
            <a href="/login" className="text-[#032ea1] font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
