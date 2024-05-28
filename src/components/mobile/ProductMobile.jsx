import { PiArrowFatLineLeftDuotone } from "react-icons/pi";
import { FaStar } from "react-icons/fa6";
import { VscLiveShare } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Axios from "axios";
import { useEffect, useState } from "react";

export default function ProductMobile() {
  const userLogin = localStorage.getItem("username");
  const navigate = useNavigate();
  const [cartLength, setCartLength] = useState(0);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    Axios.get(`${baseUrl}/api/client/getcart/${userLogin}`).then((response) => {
      if (response.data.success) {
        setCartLength(response.data.result.length);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Server might error!");
      }
    });
  }, []);

  function goBack() {
    window.history.back();
  }

  function goCart() {
    navigate("/cart");
  }

  return (
    <>
      <div className="w-full bg-zinc-200 pb-20 pt-[42px]">
        <div className="flex fixed top-0 justify-between w-full gap-2 items-center p-2 bg-white">
          <PiArrowFatLineLeftDuotone onClick={goBack} className="text-2xl" />
          <div className="relative">
            <TfiShoppingCartFull onClick={goCart} className="text-2xl" />
            <div
              className={`bg-red-500 w-4 text-white font-semibold flex justify-center items-center h-4 text-xs rounded-full top-0 -left-2 absolute ${
                cartLength < 1 ? "hidden" : ""
              }`}
            >
              {cartLength}
            </div>
          </div>
        </div>
        <ProductData baseUrl={baseUrl} />
        <div className="py-2">
          <Recomendation />
        </div>
      </div>
    </>
  );
}

