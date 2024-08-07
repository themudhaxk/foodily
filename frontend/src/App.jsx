import {Outlet} from "react-router-dom"
// import Nav from "./pages/auth/Nav"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./components/Navbar"
// import Navigation from "./components/Nav"

function App() {

  return (
    <>
      <ToastContainer />
      {/* <Navigation /> */}
      <Navbar className=''/>
      {/* <Nav /> */}
      <main className="py-3">
        <Outlet />
      </main>
    </>
  )
}

export default App
