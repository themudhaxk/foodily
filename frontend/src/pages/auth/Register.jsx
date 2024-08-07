import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import registerImg from "../../assets/register.png";
// import Card from '../../components/card/Card'
import "./auth.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password, phone_number }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <>
      <section className="container auth">
        <div className="form mr-20">
          <h1 className="text-3xl font-semibold mb-4 items-center">Register</h1>
          <form onSubmit={submitHandler} className="w-[100%]">
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              id="phone_number"
              placeholder="Enter phone number"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
            />
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && <Loader />}
          </form>

          <span className="mt-4">
            <p className="text-black">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-pink-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </span>
        </div>
        <div className="img ml-5 hidden md:block">
          <img src={registerImg} alt="register" className="w-[100%]" />
        </div>
      </section>
    </>
  );
};

export default Register;
