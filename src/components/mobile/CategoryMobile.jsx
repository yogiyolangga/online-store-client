import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { PiArrowFatLineLeftDuotone } from "react-icons/pi";
import Axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SearchBar } from "./HomeMobile";

export default function CategoryMobile() {
  const categoryName = useParams();
  const baseUrl = "http://localhost:3000";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function goBack() {
    window.history.back();
  }

  const getProductByCategory = async () => {
    try {
      const response = await Axios.get(
        `${baseUrl}/api/client/getproductbycategory/${categoryName.category}`
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        setProducts(response.data.resultProducts);
      } else {
        alert("Error, try again later!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductByCategory();
  }, []);

  return (
    <>
      <div className="w-full p-2 bg-zinc-200 pb-20">
        <div className="w-full flex items-center gap-2">
          <PiArrowFatLineLeftDuotone onClick={goBack} className="text-lg" />
          <h1 className="font-bold text-lg py-2">
            Category {categoryName.category}
          </h1>
        </div>
        <div>
        <SearchBar />
        </div>
        {loading === true ? (
          <div className="w-full flex gap-1 py-2 justify-center flex-col items-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
            <p className="text-zinc-600">Loading</p>
          </div>
        ) : (
          <ProductList products={products} baseUrl={baseUrl} />
        )}
      </div>
    </>
  );
}

// const SearchBar = ({ categoryName }) => {
//   return (
//     <>
//       <div className="w-full py-2 px-4 bg-white rounded-md shadow">
//         <div className="w-full flex gap-0.5 items-center justify-evenly border border-[#e00025] rounded-3xl py-1 px-1">
//           <IoSearch className="text-zinc-500 text-xl" />
//           <input
//             type="text"
//             placeholder={`Search in ${categoryName.category}`}
//             className="flex-1 outline-none p-1 text-sm"
//           />
//           <button className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-2xl text-white font-semibold text-sm px-2 py-1">
//             Search
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

const ProductList = ({ products, baseUrl }) => {
  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function truncateTitle(str) {
    if (str.length > 20) {
      return str.substring(0, 30) + "..."; // Mengambil karakter dari indeks 0 hingga 7
    } else {
      return str; // Mengembalikan string asli jika panjangnya kurang dari atau sama dengan 8 karakter
    }
  }

  return (
    <>
      <div className="w-full py-2">
        <div className="w-full flex flex-wrap justify-evenly py-3 gap-2">
          {products.length < 1 ? (
            <div className="w-full bg-white py-2 flex flex-col items-center gap-2">
              {/* image */}
              <p className="text-zinc-500">
                No have product on this category yet
              </p>
            </div>
          ) : (
            products.map((item) => (
              <a
                href={`/product/${item.id_product}`}
                key={item.id_product}
                className="w-[48%] flex flex-col gap-1 bg-white rounded-md shadow pb-2"
              >
                <img
                  src={`${baseUrl}/${item.img}`}
                  alt={item.name}
                  className="w-full"
                />

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
            ))
          )}
        </div>
      </div>
    </>
  );
};
