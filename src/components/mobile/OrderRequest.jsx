import { useEffect, useState } from "react";
import Axios from "axios";
import { IoArrowUndo } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function OrderRequest() {
  const [dataOrder, setDataOrder] = useState([]);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("username");
  const [detailsStyle, setDetailsStyle] = useState("scale-0");
  const [detailsOneProduct, setDetailsOneProduct] = useState([]);

  const getData = () => {
    Axios.get(`${baseUrl}/api/client/seller/${userLogin}`).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        setDataOrder(response.data.result);
      } else {
        console.log("Something error");
      }
    });
  };

  const handleClickDetails = (index) => {
    setDetailsOneProduct(dataOrder[index]);
    setDetailsStyle("scale-100");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="w-full relative">
        <div className="w-full flex items-center p-2">
          <IoArrowUndo onClick={() => navigate("/account/store")} />
          <h1 className="text-2xl font-bold ml-2">Order Request</h1>
        </div>
        <div>
          {dataOrder.length < 1 ? (
            <p className="text-center">Data not found!</p>
          ) : (
            <DataOrder
              dataOrder={dataOrder}
              baseUrl={baseUrl}
              handleClickDetails={handleClickDetails}
            />
          )}
        </div>
        <div
          className={`absolute w-full top-0 bg-zinc-600 min-h-screen z-10 bg-opacity-25 flex items-center justify-center p-2 duration-150 ${detailsStyle}`}
        >
          <DetailsProduct
            detailsOneProduct={detailsOneProduct}
            setDetailsStyle={setDetailsStyle}
            baseUrl={baseUrl}
            navigate={navigate}
          />
        </div>
      </div>
    </>
  );
}

const DataOrder = ({ dataOrder, baseUrl, handleClickDetails }) => {
  function truncate(str) {
    if (str.length > 20) {
      return str.substring(0, 20) + "..."; // Mengambil karakter dari indeks 0 hingga 7 dan menambahkan "..."
    } else {
      return str; // Mengembalikan string asli jika panjangnya kurang dari atau sama dengan 8 karakter
    }
  }

  return (
    <>
      <div className="w-full py-2 px-4 flex flex-col gap-2">
        {dataOrder.map((item, index) => (
          <div
            key={index}
            className="w-full flex justify-evenly items-center gap-2 shadow bg-zinc-200 px-2 rounded py-1"
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
            <div>
              <button
                className="bg-blue-500 px-2 py-1 rounded text-white font-semibold"
                onClick={() => handleClickDetails(index)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const DetailsProduct = ({
  detailsOneProduct,
  setDetailsStyle,
  baseUrl,
  navigate,
}) => {
  const [carrier, setCarrier] = useState("");
  const [resi, setResi] = useState("");
  const [otherCarrierStyle, setOtherCarrierStyle] = useState("hidden");

  useEffect(() => {
    if (carrier === "other") {
      setOtherCarrierStyle("");
    } else if (carrier === "J&T" || carrier === "Virak Buntham") {
      setOtherCarrierStyle("hidden");
    }
  }, [carrier, setOtherCarrierStyle]);

  const shippingSubmit = async () => {
    try {
      const response = await Axios.post(`${baseUrl}/api/seller/shipping`, {
        order_id: detailsOneProduct.order_id,
        order_item_id: detailsOneProduct.order_item_id,
        carrier: carrier,
        resi: resi,
        address: detailsOneProduct.shipping_address,
      });

      if (response.data.error) {
        alert(response.data.error);
      } else if (response.data.success) {
        alert(response.data.success);
        navigate("/account/store");
      } else {
        alert("Try again later");
      }

      setDetailsStyle("scale-0");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2 justify-center p-4 rounded-md bg-zinc-900 text-white">
        <div className="w-full flex font-bold text-lg">
          <h1>{detailsOneProduct.name}</h1>
        </div>
        <div className="w-full flex justify-between gap-2">
          <h2 className="text-sm">Quantity</h2>
          <p>x{detailsOneProduct.quantity}</p>
        </div>
        <div className="w-full flex justify-between gap-2">
          <h2 className="">Info</h2>
          <p className="text-right text-sm">{detailsOneProduct.product_info}</p>
        </div>
        <div className="w-full flex justify-between gap-2">
          <h2>Address</h2>
          <p className="text-right text-xs">
            {detailsOneProduct.shipping_address}
          </p>
        </div>
        <div className="w-full flex justify-between gap-2">
          <h2>Carrier</h2>
          <select
            name="delivery-service"
            id="delivery-service"
            onChange={(e) => {
              setCarrier(e.target.value);
            }}
            className="bg-transparent border rounded-md"
          >
            <option className="bg-zinc-900 px-2" value="">
              Select carrier
            </option>
            <option className="bg-zinc-900 px-2" value="J&T">
              J&T
            </option>
            <option className="bg-zinc-900 px-2" value="Virak Buntham">
              Virak Buntham
            </option>
            <option className="bg-zinc-900 px-2" value="other">
              Other
            </option>
          </select>
        </div>
        <div className="w-full flex justify-between gap-2">
          <input
            type="text"
            placeholder="Carrier Name"
            onChange={(e) => {
              setCarrier(e.target.value);
            }}
            className={`bg-transparent border w-full px-2 outline-none rounded-md py-1 ${otherCarrierStyle}`}
          />
        </div>
        <div className="w-full flex justify-between gap-2 items-center">
          <h2>Resi number</h2>
          <input
            type="text"
            name="resi"
            id="resi"
            placeholder="Resi Number"
            onChange={(e) => {
              setResi(e.target.value);
            }}
            className="bg-transparent py-1 px-2 border rounded-md"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded-md bg-zinc-200 text-black font-bold"
            onClick={() => setDetailsStyle("scale-0")}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded-md bg-blue-500 font-bold"
            onClick={shippingSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
