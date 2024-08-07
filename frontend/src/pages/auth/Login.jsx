import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
// import Card from "../../components/card/Card";
import loginImg from "../../assets/login.png";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <>
      <section className="container auth">
        <div className="img ml-5 mr-5 hidden md:block">
          <img src={loginImg} alt="login" width="500" />
        </div>
          <div className="form">
            <h2 className="text-3xl font-semibold mr-[26rem]">Sign In</h2>
            <form onSubmit={submitHandler} className="container w-[100%]">
              <input
                className="border rounded w-full mt-1 p-2"
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border rounded w-full mt-1 p-2"
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                disabled={isLoading}
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
              {isLoading && <Loader />}
            </form>

            <span className="register text-xl font-semibold mr-[17rem]">
              <p className="text-black">New Customer?</p>
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className=" ml-2 text-pink-500 hover:underline"
              >
                Register
              </Link>
            </span>
          </div>
      </section>
      </>
  );
};

export default Login;
