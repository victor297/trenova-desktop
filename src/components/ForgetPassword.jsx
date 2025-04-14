import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import InputField from "./fields/InputField";
import { useForm } from "react-hook-form";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
} from "../redux/api/usersApiSlice";
import { toast } from "react-hot-toast";

export default function ForgetPassword({ isOpen, onClose }) {
  const [forget, SetForget] = useState(true);
  const [ForgetPassword, { isLoading }] = useForgetPasswordMutation();
  const {
    register,
    handleSubmit: submit,
    formState: { errors, isSubmitting: forgetting },
  } = useForm();
  const [ResetPassword] = useResetPasswordMutation();

  const onForget = async (data) => {
    try {
      await ForgetPassword(data)
        .unwrap()
        .then(() => {
          toast.success("OTP sent to email successfully");
          SetForget(false);
        })
        .catch((error) =>
          error.status === 401
            ? toast.error("Unauthorized")
            : toast.error(error?.data?.message || "Something went wrong")
        );
    } catch (err) {
      toast.error(err?.error?.message || "An error occurred");
    }
  };

  const onReset = async (data) => {
    try {
      await ResetPassword({
        data: data,
        otp: data.otp,
      })
        .unwrap()
        .then(() => {
          toast.success("Updated successfully");
          onClose();
        })
        .catch((error) =>
          error.status === 401
            ? toast.error("Unauthorized")
            : toast.error(error?.data?.message || "Something went wrong")
        );
    } catch (err) {
      toast.error(err?.error?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex justify-center ">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Reset Password
                  </DialogTitle>
                  <div className="mt-2">
                    <form>
                      <div className="mt-2">
                        <InputField
                          variant="auth"
                          extra="mb-3"
                          placeholder="Email"
                          id="email"
                          type="email"
                          required
                          register={register}
                        />
                        {!forget && (
                          <>
                            <InputField
                              variant="auth"
                              extra="mb-3"
                              label="OTP"
                              placeholder="OTP"
                              id="otp"
                              required
                              type="text"
                              register={register}
                            />
                            <InputField
                              variant="auth"
                              extra="mb-3"
                              label="Password"
                              placeholder="Min. 8 characters"
                              id="password"
                              required
                              type="text"
                              register={register}
                            />
                            <InputField
                              variant="auth"
                              extra="mb-3"
                              label="Confirm Password"
                              placeholder="Min. 8 characters"
                              id="passwordConfirm"
                              required
                              type="text"
                              register={register}
                            />
                          </>
                        )}
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          onClick={submit(onForget)}
                          className="border-transparent text-base sm:text-sm inline-flex w-full justify-center rounded-md border bg-blue px-4 py-2 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                          disabled={forgetting}
                        >
                          {forgetting ? "Sending..." : "Send OTP"}
                        </button>
                        {!forget && (
                          <button
                            type="button"
                            onClick={submit(onReset)}
                            className="border-transparent text-base sm:text-sm inline-flex w-full justify-center rounded-md border bg-gold px-4 py-2 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                            disabled={forgetting}
                          >
                            {forgetting ? "Submitting..." : "Submit"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-base sm:text-sm mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
