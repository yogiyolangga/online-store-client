import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { LuClipboardEdit } from "react-icons/lu";
import { IoArrowUndoSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { FaParachuteBox } from "react-icons/fa";
import { GoPackageDependents } from "react-icons/go";
import { FaPlaneDeparture } from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

export default function StoreMobile() {
  const [productList, setProductList] = useState([]);
  const [detailsProduct, setDetailsProduct] = useState([]);
  const [detailsDisplay, setDetailsDisplay] = useState("translate-x-[100%]");
  const baseUrl = "http://localhost:3000";
  const userLogin = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [orderRequest, setOrderRequest] = useState(0);
  const [orderShipping, setOrderShipping] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(0);

  useEffect(() => {
    if (!token) return navigate("/login");
  }, []);

  const getProduct = () => {
    Axios.get(`${baseUrl}/api/client/getuserproduct/${userLogin}`).then(
      (response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setProductList(response.data);
        }
      }
    );
  };

  const getStore = () => {
    Axios.get(`${baseUrl}/api/client/getstore/${userLogin}`).then(
      (response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setStoreName(response.data[0].name);
        }
      }
    );
  };

  const getRequestOrder = (status) => {
    Axios.get(`${baseUrl}/api/client/seller/${userLogin}/${status}`).then(
      (response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else if (status === "request" && response.data.success) {
          setOrderRequest(response.data.result[0].total_rows);
        } else if (status === "shipping" && response.data.success) {
          setOrderShipping(response.data.result[0].total_rows);
        } else if (status === "completed" && response.data.success) {
          setOrderCompleted(response.data.result[0].total_rows);
        } else {
          console.log("Error Request!");
        }
      }
    );
  };

  useEffect(() => {
    getProduct();
    getStore();
    getRequestOrder("request");
    getRequestOrder("shipping");
    getRequestOrder("completed");
  }, []);

  const getDetailsProduct = (id) => {
    Axios.get(`${baseUrl}/api/client/detailproduct/${id}`).then((response) => {
      setDetailsProduct(response.data);
      setDetailsDisplay("translate-x-0");
    });
  };

  const goBack = () => {
    setDetailsDisplay("translate-x-[100%]");
  };

  return (
    <>
      <div className="w-full min-h-screen pt-4 pb-20 relative overflow-hidden">
        <div className="w-full px-2 flex justify-between items-center">
          <h1 className="font-bold text-lg text-blue-500">Phsar Leau</h1>
          <h1 className="font-bold text-lg">{storeName}</h1>
        </div>
        <div className="w-full py-5">
          <Widget
            productList={productList}
            orderCompleted={orderCompleted}
            orderRequest={orderRequest}
            orderShipping={orderShipping}
          />
        </div>
        <div className="px-2">
          <ProductList
            productList={productList}
            getDetailsProduct={getDetailsProduct}
            baseUrl={baseUrl}
          />
        </div>
        <div
          className={`absolute z-10 bg-zinc-200 px-2 items-center min-h-screen w-full top-0 duration-150 ${detailsDisplay}`}
        >
          <ProductDetails detailsProduct={detailsProduct} goBack={goBack} />
        </div>
      </div>
    </>
  );
}

