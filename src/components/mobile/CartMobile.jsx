import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import Axios from "axios";
import { useEffect, useState } from "react";
import { ListCategory } from "./CategoriesMobile";
import { FiMapPin } from "react-icons/fi";
import { PiNotepad } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function CartMobile() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userLogin, setUserLogin] = useState("");
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const baseUrl = "http://localhost:3000";
  const [checkoutPosition, setCheckoutPosition] =
    useState("translate-y-[100%]");

  useEffect(() => {
    if (token) {
      setLoginStatus(true);
      setUserLogin(username);
    } else {
      setLoginStatus(false);
      setUserLogin("");
    }
  }, []);

  const getCart = () => {
    Axios.get(`${baseUrl}/api/client/cart/${username}`).then((response) => {
      if (response.data.success) {
        setCartItems(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Server might error!");
      }
    });
  };

  useEffect(() => {
    getCart();
  }, [username]);

  useEffect(() => {
    setTotalItems(cartItems.reduce((total, item) => total + item.quantity, 0));
    setSubTotalPrice(
      cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
    );
  }, [cartItems]);

  return (
    <>
      <div className="w-full bg-zinc-200 relative">
        <div className="p-2">
          {loginStatus === true ? (
            <ShoppingCart
              userLogin={userLogin}
              setCheckoutPosition={setCheckoutPosition}
              cartItems={cartItems}
              setCartItems={setCartItems}
              totalItems={totalItems}
              subTotalPrice={subTotalPrice}
              baseUrl={baseUrl}
            />
          ) : (
            <NotAuth />
          )}
        </div>
        <ListCategory />
        <div
          className={`fixed z-10 min-h-screen w-full bg-zinc-200 top-0 p-2 duration-500 ${checkoutPosition}`}
        >
          <Checkout
            setCheckoutPosition={setCheckoutPosition}
            cartItems={cartItems}
            baseUrl={baseUrl}
            subTotalPrice={subTotalPrice}
            username={username}
          />
        </div>
      </div>
    </>
  );
}

