import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createRoutesFromElements } from "react-router-dom"
import { createBrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux"
import store from './redux/store.js'

// Private Route
import PrivateRoute from './components/PrivateRoute.jsx'


// Admin Route

import CategoryList from './pages/admin/CategoryList.jsx'
import AdminRoute from './pages/admin/AdminRoute.jsx'
import UserList from './pages/admin/UserList.jsx'
import ProductList from './pages/admin/ProductList.jsx'
import ProductUpdate from './pages/admin/ProductUpdate.jsx'

// Auth
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

import Profile from './pages/user/Profile.jsx'
import AllProducts from './pages/admin/AllProducts.jsx'
import Home from './pages/Home.jsx'
import Favorites from './pages/products/Favorites.jsx'
import ProductDetails from './pages/products/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Foods from './pages/Foods.jsx'
import Shipping from './pages/orders/Shipping.jsx'
import PlaceOrder from './pages/orders/PlaceOrder.jsx'
import Order from './pages/orders/Order.jsx'
import UserOrder from './pages/user/UserOrder.jsx'
import OrderList from './pages/admin/OrderList.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import OrderPlacedSuccessfully from './pages/orders/OrderPlacedSuccessfully.jsx'
import CategoryDetails from './pages/products/CategoryDetails.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} /> 
      <Route index={true} path='/' element={<Home />} /> 
      <Route path='/favorite' element={<Favorites />} /> 
      <Route path='/product/:id' element={<ProductDetails />} />
      <Route path='/category/:id' element={<CategoryDetails />} />  
      <Route path='/cart' element={<Cart />} /> 
      <Route path='/shop' element={<Foods />} /> 
      <Route path='/user-orders' element={<UserOrder />} /> 

      <Route path='' element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/orderplacedsuccessfully" element={<OrderPlacedSuccessfully />} />
      </Route>

      <Route path='/admin' element={<AdminRoute />} >
        <Route path='userlist' element={<UserList />} />
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='categorylist' element={<CategoryList />} />
        <Route path='productlist' element={<ProductList />} />
        <Route path='orderlist' element={<OrderList />} />
        <Route path='allproductslist' element={<AllProducts />} />
        <Route path='product/update/:_id' element={<ProductUpdate />} />
      </Route>

    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
