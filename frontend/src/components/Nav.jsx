import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 md:block">
      <div className="flex justify-around items-center">
        <Link to="/products" className="text-white">Products</Link>
        <Link to="/cart" className="text-white">Cart</Link>
        <Link to="/login" className="text-white">Login</Link>
      </div>
    </nav>
  );
};

export default Navigation;