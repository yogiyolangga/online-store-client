import { useEffect, useState } from "react";
import { SearchBar } from "./HomeMobile";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaStar } from "react-icons/fa6";

export default function Search() {
  const [productsList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:3000";
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productName = searchParams.get("name");

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(
          `${baseUrl}/api/client/products/search`,
          {
            params: { name: productName },
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (response.data.success) {
          setProductList(response.data.result);
        } else {
          console.log("Error fetching product");
        }
        setLoading(false);
      } catch (err) {
        console.log("Error searching products: ", err);
        setProductList([]);
      }
    };

    if (productName) {
      fetchProducts();
    }
  }, [location.search]);

  return (
    <>
      <div className="w-full py-2">
        <div>
          <SearchBar />
        </div>
        {loading === true ? (
          <div className="w-full flex gap-1 py-2 justify-center flex-col items-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
            <p className="text-zinc-600">Loading</p>
          </div>
        ) : (
          <div>
            <ProductList productsList={productsList} baseUrl={baseUrl} />
          </div>
        )}
      </div>
    </>
  );
}

const ProductList = ({ productsList, baseUrl }) => {
  function truncateTitle(str) {
    if (str.length > 20) {
      return str.substring(0, 30) + "..."; // Mengambil karakter dari indeks 0 hingga 7
    } else {
      return str; // Mengembalikan string asli jika panjangnya kurang dari atau sama dengan 8 karakter
    }
  }

  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <>
      <div>
        <div className="w-full flex flex-wrap justify-evenly py-3 gap-2 pb-20 px-2 bg-zinc-200">
          {productsList.length < 1 ? (
            <div className="w-full flex flex-col gap-3 items-center justify-center">
              <h1 className="text-lg font-bold text-zinc-600 text-center">
                Sorry, the product you are looking for is not yet available
              </h1>
              <img
                src="assets/img/not-found.png"
                alt="Not found product"
                className="w-40"
              />
            </div>
          ) : (
            productsList.map((item) => (
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
                      {item.rating === 0 ? 4.2 : item.rating}
                    </p>
                  </div>
                  <p className="text-zinc-600 text-xs">{item.sold}</p>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </>
  );
};
