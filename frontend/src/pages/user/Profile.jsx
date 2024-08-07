import {Link} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Loader from "../../components/Loader"
import {setCredentials} from "../../redux/features/auth/authSlice"
import { useEffect, useState } from "react"
import { useProfileMutation } from "../../redux/api/userApiSlice"


const Profile = () => {
    const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const {userInfo} = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()

    useEffect(() => {
        setUsername(userInfo.username)
        setEmail(userInfo.email)
        setPhone_number(userInfo.phone_number)
    }, [userInfo.email, userInfo.username, userInfo.phone_number])

    const submitHandler = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
          } else {
            try {
              const res = await updateProfile({ _id: userInfo._id, username, email, phone_number, password }).unwrap();
              dispatch(setCredentials({ ...res }));
              toast.success("User successfully updated");
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.message || err.message);
            }
          }
    }


  return <div className="container mx-auto p-4 mt-[10rem]">
    <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
        <h2 className="text-2xl text-black font-semibold mb-4">Update Profile</h2>
            <form className="w-full max-w-[400px]" onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="username">
                    Username
                    </label>
                    <input
                    className="form-input p-4 rounded-sm w-full"
                    id="username"
                    placeholder="Enter name..."
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="email">
                    Email
                    </label>
                    <input
                    className="form-input p-4 rounded-sm w-full"
                    id="email"
                    placeholder="Enter email..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="email">
                    Phone Number
                    </label>
                    <input
                    className="form-input p-4 rounded-sm w-full"
                    id="phone_number"
                    placeholder="Enter Phone Number..."
                    type="number"
                    value={phone_number}
                    onChange={(e) => setPhone_number(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black mb-2">
                    Password
                    </label>
                    <input
                    className="form-input p-4 rounded-sm w-full"
                    id="password"
                    placeholder="Enter password..."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black mb-2">
                    Confirm Password
                    </label>
                    <input
                    className="form-input p-4 rounded-sm w-full"
                    id="confirmPassword"
                    placeholder="Confirm password..."
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]">
                        Update
                    </button>
                    <Link to="/user-orders" className="bg-pink-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-700 my-[1rem]">
                        My Orders
                    </Link>
                </div>
            </form>
        </div>
        {loadingUpdateProfile && <Loader />}
    </div>
  </div>
}

export default Profile
