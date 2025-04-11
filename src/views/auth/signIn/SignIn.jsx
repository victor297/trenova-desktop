import * as React from "react";
import InputField from "@/components/fields/InputField";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLearnerLoginMutation, useLoginMutation } from "./../../../redux/api/usersApiSlice";
import Loader from "@/components/Loader";
import { setCredentials } from "./../../../redux/features/auth/authSlice";
import { toast } from "react-hot-toast";
import ForgetPassword from "@/components/ForgetPassword";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("user"); // "user" or "learner"
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [learnerLogin, { isLoading: isLearnerLoading }] = useLearnerLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleCloseModal = React.useCallback(() => {
    setEditModalOpen(false);
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const loginFunction = activeTab === "user" ? login : learnerLogin;
      const res = await loginFunction({ username, password }).unwrap();

      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="mb-16 mt-8 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="text-4xl mb-2.5 font-bold text-navy-700 dark:text-white">Sign In</h4>
        <p className="text-base mb-4 ml-1 text-gray-600">
          Enter your Username and password to sign in!
        </p>

        {/* Tab Switch */}
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 w-1/2 text-center border-b-2 ${
              activeTab === "user" ? "border-brand-500 font-bold" : "border-gray-300"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 w-1/2 text-center border-b-2 ${
              activeTab === "learner" ? "border-brand-500 font-bold" : "border-gray-300"
            }`}
            onClick={() => setActiveTab("learner")}
          >
            Learner Login
          </button>
        </div>

        <form onSubmit={submitHandler}>
          <InputField
            variant="auth"
            extra="mb-3"
            label="Username"
            id="username"
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <InputField
              variant="auth"
              extra="mb-3"
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between px-2">
            <p
              className="text-sm cursor-pointer font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              onClick={() => setEditModalOpen(true)}
            >
              Forgot Password?
            </p>
            {editModalOpen && <ForgetPassword isOpen={editModalOpen} onClose={handleCloseModal} />}
          </div>

          <button className="linear text-base mt-2 w-full rounded-xl bg-gold py-[12px] font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            {isLoading || isLearnerLoading ? "Signing In..." : "Sign In"}
          </button>
          {(isLoading || isLearnerLoading) && <Loader />}
        </form>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Learner Not registered yet?
          </span>
          <Link
            to={"/auth/signup"}
            className="text-sm ml-1 font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
