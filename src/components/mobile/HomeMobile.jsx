import { IoSearch } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import {
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
} from "react-icons/md";
import { dollar } from "../utils";

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
      <div className="bg-zinc-200 flex flex-col relative">
        <SearchBar />
        <Carousel />
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

const Carousel = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [baners, setBaners] = useState([]);
  const carouselRef = useRef(null);
  const [isDragStart, setIsDragStart] = useState(false);
  const [prevPageX, setPrevPageX] = useState(0);
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${apiUrl}/admin/banner`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        setBaners(response.data.result);
      } else {
        console.log("Errorrr");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    const dragStart = (e) => {
      setIsDragStart(true);
      setPrevPageX(e.pageX || e.touches[0].pageX);
      setPrevScrollLeft(carousel.scrollLeft);
      setIsDragging(false); // Reset dragging state
    };

    const dragging = (e) => {
      if (!isDragStart) return;
      e.preventDefault();
      setIsDragging(true);
      const positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
      carousel.scrollLeft = prevScrollLeft - positionDiff;
    };

    const dragStop = () => {
      setIsDragStart(false);
      if (isDragging) {
        autoScroll();
      }
    };

    const autoScroll = () => {
      const firstImgWidth = carousel.querySelector("img").clientWidth;
      const scrollLeft = carousel.scrollLeft;
      const index = Math.round(scrollLeft / firstImgWidth);
      carousel.scrollTo({
        left: index * firstImgWidth,
        behavior: "smooth",
      });
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    carousel.addEventListener("mouseup", dragStop);
    carousel.addEventListener("mouseleave", dragStop);
    carousel.addEventListener("touchstart", dragStart);
    carousel.addEventListener("touchmove", dragging);
    carousel.addEventListener("touchend", dragStop);

    return () => {
      carousel.removeEventListener("mousedown", dragStart);
      carousel.removeEventListener("mousemove", dragging);
      carousel.removeEventListener("mouseup", dragStop);
      carousel.removeEventListener("mouseleave", dragStop);
      carousel.removeEventListener("touchstart", dragStart);
      carousel.removeEventListener("touchmove", dragging);
      carousel.removeEventListener("touchend", dragStop);
    };
  }, [isDragStart, isDragging, prevPageX, prevScrollLeft]);

  const handleImageClick = (url) => {
    if (!isDragging) {
      window.open(url, "_blank");
    }
  };

  const slideLeft = () => {
    const carousel = carouselRef.current;
    const firstImgWidth = carousel.querySelector("img").clientWidth;
    carousel.scrollBy({
      left: -firstImgWidth,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    const carousel = carouselRef.current;
    const firstImgWidth = carousel.querySelector("img").clientWidth;
    carousel.scrollBy({
      left: firstImgWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="absolute bg-zinc-200 p-1 left-0 bg-opacity-60 rounded-full"
        onClick={slideLeft}
      >
        <MdOutlineArrowCircleLeft className="text-xl" />
      </button>
      <button
        className="absolute right-0 bg-zinc-200 p-1 bg-opacity-60 rounded-full"
        onClick={slideRight}
      >
        <MdOutlineArrowCircleRight className="text-xl" />
      </button>
      <div
        ref={carouselRef}
        id="carousel"
        className="flex overflow-x-scroll scrollbar-hide"
      >
        {loading ? (
          <div>loading...</div>
        ) : (
          baners.map((img) => (
            <img
              key={img.id_baner}
              src={img.url_image}
              alt={img.title}
              onClick={() => handleImageClick(img.link)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;

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
  const baseUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    setLoading(true);

    try {
      const response = await Axios.get(`${baseUrl}/api/client/products`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.data.success) {
        setProductsList(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Server running Error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
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
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full px-2 pb-20">
          <div className="w-full flex items-center rounded-md bg-white px-2 py-2">
            <h2 className="text-lg font-semibold text-zinc-600">
              Recomendation
            </h2>
          </div>
          <div className="w-full flex flex-wrap justify-between py-3 gap-2">
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
                  <p className="text-zinc-600 text-xs">
                    {item.total_sold} sold
                  </p>
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
      )}
    </>
  );
};

export const Loading = () => {
  return (
    <>
      <div className="absolute z-20 w-full min-h-screen bg-zinc-600 bg-opacity-60 backdrop-blur flex justify-center items-center">
        <h1 className="font-semibold text-zinc-100 animate-pulse">
          Loading...
        </h1>
      </div>
    </>
  );
};
