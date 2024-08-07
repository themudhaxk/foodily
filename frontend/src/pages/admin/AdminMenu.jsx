import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-[#151515] p-2 fixed rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="bg-[#151515] p-4 fixed right-7 top-5">
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
                Add Food
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
                All Foods
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
  );
};

export default AdminMenu;
