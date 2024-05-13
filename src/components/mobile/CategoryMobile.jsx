import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { PiArrowFatLineLeftDuotone } from "react-icons/pi";

import { Recomendations } from "../sampleContent";

export default function CategoryMobile() {
  const categoryName = useParams();

  function goBack() {
    window.history.back();
  }

  return (
    <>
      <div className="w-full p-2 bg-zinc-200 pb-20">
        <div className="w-full flex items-center gap-2">
          <PiArrowFatLineLeftDuotone onClick={goBack} className="text-lg" />
          <h1 className="font-bold text-lg py-2">
            Category {categoryName.category}
          </h1>
        </div>
        <SearchBar categoryName={categoryName} />
        <ProductList />
      </div>
    </>
  );
}

const SearchBar = ({ categoryName }) => {
  return (
    <>
      <div className="w-full py-2 px-4 bg-white rounded-md shadow">
        <div className="w-full flex gap-0.5 items-center justify-evenly border border-[#e00025] rounded-3xl py-1 px-1">
          <IoSearch className="text-zinc-500 text-xl" />
          <input
            type="text"
            placeholder={`Search in ${categoryName.category}`}
            className="flex-1 active:outline-none p-1 text-sm"
          />
          <button className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-2xl text-white font-semibold text-sm px-2 py-1">
            Search
          </button>
        </div>
      </div>
    </>
  );
};

const ProductList = () => {
  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return (
    <>
      <div className="w-full py-2">
        <div className="w-full flex flex-wrap justify-evenly py-3 gap-2">
          {Recomendations.map((item) => (
            <a
              href={`/product/${item.id}`}
              key={item.id}
              className="w-[48%] flex flex-col gap-1 bg-white rounded-md shadow pb-2"
            >
              <img src={item.src} alt={item.title} className="w-full" />
              <div className="w-full px-1 flex flex-col">
                <p className="font-semibold text-sm truncate">{item.title}</p>
                <p className="font-bold text-[#e00025]">
                  {dollar.format(item.price)}
                </p>
              </div>
              <div className="w-full flex justify-between px-1">
                <div className="flex gap-1 items-center">
                  <FaStar className="text-yellow-300" />
                  <p className="text-xs text-zinc-600">{item.rating}</p>
                </div>
                <p className="text-zinc-600 text-xs">{item.sold}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