const Widget = ({
  productList,
  orderRequest,
  orderShipping,
  orderCompleted,
}) => {
  return (
    <>
      <div className="w-full flex flex-wrap justify-center items-center gap-3">
        <a
          href="/account/store/addproduct"
          className="flex flex-col justify-evenly items-center bg-zinc-100 rounded-xl w-[45%] py-3 shadow border"
        >
          <div className="w-full flex justify-center gap-5 items-center">
            <div className="p-2 bg-white rounded-full">
              <FaParachuteBox className="text-blue-500" />
            </div>
            <p className="text-black font-extrabold text-xl">
              {productList.length}
            </p>
          </div>
          <p className="text-xs text-center font-semibold text-zinc-600">
            sell something here
          </p>
        </a>
        <a
          href="/account/store/request"
          className="flex flex-col justify-evenly items-center bg-zinc-100 rounded-xl w-[45%] py-3 shadow border"
        >
          <div className="w-full flex justify-center gap-5 items-center">
            <div className="p-2 bg-white rounded-full">
              <GoPackageDependents className="text-blue-500" />
            </div>
            <p className="text-black font-extrabold text-xl">{orderRequest}</p>
          </div>
          <p className="text-xs text-center font-semibold text-zinc-600">
            order request
          </p>
        </a>
        <a
          href="/account/store/shipping"
          className="flex flex-col justify-evenly items-center bg-zinc-100 rounded-xl w-[45%] py-3 shadow border"
        >
          <div className="w-full flex justify-center gap-5 items-center">
            <div className="p-2 bg-white rounded-full">
              <FaPlaneDeparture className="text-blue-500" />
            </div>
            <p className="text-black font-extrabold text-xl">{orderShipping}</p>
          </div>
          <p className="text-xs text-center font-semibold text-zinc-600">
            order in delivery
          </p>
        </a>
        <a
          href="/account/store/complete"
          className="flex flex-col justify-evenly items-center bg-zinc-100 rounded-xl w-[45%] py-3 shadow border"
        >
          <div className="w-full flex justify-center gap-5 items-center">
            <div className="p-2 bg-white rounded-full">
              <IoCheckmarkDoneCircleSharp className="text-blue-500" />
            </div>
            <p className="text-black font-extrabold text-xl">
              {orderCompleted}
            </p>
          </div>
          <p className="text-xs text-center font-semibold text-zinc-600">
            completed order
          </p>
        </a>
      </div>
    </>
  );
};

