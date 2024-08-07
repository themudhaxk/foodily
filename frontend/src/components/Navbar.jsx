import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { FaRegUser, FaTimes } from "react-icons/fa";
import { CgMenuGridO } from "react-icons/cg";
import { FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import {
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxExit } from "react-icons/rx";
//import "./Navbar.css";

export const logo = (
  <Link to="/">
    <h2 className="w-16 text-white font-sans text-3xl cursor-pointer">
      <span className="text-red-500">F</span>
      <span className="text-white">O</span>
      <span className="text-white">O</span>
      <span className="text-red-500">D</span>
      <span className="text-red-500">I</span>
      <span className="text-red-500">L</span>
      <span className="text-red-500">Y</span>
    </h2>
  </Link>
);

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  const [showMenu, setShowMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(true);
  };

  const unToggleMenu = () => {
    setShowMenu(false);
  };

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu);
  };

  const unToggleAdminMenu = () => {
    setShowAdminMenu(false);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header
      style={{ zIndex: "20" }}
      className="bg-green-600 sticky top-0 left-0 right-0"
    >
      <nav className="flex justify-between items-center w-[92%] mx-auto h-[80px] bg-green-600 relative">
        <div>{logo}</div>
        <div
          className={`${
            !showMenu ? "md:static" : "hidden md:static"
          } absolute bg-green-600 md:min-h-fit`}
        >
          <ul className="flex md:flex-row flex-col ml-8 md:items-center gap-[4vw]">
            <div className="flex relative">
              <Link
                to="/shop"
                className="md:flex items-center transition-transform transform hover:font-semibold hidden"
              >
                <AiOutlineShopping className="mr-2" size={30} />
                <span className="text-white text-2xl font-sans">FOODS</span>{" "}
              </Link>
            </div>
          </ul>
        </div>

        <div className="flex items-center text-2xl gap-6">
          {userInfo ? (
            <span className="text-white flex relative">
              <Link
                to="/profile"
                className="flex text-red-500 items-center hover:font-semibold"
              >
                <FaRegUser />
                Hello!
                <span className="text-red-500 ml-1 hidden sm:block">
                  {" "}
                  {userInfo.username?.substring(0, 8)}
                </span>
                ..
              </Link>
            </span>
          ) : (
            <></>
          )}
          <Link to="/favorite" className="">
            <div className="flex items-center transition-transform transform hover:font-bold">
              <FaHeart className="" size={30} />
              <div className="absolute left-5 top-[-10px]">
                {favoriteCount > 0 && (
                  <span className="px-3 py-1.5 text-lg font-extrabold text-white bg-red-500 rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </div>
            </div>
          </Link>

          <Link to="/cart" className="">
            <div className="flex items-center transition-transform transform hover:font-bold">
              <AiOutlineShoppingCart className="" size={31} />
              <div className="absolute left-5 top-[-11px]">
                {cartItems.length > 0 && (
                  <span>
                    <span className="px-3 py-1.5 text-lg font-extrabold text-white bg-red-500 rounded-full">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </Link>
          {!userInfo && (
            <>
              <Link to="/login">
                <button className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#cd93fd] hidden sm:block md:block">
                  LOGIN
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-[#cda6ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec] hidden sm:block md:block">
                  REGISTER
                </button>
              </Link>
            </>
          )}

          {userInfo && (
            <>
              <button
                className="bg-[#f15028] text-white px-5 py-2 rounded-full hover:bg-[#87acec] hidden sm:block md:block"
                onClick={logoutHandler}
              >
                LOGOUT
              </button>
            </>
          )}

          {userInfo && userInfo.isAdmin && (
            <>
              <CgMenuGridO
                onClick={toggleAdminMenu}
                className={`text-5xl cursor-pointer ${
                  showAdminMenu ? "hidden" : ""
                }`}
              />
              <FaTimes
                onClick={unToggleAdminMenu}
                className={`text-5xl cursor-pointer ${
                  showAdminMenu ? "" : "hidden"
                }`}
              />
            </>
          )}
          <AiOutlineMenu
            onClick={toggleMenu}
            className={`text-5xl cursor-pointer md:hidden ${
              showMenu ? "hidden" : ""
            }`}
          />
          <FaTimes
            onClick={unToggleMenu}
            className={`text-5xl cursor-pointer md:hidden ${
              showMenu ? "" : "hidden"
            }`}
          />
        </div>
      </nav>
      {showMenu && (
        <ul className="md:static md:hidden flex md:flex-row flex-col md:items-center gap-[4vw] ml-[3rem]">
          <li>
            <div className="flex relative mt-5">
              <Link
                to="/shop"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineShopping className="mr-2 mt-[4px]" size={26} />
                <span className="text-white">FOODS</span>{" "}
              </Link>
            </div>
          </li>
          <li>
            <Link to="/cart" className="">
              <div className="flex items-center transition-transform transform hover:translate-x-2">
                <AiOutlineShoppingCart className="mr-2 mt-[4px]" size={26} />
                <span className="">CART</span>{" "}
                <div className="absolute left-2 top-[-11px]">
                  {cartItems.length > 0 && (
                    <span>
                      <span className="px-1 py-0 text-sm text-white bg-red-500 rounded-full">
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/cart" className="">
              <div className="flex items-center transition-transform transform hover:translate-x-2">
                <FaHeart className="mr-2 mt-[4px]" size={23} />
                <span className="">FAVORITE</span>{" "}
                <div className="absolute left-2 top-[-11px]">
                  {favoriteCount > 0 && (
                    <span className="px-1 py-0 text-sm text-white bg-red-500 rounded-full">
                      {favoriteCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
          {userInfo && (
            <ul className="md:static md:hidden flex md:flex-row flex-col md:items-center gap-[4vw]">
              <li>
                <span className="text-white flex relative">
                  <Link
                    to="/profile"
                    className="flex items-center transition-transform transform hover:translate-x-2"
                  >
                    <FaRegUser className="mr-2 mt-[4px]" size={23} />
                    PROFILE
                  </Link>
                </span>
              </li>
              <li>
                <span className="text-white flex relative mb-5">
                  <button
                    onClick={logoutHandler}
                    className="flex items-center transition-transform transform hover:translate-x-2"
                  >
                    <RxExit className="mr-2 mt-[4px]" size={23} />
                    LOGOUT
                  </button>
                </span>
              </li>
            </ul>
          )}
          {!userInfo && (
            <ul className="md:static md:hidden flex md:flex-row flex-col md:items-center gap-[4vw]">
              <li>
                <Link
                  to="/login"
                  className="flex items-center transition-transform transform hover:translate-x-2"
                >
                  <AiOutlineLogin className="mr-2 mt-[4px]" size={23} />
                  <span className="">LOGIN</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center transition-transform transform hover:translate-x-2 mb-5"
                >
                  <AiOutlineUserAdd className="mr-2 mt-[4px]" size={23} />
                  <span className="">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </ul>
      )}
      <div>
        {/* <button className={`${showAdminMenu ? "top-2 right-2" : "top-7 right-7"} bg-[#151515] p-2 fixed rounded-lg`} onClick={toggleAdminMenu}>
        {showAdminMenu ? (
            <FaTimes color='white' />
        ) : (
            <>
                <div className="w-6 h-0.5 bg-white my-1"></div>
                <div className="w-6 h-0.5 bg-white my-1"></div>
                <div className="w-6 h-0.5 bg-white my-1"></div>
            </>
        )}
      </button> */}

        {showAdminMenu && userInfo.isAdmin && (
          <section className="bg-green-600 p-4 fixed right-7 top-50">
            <ul className="list-none mt-2">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className="list-items block px-4 py-2 hover:bg-gray-700 rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "red" : "white",
                  })}
                >
                  Admin Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/categorylist"
                  className="list-items block px-4 py-2 hover:bg-gray-700 rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "red" : "white",
                  })}
                >
                  Create Category
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/productlist"
                  className="list-items block px-4 py-2 hover:bg-gray-700 rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "red" : "white",
                  })}
                >
                  Create Product
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/allproductslist"
                  className="list-items block px-4 py-2 hover:bg-gray-700 rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "red" : "white",
                  })}
                >
                  All Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/userlist"
                  className="list-items block px-4 py-2 hover:bg-gray-700 rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "red" : "white",
                  })}
                >
                  Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/orderlist"
                  className="list-items block px-4 py-2 hover:bg-gray-700 rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "red" : "white",
                  })}
                >
                  Manage Orders
                </NavLink>
              </li>
            </ul>
          </section>
        )}
      </div>
    </header>
  );
};

export default Navbar;
