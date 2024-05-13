import { TiArrowBackOutline } from "react-icons/ti";
import {
  PiPackageDuotone,
  PiWalletDuotone,
  PiAirplaneTiltDuotone,
  PiDropboxLogo,
} from "react-icons/pi";
import { IoCloudDoneOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";

export default function Orders() {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000";
  const [dataOrders, setDataOrders] = useState([]);
  const [menu, setMenu] = useState("pending");
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [paymentPendingCheck, setPaymentPendingCheck] = useState("");

  // const getData = () => {
  //   setTimeout(() => {
  //     Axios.get(
  //       `${baseUrl}/api/client/buyer/orders/${username}?status=${status}`
  //     ).then((response) => {
  //       if (response.data.success) {
  //         setDataOrders(response.data.result);
  //       } else if (response.data.error) {
  //         console.log(response.data.error);
  //       } else {
  //         alert("Error, try again later!");
  //         console.log("Server might die!");
  //       }
  //     });
  //     setLoading(false);
  //   }, 1500);
  // };

  // chatGPT
  const getData = async () => {
    try {
      const response = await Axios.get(
        `${baseUrl}/api/client/buyer/orders/${username}?status=${status}`
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.data.success) {
        setDataOrders(response.data.result);
        if (response.data.result.length > 0) {
          setPaymentPendingCheck(response.data.result[0].status);
        } else {
          setPaymentPendingCheck("");
        }
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        alert("Error, try again later!");
        console.log("Server might die!");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    if (status === "pending" && menu === "pending") {
      getData();
    } else if (status === "paid" && menu === "paid") {
      getData();
    } else if (status === "shipping" && menu === "shipping") {
      getData();
    } else if (status === "completed" && menu === "completed") {
      getData();
    } else {
      console.log("No data");
    }
  }, [status, menu]);

  const handleClickPending = () => {
    setStatus("pending");
    setMenu("pending");
    setLoading(true);
  };

  const handleClickPackaged = () => {
    setStatus("paid");
    setMenu("paid");
    setLoading(true);
  };

  const handleClickShipping = () => {
    setStatus("shipping");
    setMenu("shipping");
    setLoading(true);
  };

  const handleClickCompleted = () => {
    setStatus("completed");
    setMenu("completed");
    setLoading(true);
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full px-2 py-2 flex gap-2 items-center">
          <TiArrowBackOutline
            className="text-lg"
            onClick={() => navigate("/account")}
          />
          <h1 className="font-bold">My Orders</h1>
          {paymentPendingCheck === "pending" ? (
            <div className="flex-1 flex justify-end px-2">
              <a href="/payment" className="font-semibold text-blue-500">
                Waiting for payment
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full py-2 flex justify-evenly border-b">
          <div
            className="flex flex-col items-center"
            onClick={handleClickPending}
          >
            <PiWalletDuotone
              className={`text-2xl ${
                menu === "pending" ? "text-blue-500" : ""
              }`}
            />
            <span className="text-xs">Not yet paid</span>
          </div>
          <div
            className="flex flex-col items-center"
            onClick={handleClickPackaged}
          >
            <PiPackageDuotone
              className={`text-2xl ${menu === "paid" ? "text-blue-500" : ""}`}
            />
            <span className="text-xs">Packaged</span>
          </div>
          <div
            className="flex flex-col items-center"
            onClick={handleClickShipping}
          >
            <PiAirplaneTiltDuotone
              className={`text-2xl ${
                menu === "shipping" ? "text-blue-500" : ""
              }`}
            />
            <span className="text-xs">Shipping</span>
          </div>
          <div
            className="flex flex-col items-center"
            onClick={handleClickCompleted}
          >
            <IoCloudDoneOutline
              className={`text-2xl ${
                menu === "completed" ? "text-blue-500" : ""
              }`}
            />
            <span className="text-xs">Finished</span>
          </div>
        </div>
        <div className="w-full pb-20">
          {loading === true ? (
            <div className="w-full py-8 flex flex-col items-center gap-2">
              <AiOutlineLoading3Quarters className="animate-spin" />
              <p
                className="text-zinc-700
              "
              >
                Loading
              </p>
            </div>
          ) : (
            <DataList dataOrders={dataOrders} baseUrl={baseUrl} />
          )}
        </div>
      </div>
    </>
  );
}

const DataList = ({ dataOrders, baseUrl }) => {
  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function StringTruncate(string, maxLength = 25) {
    if (string.length <= maxLength) {
      return string;
    } else {
      return string.substring(0, maxLength) + "...";
    }
  }
  return (
    <>
      <div className="w-full pt-2 flex flex-col items-center gap-2 bg-zinc-200">
        {dataOrders.length < 1 ? (
          <div className="w-full bg-white py-2 flex flex-col items-center gap-2">
            <PiDropboxLogo className="text-3xl" />
            <p className="text-zinc-500">Empty here</p>
          </div>
        ) : (
          dataOrders.map((data, index) => (
            <div key={index} className="w-full flec flex-col bg-white p-1">
              <div className="w-full font-semibold truncate border-b py-1">
                {data.store_name}
              </div>
              <div className="w-full flex gap-2 justify-between border-b py-2 px-1">
                <a href={`/product/${data.id_product}`}>
                  <img
                    src={`${baseUrl}/${data.img}`}
                    alt={data.name}
                    className="w-10 h-10"
                  />
                </a>
                <div className="flex-1 text-sm">{data.name}</div>
                <div>
                  <div className="text-zinc-600 text-xs">x{data.quantity}</div>
                  <div className="text-sm text-blue-500">
                    {dollar.format(data.price)}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between px-1 py-0.5">
                <div className="text-zinc-300 text-sm">
                  {data.quantity} product
                </div>
                <div className="text-sm font-semibold">
                  Total Order:{" "}
                  <span className="text-blue-500">
                    {dollar.format(data.price * data.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
