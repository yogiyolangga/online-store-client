import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CategoriesMobile() {
  const [categories, setCategories] = useState([]);
  const baseUrl = "http://localhost:3000";
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

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

  const getProductsByCategory = async (id) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${baseUrl}/api/client/productsbycategory/${id}`
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.data.success) {
        setProducts(response.data.result);
        setCategory(response.data.categoryName);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Error, try again later!");
      }

      setLoading(false);
    } catch (error) {
      console.log("Error occured:", error);
    }
  };

  useEffect(() => {
    getCategories();
    getProductsByCategory("CTG01");
  }, []);

  return (
    <>
      <div
        className="w-full bg-zinc-100 overflow-x-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="w-fit flex items-center py-2 justify-between gap-2 px-2">
          {categories.map((data) => (
            <div
              key={data.id_category}
              onClick={() => getProductsByCategory(data.id_category)}
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
      <div className="w-full">
        {loading === true ? (
          <div className="w-full flex gap-1 py-2 justify-center flex-col items-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
            <p className="text-zinc-600">Loading</p>
          </div>
        ) : (
          <div>
            <ListCategory
              products={products}
              baseUrl={baseUrl}
              category={category}
            />
          </div>
        )}
      </div>
    </>
  );
}

export const ListCategory = ({ products, baseUrl, category }) => {
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
      <div className="w-full px-2 bg-zinc-200 pb-20">
        <h1 className="pt-3 font-semibold">{category}</h1>
        <div className="w-full flex flex-wrap justify-evenly py-3 gap-2">
          {products.map((item) => (
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
        {/* <BsThreeDots className="mx-auto text-2xl animate-pulse text-[#032ea1]" /> */}
      </div>
    </>
  );
};
