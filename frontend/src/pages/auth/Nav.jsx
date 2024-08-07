import { useState } from "react"
import {AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart} from 'react-icons/ai'
import {FaHeart} from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import "./Nav.css"
import {useSelector, useDispatch} from "react-redux"
import {useLogoutMutation} from "../../redux/api/userApiSlice"
import {logout} from "../../redux/features/auth/authSlice"
import FavoritesCount from "../products/FavoritesCount"


const Nav = () => {

  const {userInfo} = useSelector(state => state.auth)
  const { cartItems } = useSelector((state) => state.cart);

  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [showSidebar, setShowSideBar] = useState(false)

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen)
  }

  const toggleSideBar = () => {
    setShowSideBar(!showSidebar)
  }

  const closeSideBar = () => {
    setShowSideBar(false)
  }

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed `}
      id="nav-container"
    >
      <div className="flex flex-col justify-center space-y-4">
      <div className="flex relative">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">HOME</span>{" "}
          </Link>
        </div>

        <div className="flex relative">
          <Link
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">SHOP</span>{" "}
          </Link>
        </div>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">CART</span>{" "}
          

          <div className="absolute left-2 top-8">
            {cartItems.length > 0 && (
              <span>
                <span className="px-2 py-0.5 text-sm text-white bg-red-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
            </div>
          </div>
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
            <FaHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">
              Favorites
            </span>{" "}
            <FavoritesCount />
          </div>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropDown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropDownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropDownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropDownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 2xl:mr-20 xl:mr-9 lg:mr-6 md:mr-4 sm:mr-4 sm:mt-[-12px] space-y-2 bg-gray-900 text-white ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                <span className="hidden nav-item-name">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd size={26} />
                <span className="hidden nav-item-name">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Nav