const ProductList = ({ productList, getDetailsProduct, baseUrl }) => {
  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function truncate(str) {
    if (str.length > 8) {
      return str.substring(0, 8) + "..."; // Mengambil karakter dari indeks 0 hingga 7 dan menambahkan "..."
    } else {
      return str; // Mengembalikan string asli jika panjangnya kurang dari atau sama dengan 8 karakter
    }
  }

  const deleteStatus = (id) => {
    const today = new Date();
    confirm("Are you sure to delete product ?");
    const confirmation = window.confirm("Are you sure to delete product?");
    if (confirmation) {
      Axios.put(`${baseUrl}/api/client/deletestatus/${id}`, {
        today: today,
      }).then((response) => {
        if (response.data.success) {
          alert("Delete Successfully!");
          window.location.reload();
        } else if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Server Error!");
        }
      });
    } else {
      console.log("Delete canceled !");
    }
  };
  return (
    <>
      <div className="w-full pb-4">
        <h1 className="text-center font-semibold text-base pb-1">
          Your products
        </h1>
        <div className="flex justify-between bg-zinc-700 text-white py-2 items-center rounded-md">
          <div className="flex flex-1 font-semibold text-lg  justify-center">
            Product
          </div>
          <div className="flex flex-1 font-semibold text-lg  justify-center">
            Price
          </div>
          <div className="flex flex-1 font-semibold text-lg  justify-center">
            Sold
          </div>
          <div className="flex flex-1 font-semibold text-lg  justify-center">
            Action
          </div>
        </div>
        <div className="flex flex-col py-0.5 gap-0.5">
          {productList.length < 1 ? (
            <div className="w-full py-2 justify-center items-center font-bold">
              Sell your first product
            </div>
          ) : (
            productList.map((item) => (
              <div
                key={item.id_product}
                className="flex justify-between items-center py-1 bg-zinc-200 rounded"
              >
                <div className="flex flex-1 justify-center text-sm font-semibold px-1">
                  {truncate(item.name)}
                </div>
                <div className="flex flex-1 justify-center text-sm font-semibold">
                  {dollar.format(item.price)}
                </div>
                <div className="flex flex-1 justify-center text-sm font-semibold">
                  {item.sold}
                </div>
                <div className="flex flex-1 gap-1 justify-center">
                  <button
                    className="bg-red-500 px-2 py-1 rounded-md shadow-md border"
                    onClick={() => deleteStatus(item.id_product)}
                  >
                    <MdDeleteForever className="text-zinc-100 text-lg" />
                  </button>
                  <button
                    onClick={() => getDetailsProduct(item.id_product)}
                    className="bg-blue-500 px-2 py-1 rounded-md shadow-md border"
                  >
                    <LuClipboardEdit className="text-zinc-100 text-lg " />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const ProductDetails = ({ detailsProduct, goBack }) => {
  const [idProduct, setIdProduct] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const baseUrl = "http://localhost:3000";

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (name === "") {
      return alert("Please input product name!");
    } else if (category === "") {
      return alert("Please select category product!");
    } else if (description.length < 10) {
      return alert("Please add more description product!");
    } else if (price < 1) {
      return alert("Product price at least 1$");
    } else if (stock < 1) {
      return alert("Stock product minimal 1");
    }

    const fd = new FormData();
    fd.append("image", newImage);
    fd.append("name", name);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("price", price);
    fd.append("stock", stock);
    fd.append("discount", discount);
    fd.append("idProduct", idProduct);

    if (newImage === null) {
      Axios.put(`${baseUrl}/api/client/editproduct`, {
        idProduct: idProduct,
        name: name,
        category: category,
        description: description,
        price: price,
        stock: stock,
        discount: discount,
      }).then((response) => {
        if (response.data.success) {
          alert(response.data.success);
          window.location.reload();
        } else if (response.data.error) {
          alert(response.data.error);
        } else {
          console.log("Server Error!");
        }
      });
    } else {
      Axios.put(`${baseUrl}/api/client/epwithimage`, fd).then((response) => {
        if (response.data.success) {
          alert(response.data.success);
          window.location.reload();
        } else if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Server error");
        }
      });
    }
  };

  const getCategory = () => {
    Axios.get(`${baseUrl}/api/client/getcategory`).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setCategoryList(response.data);
      }
    });
  };

  useEffect(() => {
    getCategory();
    setIdProduct(
      detailsProduct.length > 0 ? detailsProduct[0].id_product : "No data"
    );
    setName(detailsProduct.length > 0 ? detailsProduct[0].name : "No data");
    setCategory(
      detailsProduct.length > 0 ? detailsProduct[0].id_category : "No data"
    );
    setDescription(
      detailsProduct.length > 0 ? detailsProduct[0].description : "No data"
    );
    setPrice(detailsProduct.length > 0 ? detailsProduct[0].price : 0);
    setStock(detailsProduct.length > 0 ? detailsProduct[0].stock : 0);
    setDiscount(detailsProduct.length > 0 ? detailsProduct[0].discount : 0);
    setImage(detailsProduct.length > 0 ? detailsProduct[0].img : "");
  }, [
    detailsProduct,
    setName,
    setCategory,
    setDescription,
    setPrice,
    setStock,
    setDiscount,
    setImage,
    setIdProduct,
  ]);

  return (
    <>
      <div className="w-full py-3">
        <div className="w-full flex gap-2 items-center">
          <IoArrowUndoSharp onClick={goBack} />
          <h1>Detail Product</h1>
        </div>
        <div className="py-2">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="w-full flex flex-col gap-2">
              <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="py-1 bg-zinc-200 w-full outline-none"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
                <select
                  name="category"
                  id="category"
                  className="py-1 bg-zinc-200 w-full"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option value="">Choose Category</option>
                  {categoryList.map((val) => (
                    <option key={val.id_category} value={val.id_category}>
                      {val.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
                <textarea
                  name="description"
                  id="description"
                  cols="30"
                  rows="5"
                  placeholder="Description Products"
                  className="py-1 bg-zinc-200 w-full outline-none"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
                <input
                  type="number"
                  placeholder="Price Product in $"
                  className="py-1 bg-zinc-200 w-full outline-none"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
                <input
                  type="number"
                  placeholder="Stock Product"
                  className="py-1 bg-zinc-200 w-full outline-none"
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                  }}
                />
              </div>
              <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
                <input
                  type="number"
                  placeholder="Discount Product % (optional)"
                  className="py-1 bg-zinc-200 w-full outline-none"
                  value={discount}
                  onChange={(e) => {
                    setDiscount(e.target.value);
                  }}
                />
              </div>
              <div className="bg-zinc-200 py-2 px-2 rounded-md border border-zinc-600 flex items-center flex-col gap-2">
                <img
                  src={`${baseUrl}/${image}`}
                  alt="Old Image"
                  className="w-1/2 rounded-md shadow-md shadow-black"
                />
                {/* {image && ( // Tambahkan pengecekan apakah image tidak null
                  <img
                    // src={`${baseUrl}/${image}`}
                    src={URL.createObjectURL(newImage)}
                    alt="Preview Product Image"
                    className="w-1/2 rounded-md shadow-md shadow-black"
                  />
                )} */}
                <input
                  type="file"
                  accept="image/*"
                  className="py-1 bg-zinc-200 w-full"
                  onChange={handleChangeImage}
                />
              </div>
              <div className="w-full py-1">
                <button
                  className="w-full py-2 bg-[#032ea1] rounded-md text-white font-semibold"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
