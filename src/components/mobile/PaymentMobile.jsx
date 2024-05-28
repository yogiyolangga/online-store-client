import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [dataPayment, setDataPayment] = useState([]);
  const username = localStorage.getItem("username");
  const [ordersId, setOrdersId] = useState("");
  const navigate = useNavigate();

  const getData = () => {
    Axios.get(`${baseUrl}/api/client/buyer/payment/${username}`).then(
      (response) => {
        if (response.data.success) {
          setDataPayment(response.data.result);
          setOrdersId(response.data.result[0].order_id);
        } else if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Server Might Die");
        }
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const formatDate = (originalDate) => {
    const dateObject = new Date(originalDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const confirmPay = () => {
    Axios.put(`${baseUrl}/api/client/buyer/confirm/${username}`, {
      ordersId: ordersId,
    }).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account/orders");
      } else {
        alert("Try again later");
      }
    });
  };

  return (
    <>
      <div className="w-full py-10">
        <div className="w-full flex flex-col px-2">
          {dataPayment.length < 1 ? (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full text-center">
                Nothing order need to pay
              </div>
              <a href="/account/orders" className="text-blue-500 font-semibold">
                Back
              </a>
            </div>
          ) : (
            <div>
              <div className="w-full flex gap-2 py-1 items-center">
                <p className="text-sm text-zinc-400">order date :</p>
                <div className="text-sm text-zinc-400">
                  {formatDate(dataPayment[0].order_date)}
                </div>
              </div>
              <div className="w-full flex flex-col py-5 gap-2 items-center justify-center">
                <div className="font-semibold text-zinc-600">
                  {dataPayment[0].payment_method}
                </div>
                <div className="text-3xl text-blue-500">
                  {dataPayment[0].bank_number}
                </div>
                <div className="text-xl text-zinc-700">
                  {dataPayment[0].name}
                </div>
                <div className="text-sm text-zinc-400">
                  total payment :{" "}
                  <span className="text-black font-semibold text-2xl">
                    {dollar.format(dataPayment[0].total_price)}
                  </span>
                </div>
                <div className="py-3">
                  <button
                    className="py-2 bg-blue-500 px-2 rounded font-semibold text-white shadow shadow-black"
                    onClick={confirmPay}
                  >
                    Payment Confirmation
                  </button>
                </div>
                <div className="w-full flex py-5 justify-center">
                  <img
                    src="assets/img/payment.png"
                    alt="Payment"
                    className="w-80"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