const ShoppingCart = ({
  userLogin,
  setCheckoutPosition,
  cartItems,
  setCartItems,
  totalItems,
  subTotalPrice,
  baseUrl,
}) => {
  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function StringTruncate(string, maxLength = 25) {
    if (string.length <= maxLength) {
      return string;
    } else {
      return string.substring(0, maxLength) + "...";
    }
  }

  const deleteCart = (id_cart) => {
    Axios.delete(`${baseUrl}/api/client/deletecart/${id_cart}`).then(
      (response) => {
        if (response.data.success) {
          window.location.reload();
        } else if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Server might die!");
        }
      }
    );
  };

  return (
    <>
      <div className="pb-5">
        <h1 className="font-bold text-2xl">Shopping Cart</h1>
        <div className="flex w-full justify-between">
          <p className="text-xs font-semibold">{totalItems} items</p>
          <p className="text-xs font-semibold">{userLogin}</p>
        </div>
        <hr className="bg-black my-1 h-0.5 rounded" />
        <div className="flex flex-col gap-2 w-full py-1">
          {cartItems.length > 0
            ? cartItems.map((item, index) => (
                <div
                  key={item.id_cart}
                  className="flex gap-2 w-full py-1 bg-white pl-1 rounded-md shadow"
                >
                  <a href={`/product/${item.id_product}`}>
                    <img
                      src={`${baseUrl}/${item.img}`}
                      alt={item.name}
                      className="w-24 h-20"
                    />
                  </a>
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between pr-2">
                        <div className="font-bold truncate">
                          {StringTruncate(item.name)}
                        </div>
                        <RiDeleteBin6Line
                          className="text-lg"
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              "Are you sure want to delete this item ?"
                            );
                            if (isConfirmed) {
                              deleteCart(item.id_cart);
                            }
                          }}
                        />
                      </div>
                      <p className="text-zinc-700 text-sm font-light">
                        {StringTruncate(item.additional_info)}
                      </p>
                    </div>
                    <div className="w-full flex justify-between pr-2">
                      <div className="font-bold">
                        {dollar.format(item.quantity * item.price)}
                      </div>
                      <div className="flex gap-0.5 items-center">
                        <button
                          className="bg-red-500 p-1 w-6 h-5 rounded flex justify-center items-center shadow-md active:scale-95 duration-75"
                          onClick={async () => {
                            if (item.quantity > 1) {
                              const updatedCartItems = cartItems.map(
                                (cartItem, i) => {
                                  if (i === index) {
                                    return {
                                      ...cartItem,
                                      quantity: cartItem.quantity - 1,
                                    };
                                  }
                                  return cartItem;
                                }
                              );
                              setCartItems(updatedCartItems);
                            }
                          }}
                        >
                          <FaMinus className="text-xl text-white" />
                        </button>
                        <div className="bg-zinc-900 w-6 h-5 text-white rounded flex justify-center items-center font-semibold text-sm">
                          {item.quantity}
                        </div>
                        <button
                          className="bg-blue-500 p-1 w-6 h-5 rounded flex justify-center items-center active:scale-95 duration-75 shadow-md"
                          onClick={() => {
                            if (item.quantity < 10) {
                              const updatedCartItems = cartItems.map(
                                (cartItem, i) => {
                                  if (i === index) {
                                    return {
                                      ...cartItem,
                                      quantity: cartItem.quantity + 1,
                                    };
                                  }
                                  return cartItem;
                                }
                              );
                              setCartItems(updatedCartItems);
                            }
                          }}
                        >
                          <FaPlus className="text-xl text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : "Empty Cart, please add cart to checkout"}
          <div className="w-full py-2 flex px-1 justify-between items-center border-t-2 border-zinc-300">
            <div className="font-semibold">Sub Total</div>
            <div className="font-bold text-lg">
              {dollar.format(subTotalPrice)}
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center py-4">
            <button
              className={`py-2 rounded-xl bg-[#032ea1] font-bold text-white shadow-md shadow-black active:scale-95 duration-75 w-full ${
                cartItems.length < 1 ? "hidden" : ""
              }`}
              onClick={() => setCheckoutPosition("translate-y-0")}
            >
              Checkout
            </button>
            <a href="/" className="font-bold text-sm">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const NotAuth = () => {
  return (
    <>
      <div className="w-full px-2 flex flex-col items-center gap-2 py-2">
        <img src="assets/img/cart.png" alt="Cart" className="w-32" />
        <p className="text-sm text-zinc-700">Your cart is empty</p>
        <div className="flex w-full justify-center gap-2">
          <a
            href="/"
            className="border border-[#e00025] text-[#e00025] rounded-md w-32 text-sm py-2 flex justify-center"
          >
            Go Shopping
          </a>
          <a
            href="/login"
            className="bg-gradient-to-r from-[#032ea1] to-[#e00025] rounded-md w-32 text-white text-sm py-2 flex justify-center"
          >
            Sign in/Sign Up
          </a>
        </div>
      </div>
    </>
  );
};

const Checkout = ({
  setCheckoutPosition,
  cartItems,
  baseUrl,
  subTotalPrice,
  username,
}) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [pyMethod, setPyMethod] = useState("");
  const [bankNumber, setBankNumber] = useState("");

  const serviceFee = 0.5;
  const delivery = 1;
  const totalPayment = subTotalPrice + delivery + serviceFee;

  const getUserData = () => {
    Axios.get(`${baseUrl}/api/client/data/${username}`).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        setAddress(response.data[0].address);
      }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const dollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  function StringTruncate(string, maxLength = 25) {
    if (string.length <= maxLength) {
      return string;
    } else {
      return string.substring(0, maxLength) + "...";
    }
  }

  // temporary, static bank number
  useEffect(() => {
    const abaBank = "4465132548";
    const wingBank = "7542345865";

    if (pyMethod === "ABA") {
      setBankNumber(abaBank);
    } else if (pyMethod === "WING") {
      setBankNumber(wingBank);
    } else {
      setBankNumber("");
    }
  });

  const makeOrder = () => {
    const confirmation = window.confirm("Want to make an order?");
    if (confirmation === true) {
      let data = {
        username: username,
        address: address,
        items: cartItems,
        pyMethod: pyMethod,
        bankNumber: bankNumber,
        message: message,
        delivery: delivery,
        serviceFee: serviceFee,
        totalPayment: totalPayment,
      };
      Axios.post(`${baseUrl}/api/client/orders`, data).then((response) => {
        if (response.data.success) {
          alert("Order Success");
          navigate("/payment");
        } else if (response.data.error) {
          console.log(response.data.error);
        } else if (response.data.pending) {
          alert(response.data.pending);
        } else {
          console.log("Error, try again later!");
        }
      });
    } else {
      console.log("Order Canceled!");
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow py-2 px-2">
        <div className="w-full flex justify-center ">
          <p
            className="font-semibold text-zinc-600 underline"
            onClick={() => setCheckoutPosition("translate-y-[100%]")}
          >
            Back
          </p>
        </div>
        <div className="w-full py-1 px-2 bg-zinc-200 flex gap-1 rounded">
          <FiMapPin className="text-3xl" />
          <a href="/account/address" className="px-2">
            <h1 className="text-sm">Delivery Address</h1>
            <p className="text-xs txt">
              {address === null
                ? "Please add your real address here!"
                : address}
            </p>
          </a>
        </div>
        <div className="w-full py-2">
          {cartItems.map((item, index) => (
            <div
              key={item.id_cart}
              className="flex gap-2 w-full py-1 bg-zinc-200 pl-1 rounded"
            >
              <a href={`/product/${item.id_product}`}>
                <img
                  src={`${baseUrl}/${item.img}`}
                  alt={item.name}
                  className="w-24 h-20"
                />
              </a>
              <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col">
                  <div className="flex w-full justify-between pr-2">
                    <div className=" truncate">{StringTruncate(item.name)}</div>
                  </div>
                  <p className="text-zinc-700 text-sm font-light">
                    {StringTruncate(item.additional_info)}
                  </p>
                </div>
                <div className="w-full flex justify-between pr-2">
                  <div className="font-bold">
                    {dollar.format(item.quantity * item.price)}
                  </div>
                  <div className="flex gap-0.5 items-center">
                    <div className="text-zinc-800 rounded flex justify-center items-center font-semibold text-sm gap-1">
                      {item.quantity}
                      <span>item</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full py-2 flex px-1 justify-between items-center bg-zinc-200 rounded">
          <div className="">Order Total</div>
          <div className="font-bold text-lg">
            {dollar.format(subTotalPrice)}
          </div>
        </div>
        <div className="py-2 w-full">
          <div className="bg-zinc-200 w-full flex gap-2 justify-between px-2 rounded py-1">
            <label htmlFor="message" className="">
              Message
            </label>
            <input
              type="text"
              id="message"
              className="bg-zinc-200 outline-none flex-1 text-sm"
              placeholder="leave a message"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="pb-2 w-full">
          <div className="bg-zinc-200 w-full flex gap-2 justify-between px-2 py-1 rounded">
            <p className="">Delivery</p>
            <span className="font-semibold">{dollar.format(delivery)}</span>
          </div>
        </div>
        <div className="pb-2 w-full">
          <div className="bg-zinc-200 w-full flex gap-2 justify-between px-2 py-1 rounded">
            <p className="">Payment Method</p>
            <select
              name="pymethod"
              id="pymethod"
              className="bg-zinc-200"
              onChange={(e) => {
                setPyMethod(e.target.value);
              }}
            >
              <option value="">Choose</option>
              <option value="ABA">ABA BANK</option>
              <option value="WING">WING BANK</option>
            </select>
          </div>
        </div>
        <div className="pb-2 w-full">
          <div className="bg-zinc-200 w-full px-1 py-1 rounded">
            <div className="w-full flex gap-1 items-center pb-1">
              <PiNotepad />
              <p className="">Payment Details</p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-sm">Product Subtotal</p>
              <p className="text-sm font-semibold">
                {dollar.format(subTotalPrice)}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-sm">Shipping Subtotal</p>
              <p className="text-sm font-semibold">{dollar.format(1)}</p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-sm">Service Fee</p>
              <p className="text-sm font-semibold">
                {dollar.format(serviceFee)}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-lg">Total Payment</p>
              <p className="text-lg font-semibold">
                {dollar.format(totalPayment)}
              </p>
            </div>
          </div>
          <div className="w-full py-2">
            <button
              className="w-full bg-blue-500 rounded-md shadow-md py-2 font-bold text-lg text-white active:scale-95 duration-100"
              onClick={makeOrder}
            >
              Order
            </button>
            <p className="text-center text-xs">
              Please ensure all data is correct!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
