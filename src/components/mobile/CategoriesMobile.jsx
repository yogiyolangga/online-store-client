import { FaStar } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import Axios from "axios";

export default function CategoriesMobile() {
  const [categories, setCategories] = useState([]);
  const baseUrl = "http://localhost:3000";

  const getCategories = () => {
    Axios.get(`${baseUrl}/api/admin/categories`).then((response) => {
      if (response.data.success) {
        setCategories(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Server might die");
      }
    });
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      <div
        className="w-full p-2 bg-zinc-100 overflow-x-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="w-fit flex items-center py-2 justify-between gap-2">
          {categories.map((data) => (
            <div
              key={data.id_category}
              className="flex flex-col justify-between items-center gap-1 text-center h-16"
            >
              <img
                src={`${baseUrl}/${data.icon}`}
                alt={data.name}
                className="w-7 h-7"
              />
              <div className="text-xs text-zinc-800">{data.name}</div>
            </div>
          ))}
        </div>
      </div>
      <ListCategory />
    </>
  );
}

export const ListCategory = () => {
  const [productsList, setProductsList] = useState([]);
  const baseUrl = "http://localhost:3000";

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
      <div className="w-full px-2 bg-zinc-200 pb-20">
        <div className="w-full flex flex-wrap justify-evenly py-3 gap-2">
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
                <p className="font-bold text-[#e00025]">
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
          ))}
        </div>
        <BsThreeDots className="mx-auto text-2xl animate-pulse text-[#032ea1]" />
      </div>
    </>
  );
};
