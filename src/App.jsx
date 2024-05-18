import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeDesktop from "./components/desktop/HomeDesktop";
import HomeMobile from "./components/mobile/HomeMobile";
import { useEffect, useState } from "react";
import MenuMobile from "./components/mobile/MenuMobile";
import CategoriesMobile from "./components/mobile/CategoriesMobile";
import CartMobile from "./components/mobile/CartMobile";
import AccountMobile from "./components/mobile/AccountMobile";
import CategoryMobile from "./components/mobile/CategoryMobile";
import ProductMobile from "./components/mobile/ProductMobile";
import RegisterMobile from "./components/mobile/RegisterMobile";
import LoginUserMobile from "./components/mobile/LoginUserMobile";
import AccountSettingsMobile from "./components/mobile/AccountSettingsMobile";
import AddressMobile from "./components/mobile/AccountAddressMobile";
import CreateStore from "./components/mobile/CreateStore";
import StoreMobile from "./components/mobile/StoreMobile";
import AddProductMobile from "./components/mobile/AddProductMobile";
import Orders from "./components/mobile/OrdersMobile";
import Payment from "./components/mobile/PaymentMobile";
import Search from "./components/mobile/SearchMobile";
import OrderRequest from "./components/mobile/OrderRequest";
import OrderShipping from "./components/mobile/OrderShipping";
import OrderComplete from "./components/mobile/OrderComplete";

function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Router>
        <div>
          <div className="max-w-[360px] mx-auto">
            <Routes>
              <Route path="/" element={<HomeMobile />} />
              <Route path="/cart" element={<CartMobile />} />
              <Route path="/categories" element={<CategoriesMobile />} />
              <Route path="/category/:category" element={<CategoryMobile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/product/:id" element={<ProductMobile />} />
              <Route path="/login" element={<LoginUserMobile />} />
              <Route path="/register" element={<RegisterMobile />} />
              <Route path="/account" element={<AccountMobile />} />
              <Route
                path="/account/settings"
                element={<AccountSettingsMobile />}
              />
              <Route path="/account/address" element={<AddressMobile />} />
              <Route path="/account/openstore" element={<CreateStore />} />
              <Route path="/account/store" element={<StoreMobile />} />
              <Route path="/account/orders" element={<Orders />} />
              <Route path="/account/store/request" element={<OrderRequest />} />
              <Route
                path="/account/store/complete"
                element={<OrderComplete />}
              />
              <Route
                path="/account/store/shipping"
                element={<OrderShipping />}
              />
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/account/store/addproduct"
                element={<AddProductMobile />}
              />
            </Routes>
          </div>
          <div className="fixed w-full mx-auto py-2 bottom-0 bg-white border-t-2">
            <div className="mx-auto w-[360px]">
              <MenuMobile />
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
