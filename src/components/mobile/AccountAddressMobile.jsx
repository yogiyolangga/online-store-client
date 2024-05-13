import { IoArrowUndo } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";

export default function AddressMobile() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const token = localStorage.getItem("accessToken");
  const userLogin = localStorage.getItem("username");
  const baseUrl = "http://localhost:3000";

  const fetchAddress = () => {
    Axios.get(`${baseUrl}/api/client/address/${userLogin}`).then((response) => {
      if (response.data.success) {
        setAddress(response.data.result[0].address);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Server Error!");
      }
    });
  };

  useEffect(() => {
    if (token != null) {
      fetchAddress();
    } else {
      navigate("/login");
    }
  }, []);

  const onSubmitForm = () => {
    Axios.put(`${baseUrl}/api/client/address/${userLogin}`, {
      address: address,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Server might error!");
      }
    });
  };

  return (
    <>
      <div className="w-full py-4 px-2 bg-white">
        <div className="w-full flex items-center gap-2">
          <IoArrowUndo onClick={() => navigate("/account")} />
          <h1 className="font-bold text-lg">My Address</h1>
        </div>
        <div className="w-full">
          <FormAddress
            address={address}
            setAddress={setAddress}
            onSubmitForm={onSubmitForm}
          />
        </div>
      </div>
    </>
  );
}

const FormAddress = ({ address, setAddress, onSubmitForm }) => {
  return (
    <>
      <div className="w-full px-2 py-4 flex justify-center flex-col gap-2">
        <textarea
          name="address"
          id="address"
          cols="30"
          rows="8"
          className="w-full border-2 rounded-md text-sm"
          placeholder="(example) : Second building, Third Floor, of Cambodian Ministry of Commerce: Lot 19-61, MoC Road (113B Road), Turn in from Russian Blvd, Phum Teuk Thla, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia."
          value={address === null ? "" : address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        ></textarea>
        <div className="w-full flex gap-2 px-2">
          <input type="checkbox" name="" id="" />
          <p>I confirm this is real address</p>
        </div>
        <button
          className="py-2 w-full bg-[#032ea1] text-white font-semibold rounded-md shadow"
          onClick={onSubmitForm}
        >
          Save Address
        </button>
      </div>
    </>
  );
};
