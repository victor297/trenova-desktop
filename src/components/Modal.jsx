// Modal.jsx
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import InputField from "./fields/InputField";
import { useForm } from "react-hook-form";
import { useUpdateUserMutation } from "../redux/api/usersApiSlice";
import { toast } from "react-hot-toast";

export default function Modal({ isOpen, onClose, school, refetch }) {
  // const cancelButtonRef = useRef(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (isOpen && school) {
      setValue("name", school.name);
      setValue("username", school.username);
      setValue("point", school.point);
      setValue("availableSpace", school.availableSpace);
      // setValue("isActivated", school.isActivated);
    }
  }, [isOpen, school, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!school || !school.id) {
        throw new Error("School ID is not defined.");
      }
      await updateUser({
        id: school.id,
        data: data,
      });
      toast.success("updated succefully");
      refetch();
      console.log(data);
      onClose();
    } catch (err) {
      console.log("err", err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        // initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit School
                </Dialog.Title>
                <div className="justify-center sm:flex sm:items-start">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-2">
                      {/* Your InputField components */}
                      <InputField
                        variant="auth"
                        extra="mb-3"
                        label="point*"
                        placeholder="100"
                        id="point"
                        required
                        type="text"
                        register={register}
                      />
                      <InputField
                        variant="auth"
                        extra="mb-3"
                        label="name*"
                        placeholder="LearnNova"
                        id="name"
                        required
                        type="text"
                        register={register}
                      />
                      <InputField
                        variant="auth"
                        extra="mb-3"
                        label="availableSpace
                        *"
                        placeholder="available Space
                        "
                        id="availableSpace"
                        required
                        type="text"
                        register={register}
                      />
                      <label htmlFor="">Activate/deactivate school</label>
                      <select
                        className="mt-1 mb-2 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
                        id="isActivated"
                        {...register("isActivated")}
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                      <label htmlFor="">Activate 3rd term</label>
                      <select
                        className="mt-1 mb-2 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
                        id="isExtraTerm"
                        {...register("isExtraTerm")}
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                      <label htmlFor="">Activate Previous term</label>
                      <select
                        className="mt-1 mb-2 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
                        id="ispreviousTerm"
                        {...register("ispreviousTerm")}
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>

                      <InputField
                        variant="auth"
                        extra="mb-3"
                        label="Username*"
                        placeholder="LearnNova123"
                        id="username"
                        required
                        type="text"
                        register={register}
                      />
                      <InputField
                        variant="auth"
                        extra="mb-3"
                        label="Password*"
                        placeholder="Min. 8 characters"
                        id="password"
                        type="password"
                        register={register}
                        // Bind 'password' field to react-hook-form
                      />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="submit"
                        className="border-transparent text-base sm:text-sm inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                        // onClick={onClose}
                      >
                        submit
                      </button>
                      <button
                        className="text-base sm:text-sm mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto"
                        onClick={onClose}
                        // ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
