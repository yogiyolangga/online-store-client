import { useEffect, useState } from "react";
import { IoArrowUndo } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function AddProductMobile() {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000";
  const userLogin = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");

  return (
    <div className="w-full pt-4 pb-20 px-2">
      <div className="w-full flex gap-2 items-center">
        <IoArrowUndo onClick={() => navigate("/account/store")} />
        <h1 className="font-semibold text-lg"> Sell new product</h1>
      </div>
      <div className="w-full py-4">
        <ProductForm userLogin={userLogin} baseUrl={baseUrl} />
      </div>
    </div>
  );
}

const ProductForm = ({ userLogin, baseUrl }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (name === "") {
      return alert("Please input product name!");
    } else if (image === null) {
      return alert("Please add image product!");
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
    fd.append("image", image);
    fd.append("userLogin", userLogin);
    fd.append("name", name);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("price", price);
    fd.append("stock", stock);
    fd.append("discount", discount);

    Axios.post(`${baseUrl}/api/client/addproduct`, fd).then((response) => {
      if (response.data.success) {
        alert(response.data.success);
        navigate("/account/store")
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Server error");
      }
    });
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
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="w-full flex flex-col gap-2">
          <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
            <input
              type="text"
              placeholder="Product Name"
              className="py-1 bg-zinc-200 w-full outline-none"
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
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
            <input
              type="text"
              placeholder="Price Product in $"
              className="py-1 bg-zinc-200 w-full outline-none"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>
          <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
            <input
              type="text"
              placeholder="Stock Product"
              className="py-1 bg-zinc-200 w-full outline-none"
              onChange={(e) => {
                setStock(e.target.value);
              }}
            />
          </div>
          <div className="bg-zinc-200 py-1 px-2 rounded-md border border-zinc-600">
            <input
              type="text"
              placeholder="Discount Product % (optional)"
              className="py-1 bg-zinc-200 w-full outline-none"
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
            />
          </div>
          <div className="bg-zinc-200 py-2 px-2 rounded-md border border-zinc-600 flex items-center flex-col gap-2">
            {image && ( // Tambahkan pengecekan apakah image tidak null
              <img
                src={URL.createObjectURL(image)}
                alt="Preview Product Image"
                className="w-1/2 rounded-md shadow-md shadow-black"
              />
            )}
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
    </>
  );
};
