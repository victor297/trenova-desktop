import * as React from "react";
import InputField from "@/components/fields/InputField";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./../../../redux/api/usersApiSlice";
import Loader from "@/components/Loader";
import { setCredentials } from "./../../../redux/features/auth/authSlice";
import { toast } from "react-hot-toast";
import ForgetPassword from "@/components/ForgetPassword";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleCloseModal = React.useCallback(() => {
    setEditModalOpen(false);
  }, []);
  useEffect(() => {
    console.log(username, password);
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const res = await login({ username, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <div className="mb-16 mt-8 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className=" w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="text-4xl mb-2.5 font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="text-base mb-4 ml-1 text-gray-600">
          Enter your Username and password to sign in!
        </p>
        <form onSubmit={submitHandler}>
          {/* Username */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Username"
            id="username"
            required
            type="text"
            value={username} // Use email state
            onChange={(e) => setUsername(e.target.value)} // Update email state
          />

          {/* Password */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <p
              className="text-sm cursor-pointer font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              onClick={() => setEditModalOpen(true)}
            >
              Forgot Password?
            </p>
            {editModalOpen && (
              <ForgetPassword
                isOpen={editModalOpen}
                onClose={handleCloseModal}
              />
            )}
          </div>
          <button className="linear text-base mt-2 w-full rounded-xl bg-gold py-[12px] font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {isLoading && <Loader />}
        </form>
      </div>
    </div>
  );
}
