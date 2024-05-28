import { useEffect, useState } from "react";
import { IoArrowUndo } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function CreateStore() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userLogin = localStorage.getItem("username");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  const createStore = () => {
    Axios.post(`${baseUrl}/api/client/createstore`, {
      username: userLogin,
      storeName: storeName,
      description: description,
      category: category,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Server Error! Try Again Later");
      }
    });
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
            setCategory={setCategory}
            createStore={createStore}
          />
        </div>
      </div>
    </>
  );
}

const FormDataStore = ({
  setStoreName,
  setDescription,
  setCategory,
  createStore,
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
        <input
          type="text"
          placeholder="Store Description"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <select
          name="category"
          id="category"
          className="border-2 p-2 rounded-md w-full outline-none"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">Select Category</option>
          <option value="Clothes">Clothes</option>
          <option value="Gadget">Gadget</option>
          <option value="Books">Books</option>
          <option value="Sports">Sports</option>
          <option value="Kitchen">Kitchen</option>
        </select>
        <button
          className="py-2 w-full rounded-md shadow bg-[#032ea1] text-white font-semibold"
          onClick={createStore}
        >
          Create Store
        </button>
      </div>
    </>
  );
};
