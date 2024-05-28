import { TiArrowBackOutline } from "react-icons/ti";
import {
  PiPackageDuotone,
  PiWalletDuotone,
  PiAirplaneTiltDuotone,
  PiDropboxLogo,
} from "react-icons/pi";
import { IoCloudDoneOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { LuHistory } from "react-icons/lu";
import { MdStar } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";
import { StringTruncate } from "../utils";

export default function Orders() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const [dataOrders, setDataOrders] = useState([]);
  const [menu, setMenu] = useState("pending");
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [paymentPendingCheck, setPaymentPendingCheck] = useState("");
  const [ratingStyle, setRatingStyle] = useState("scale-0");
  const [idProductRate, setIdProductRate] = useState("");
  const [idOrderItemRate, setIdOrderItemRate] = useState("");
  const [productStarName, setProductStarName] = useState("");

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
    setLoading(true);
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
    } else if (status === "request" && menu === "request") {
      getData();
    } else if (status === "shipping" && menu === "shipping") {
      getData();
    } else if (status === "completed" && menu === "completed") {
      getData();
    } else if (status === "history" && menu === "history") {
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
    setStatus("request");
    setMenu("request");
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

  const handleClickHistory = () => {
    setStatus("history");
    setMenu("history");
    setLoading(true);
  };

  const giveStar = (id_product, order_item_id, name_product) => {
    setRatingStyle("scale-100");
    setIdProductRate(id_product);
    setIdOrderItemRate(order_item_id);
    setProductStarName(name_product);
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
            className="flex flex-col items-center cursor-pointer"
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
            className="flex flex-col items-center cursor-pointer"
            onClick={handleClickPackaged}
          >
            <PiPackageDuotone
              className={`text-2xl ${
                menu === "request" ? "text-blue-500" : ""
              }`}
            />
            <span className="text-xs">Packaged</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
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
            className="flex flex-col items-center cursor-pointer" 
            onClick={handleClickCompleted}
          >
            <IoCloudDoneOutline
              className={`text-2xl ${
                menu === "completed" ? "text-blue-500" : ""
              }`}
            />
            <span className="text-xs">Finished</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleClickHistory}
          >
            <LuHistory
              className={`text-2xl ${
                menu === "history" ? "text-blue-500" : ""
              }`}
            />
            <span className="text-xs">History</span>
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
            <DataList
              dataOrders={dataOrders}
              baseUrl={baseUrl}
              getData={getData}
              giveStar={giveStar}
            />
          )}
        </div>
        <div
          className={`fixed w-full min-h-screen z-20 bg-zinc-600 bg-opacity-80 flex justify-center items-center top-0 px-2 ${ratingStyle} duration-100`}
        >
          <StarRate
            baseUrl={baseUrl}
            idProductRate={idProductRate}
            username={username}
            idOrderItemRate={idOrderItemRate}
            setRatingStyle={setRatingStyle}
            getData={getData}
            setStatus={setStatus}
            productStarName={productStarName}
          />
        </div>
      </div>
    </>
  );
}

const DataList = ({ dataOrders, baseUrl, getData, giveStar }) => {
  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function copyText(value) {
    navigator.clipboard.writeText(value);
    alert("delivery receipt copied!");
  }

  const handleClickOrderAccept = (id) => {
    Axios.put(`${baseUrl}/api/client/acceptorder/${id}`).then((response) => {
      if (response.data.success) {
        getData("shipping");
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("Error Occured!");
      }
    });
  };

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
              <div className="w-full px-1 flex justify-between border-b py-1">
                <h1 className="font-semibold truncate">{data.store_name}</h1>
                {data.carrier ? (
                  <div
                    className="flex gap-0.5 items-center"
                    onClick={() => {
                      copyText(data.tracking_number);
                    }}
                  >
                    <p className="text-blue-500 font-semibold text-sm">
                      {data.carrier}, {data.tracking_number}
                    </p>
                    <MdContentCopy />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="w-full flex gap-2 justify-between border-b py-2 px-1">
                <a href={`/product/${data.id_product}`}>
                  <img
                    src={`${baseUrl}/${data.img}`}
                    alt={data.name}
                    className="w-10 h-10"
                  />
                </a>
                <div className="flex-1 text-sm">
                  {StringTruncate(data.name)}
                  <p className="text-xs text-zinc-600">
                    {data.additional_info}
                  </p>
                </div>
                <div>
                  <div className="text-zinc-600 text-xs">x{data.quantity}</div>
                  <div className="text-sm text-blue-500">
                    <p>
                      {dollar.format(
                        data.price - data.price * (data.discount / 100)
                      )}
                    </p>
                    <p
                      className={
                        data.discount < 1
                          ? "hidden"
                          : "text-zinc-600 font-light text-xs line-through"
                      }
                    >
                      {dollar.format(data.price)}
                    </p>
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
                    {dollar.format(
                      (data.price - data.price * (data.discount / 100)) *
                        data.quantity
                    )}
                  </span>
                </div>
              </div>
              <div className="flex">
                {data.carrier ? (
                  <div className="flex w-full justify-end items-center gap-1">
                    <p className="text-xs">
                      Your order already arrived? Click {">>"}
                    </p>
                    <button
                      className="py-0.5 px-2 rounded-md bg-blue-500 text-white font-semibold"
                      onClick={() => {
                        const confirm = window.confirm(
                          "Has your order arrived?"
                        );
                        if (confirm) {
                          handleClickOrderAccept(data.order_item_id);
                        }
                      }}
                    >
                      Order Accepted
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex">
                {data.status_oi === "completed" ? (
                  <div className="flex w-full justify-end items-center gap-1">
                    <button
                      className="py-0.5 px-2 rounded-md bg-blue-500 text-white font-semibold"
                      onClick={() =>
                        giveStar(data.product_id, data.order_item_id, data.name)
                      }
                    >
                      Give a star
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const StarRate = ({
  baseUrl,
  username,
  idProductRate,
  idOrderItemRate,
  setRatingStyle,
  getData,
  productStarName,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await Axios.post(`${baseUrl}/api/client/rating`, {
        rating: rating,
        comment: comment,
        username: username,
        idProductRate: idProductRate,
        idOrderItemRate: idOrderItemRate,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.data.success) {
        alert(response.data.success);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Error occured!");
      }

      setLoading(false);
      setRatingStyle("scale-0");
      setRating(0);
      setComment("");
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (value) => {
    setRating(value);
  };

  return (
    <>
      <div className="w-full py-2 rounded-md shadow bg-white flex flex-col gap-2">
        <div className="px-2 w-full flex justify-between">
          <h1 className="font-semibold">{StringTruncate(productStarName)}</h1>
          <ImCancelCircle onClick={() => setRatingStyle("scale-0")} />
        </div>
        <div
          id="ratings"
          className="w-full flex flex-row-reverse gap-1 justify-center"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <MdStar
              key={value}
              id="star"
              className={
                value <= rating
                  ? "text-yellow-400 text-xl"
                  : "text-gray-400 text-xl"
              }
              onClick={() => handleClick(value)}
            />
          ))}
        </div>
        <div className="w-full px-2">
          <textarea
            name="comment"
            id="comment"
            className="w-full border rounded outline-none p-1 text-sm"
            placeholder="Type comment here..."
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="w-full px-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-md w-20 h-7 flex justify-center items-center text-white bg-blue-400 font-semibold shadow shadow-black active:scale-95 duration-150"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </>
  );
};