const ProductData = ({ baseUrl }) => {
  const idProduct = useParams();
  const [product, setProduct] = useState([]);
  const [positionOption, setPositionOption] = useState("translate-y-[100%]");

  const getProductDetail = () => {
    Axios.get(`${baseUrl}/api/client/getproductdetail/${idProduct.id}`).then(
      (response) => {
        if (response.data.success) {
          setProduct(response.data.success[0]);
        } else if (response.data.error) {
          console.log(response.data.error);
        } else {
          alert("Server not response");
        }
      }
    );
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <>
      <div className="w-full relative">
        <div
          className={`fixed w-full max-w-[360px] bottom-0 z-10 bg-zinc-200 duration-200 rounded-t-3xl border border-black py-2 px-2 ${positionOption}`}
        >
          <OptionProduct
            setPositionOption={setPositionOption}
            idProduct={idProduct}
            baseUrl={baseUrl}
          />
        </div>
        <img
          src={`${baseUrl}/${product.img}`}
          alt={product.name}
          className="w-full"
        />
        <div className="w-full px-2 flex flex-col gap-1 bg-white">
          <div className="w-full flex justify-between items-start pt-2">
            <div className="flex flex-col">
              <p
                className={
                  product.discount < 1
                    ? "hidden"
                    : "text-zinc-600 font-light text-sm line-through"
                }
              >
                {dollar.format(product.price)}
              </p>
              <p className="text-xs text-blue-500">
                {product.discount < 1 ? "" : `save ${product.discount}%`}
              </p>
              <p className="font-bold text-2xl text-[#032ea1]">
                {dollar.format(
                  product.price - product.price * (product.discount / 100)
                )}
              </p>
            </div>
            <VscLiveShare className="text-2xl text-zinc-700" />
          </div>
          <div className="font-semibold">{product.name}</div>
          <div className="w-full flex justify-start gap-1">
            <div className="flex gap-1 items-center">
              <FaStar className="text-yellow-300" />
              <p className="text-xs text-zinc-600 border-r">
                {product.average_rating === null ? 3.2 : product.average_rating}
              </p>
            </div>
            <p className="text-zinc-600 text-xs">{`(${product.total_sold})`}</p>
          </div>
          <div className="w-full flex flex-col gap-1">
            <div className="font-bold text-lg">Description Product</div>
            <p className="text-sm text-zinc-700">{product.description}</p>
          </div>
          <div className="w-full px-2 pt-2 pb-3">
            <button
              onClick={() => setPositionOption("translate-y-[0%]")}
              className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-2xl text-white font-semibold text-sm w-full py-2 active:scale-95 duration-75"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Recomendation = () => {
  const [productsList, setProductsList] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;

  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const getProducts = () => {
    Axios.get(`${baseUrl}/api/client/products`).then((response) => {
      if (response.data.success) {
        setProductsList(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Server running Error!");
      }
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  function truncateTitle(str) {
    if (str.length > 20) {
      return str.substring(0, 30) + "..."; // Mengambil karakter dari indeks 0 hingga 7
    } else {
      return str; // Mengembalikan string asli jika panjangnya kurang dari atau sama dengan 8 karakter
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-center rounded bg-white px-2 py-2">
          <h2 className="text-lg mx-auto font-semibold text-zinc-700">
            You may also like
          </h2>
        </div>
        <div className="w-full flex flex-wrap justify-evenly py-3 px-2 gap-2">
          {productsList.map((item) => (
            <a
              href={`/product/${item.id_product}`}
              key={item.id_product}
              className="w-[48%] py-1 flex flex-col gap-1 bg-white rounded-md shadow pb-2"
            >
              <div className="h-[160px]">
                <img
                  src={`${baseUrl}/${item.img}`}
                  alt={item.name}
                  className="w-full"
                />
              </div>
              <div className="w-full px-1 flex flex-col">
                <p className="font-semibold text-sm">
                  {truncateTitle(item.name)}
                </p>
                <div className="w-full flex justify-between">
                  <p className="font-bold text-[#e00025]">
                    {dollar.format(
                      item.price - item.price * (item.discount / 100)
                    )}
                  </p>
                  <p className="text-xs text-blue-500">
                    {item.discount < 1 ? "" : `save ${item.discount}%`}
                  </p>
                </div>
                <p
                  className={
                    item.discount < 1
                      ? "hidden"
                      : "text-zinc-600 font-light text-sm line-through"
                  }
                >
                  {dollar.format(item.price)}
                </p>
              </div>
              <div className="w-full flex justify-between px-1">
                <div className="flex gap-1 items-center">
                  <FaStar className="text-yellow-300" />
                  <p className="text-xs text-zinc-600">
                    {item.average_rating === null ? 3.2 : item.average_rating}
                  </p>
                </div>
                <p className="text-zinc-600 text-xs">{item.total_sold} sold</p>
              </div>
            </a>
          ))}
        </div>
        <BsThreeDots className="mx-auto text-2xl animate-pulse text-[#032ea1]" />
      </div>
    </>
  );
};

const OptionProduct = ({ setPositionOption, idProduct, baseUrl }) => {
  const [quantity, setQuantity] = useState(1);
  const userLogin = localStorage.getItem("username");
  const [addInfo, setAddInfo] = useState("");
  const navigate = useNavigate();

  const addCart = () => {
    if (userLogin) {
      Axios.post(`${baseUrl}/api/client/addcart`, {
        idProduct: idProduct.id,
        userLogin: userLogin,
        quantity: quantity,
        addInfo: addInfo,
      }).then((response) => {
        if (response.data.success) {
          alert(response.data.success);
          navigate("/cart");
        } else if (response.data.error) {
          alert(response.data.error);
        } else {
          console.log("Server might error!");
        }
      });
    } else {
      alert("Please login first!");
      navigate("/login");
    }
  };

  const handleIncrementQuantity = () => {
    if (quantity < 10) {
      setQuantity((prevQuantity) => prevQuantity + 1); // Menggunakan callback untuk mengambil nilai terbaru
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Menggunakan callback untuk mengambil nilai terbaru
    }
  };

  return (
    <>
      <div className="w-full py-2 px-2">
        <div className="w-full flex justify-end">
          <AiOutlineCloseCircle
            onClick={() => setPositionOption("translate-y-[100%]")}
            className="text-xl"
          />
        </div>
        <div className="w-full flex flex-col gap-3 py-2 justify-between">
          <div className="w-full">
            <label
              htmlFor="add-info"
              className="px-1 text-zinc-600 font-semibold"
            >
              Additional info
            </label>
            <div className="px-2 py-1 rounded-md border bg-zinc-200 border-zinc-600">
              <textarea
                name="add-info"
                id="add-info"
                cols="30"
                rows="5"
                placeholder="Add information about the product you want to order. Just leave it blank if there is no message!"
                className="py-1 bg-zinc-200 w-full outline-none"
                onChange={(e) => {
                  setAddInfo(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <label
              htmlFor="quantity"
              className="px-1 text-zinc-600 font-semibold"
            >
              Quantity
            </label>
            <div className="flex gap-1">
              <button
                className="rounded bg-red-500 text-xl h-8 w-8 font-extrabold text-white shadow-md shadow-zinc-600 active:scale-95"
                onClick={handleDecrementQuantity}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                className="w-8 flex bg-zinc-50 rounded-md justify-center items-center outline-none text-center border border-black"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button
                className="rounded bg-blue-500 text-xl h-8 w-8 font-extrabold text-white shadow-md shadow-zinc-600 active:scale-95"
                onClick={handleIncrementQuantity}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 flex pt-32">
            <button
              className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-md text-white font-semibold text-sm w-full py-2 active:scale-95 duration-75"
              onClick={addCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
