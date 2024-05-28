import { useEffect, useState } from "react";
import { CiUser, CiLock } from "react-icons/ci";
import { PiEyeSlashThin } from "react-icons/pi";
import { SlEye } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import Axios from "axios";

export default function LoginUserMobile() {
  return (
    <>
      <div className="min-h-screen w-full bg-white relative z-20 px-4">
        <div className="w-full py-10 flex justify-center items-center">
          <img src="assets/img/login.jpg" alt="Register" className="w-full" />
        </div>
        <div className="w-full flex flex-col gap-1 ">
          <h1 className="font-bold text-3xl">Login</h1>
          <p className="font-semibold text-sm">Please Sign in to continue.</p>
        </div>
        <FormLogin />
      </div>
    </>
  );
}

const FormLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleShowPassword = () => {
    setShowPassword(true);
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  const loginSubmit = async () => {
    setLoading(true);

    try {
      const response = await Axios.post(`${baseUrl}/api/client/login`, {
        username: username,
        password: password,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        response.status === 200 &&
        response.data.success === "Login successfully"
      ) {
        setLoginStatus(true);
        setLoginInvalid("");
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("/");
      } else {
        setLoginInvalid(response.data.error);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-4 items-center py-5">
        <p className="text-xs font-light text-red-500">{loginInvalid}</p>
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
        <div className="w-full flex justify-start px-2">
          <a href="/forgotpassword" className="text-xs font-semibold">
            Forgot Password ?
          </a>
        </div>
        <div className="w-full">
          <button
            className="w-full h-10 rounded-3xl bg-[#032ea1] shadow shadow-black font-semibold py-2 text-white active:scale-95 duration-75 flex justify-center items-center"
            onClick={loginSubmit}
          >
            {loading ? (
              <ImSpinner2 className="text-lg animate-spin" />
            ) : (
              <p>Sign In</p>
            )}
          </button>
        </div>
        <div>
          <p>
            Don't have account?{" "}
            <a href="/register" className="text-[#032ea1] font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
