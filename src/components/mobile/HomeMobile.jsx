import { IoSearch } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";

import { BannersImgSlider } from "../sampleContent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeMobile() {
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  if (token) {
    const decodeToken = jwtDecode(token);
  } else {
    console.log("Please Sign In/Sign Up!");
  }
  return (
    <>
      <div className="bg-zinc-200 flex flex-col gap-2">
        <SearchBar />
        <BannerSlider />
        <Categories />
        <Recomendation />
      </div>
    </>
  );
}

export const SearchBar = () => {
  const [productName, setProductName] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?name=${productName}`);
  };
  return (
    <>
      <div className="w-full py-2 px-4 bg-white">
        <div className="w-full flex gap-0.5 items-center justify-evenly border border-[#e00025] rounded-3xl py-1 px-1">
          <IoSearch className="text-zinc-500 text-xl" />
          <input
            type="text"
            placeholder="Search Product"
            className="flex-1 outline-none p-1 text-sm"
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />
          <button
            className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-2xl text-white font-semibold text-sm px-2 py-1"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

const BannerSlider = () => {
  return (
    <>
      <div className="rounded-xl">
        <Carousel showThumbs={false} showStatus={false}>
          {BannersImgSlider.map((url) => (
            <a href="/" key={url.url}>
              <img src={url.url} />
            </a>
          ))}
        </Carousel>
      </div>
    </>
  );
};

const Categories = () => {
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
        className="w-full overflow-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3 w-[150%]">
          {categories.map((cl) => (
            <a
              href={`/category/${cl.name}`}
              key={cl.id_category}
              className="flex flex-col justify-center items-center gap-1"
            >
              <div className="p-2 flex items-center justify-center rounded-full bg-white shadow-md">
                <img
                  src={`${baseUrl}/${cl.icon}`}
                  alt={cl.name}
                  className="w-8 h-8"
                />
              </div>
              <p className="text-xs">{cl.name}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export const Recomendation = () => {
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
      <div className="w-full px-2 pb-20">
        <div className="w-full flex items-center rounded-md bg-white px-2 py-2">
          <h2 className="text-lg font-semibold text-zinc-600">Recomendation</h2>
        </div>
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
        <div className="w-full py-4 flex justify-center">
          <button className="py-2 px-4 rounded shadow bg-zinc-50">
            Load More
          </button>
        </div>
      </div>
    </>
  );
};
