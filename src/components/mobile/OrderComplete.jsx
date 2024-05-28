import { useEffect, useState } from "react";
import Axios from "axios";
import { IoArrowUndo } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function OrderComplete() {
  const [dataOrder, setDataOrder] = useState([]);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("username");

  const getData = () => {
    Axios.get(`${baseUrl}/api/client/sellercomplete/${userLogin}`).then(
      (response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else if (response.data.success) {
          setDataOrder(response.data.result);
        } else {
          console.log("Something error");
        }
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-center p-2">
          <IoArrowUndo onClick={() => navigate("/account/store")} />
          <h1 className="text-2xl font-bold ml-2">Order Shipped</h1>
        </div>
        <div>
          {dataOrder.length < 1 ? (
            <p className="text-center">empty data!</p>
          ) : (
            <DataOrder dataOrder={dataOrder} baseUrl={baseUrl} />
          )}
        </div>
      </div>
    </>
  );
}

const DataOrder = ({ dataOrder, baseUrl }) => {
  function truncate(str) {
    if (str.length > 20) {
      return str.substring(0, 20) + "...";
    } else {
      return str;
    }
  }

  return (
    <>
      <div className="w-full py-2 px-4">
        {dataOrder.map((item, index) => (
          <div
            key={index}
            className="w-full flex justify-evenly items-center gap-2 bg-zinc-200 px-2 rounded py-1"
          >
            <div className="">
              <img
                src={`${baseUrl}/${item.img}`}
                alt={item.name}
                className="w-12 h-12"
              />
            </div>
            <div className="flex flex-col items-start justify-center flex-1">
              <h1 className="font-bold ">{truncate(item.name)}</h1>
              <p className="text-xs text-zinc-700">{`x${item.quantity}, ${item.product_info}`}</p>
            </div>
            <div></div>
          </div>
        ))}
      </div>
    </>
  );
};
