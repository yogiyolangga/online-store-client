import { useEffect, useState } from "react";
import { IoArrowUndo } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { ImSpinner2 } from "react-icons/im";

export default function CreateStore() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userLogin = localStorage.getItem("username");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  const createStore = async () => {
    setLoading(true);
    try {
      const response = await Axios.post(`${baseUrl}/api/client/createstore`, {
        username: userLogin,
        storeName: storeName,
        description: description,
        address: address,
        phone: phone,
        email: email,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Server Error! Try Again Later");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full px-2 py-4">
        <div className="w-full flex gap-2 items-center border-b">
          <IoArrowUndo
            onClick={() => {
              navigate("/account");
            }}
          />
          <h1 className="font-bold text-lg">Create your store here</h1>
        </div>
        <div>
          <FormDataStore
            setStoreName={setStoreName}
            setDescription={setDescription}
            setAddress={setAddress}
            setEmail={setEmail}
            setPhone={setPhone}
            createStore={createStore}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}

const FormDataStore = ({
  setStoreName,
  setDescription,
  setAddress,
  setPhone,
  setEmail,
  createStore,
  loading,
}) => {
  return (
    <>
      <div className="w-full p-4 flex flex-col gap-5">
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Store Name"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setStoreName(e.target.value);
          }}
        />
        <textarea
          name="desc"
          id="desc"
          placeholder="Store Description"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        ></textarea>
        <textarea
          name="address"
          id="address"
          placeholder="Store Address"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        ></textarea>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="Phone Number"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <button
          className="w-full h-10 rounded-3xl bg-[#032ea1] shadow shadow-black font-semibold py-2 text-white active:scale-95 duration-75 flex justify-center items-center"
          onClick={createStore}
        >
          {loading ? (
            <ImSpinner2 className="text-lg animate-spin" />
          ) : (
            <p>Create Store</p>
          )}
        </button>
      </div>
    </>
  );
};
