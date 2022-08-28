import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { signInUser } from "../../redux/userSlice";
import { signInWithEmailAndPassword } from "../../src/firebase/util";

const SignIn = ({ closeDialog, toggleForm }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    const user = await signInWithEmailAndPassword(email, password);
    dispatch(signInUser(user));
    closeDialog();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto">
      <div className="py-2 flex flex-col">
        <label htmlFor="email">email</label>
        <input
          className="border-b-2 border-gray-400 border-solid"
          {...register("email", { required: "Email Address is required" })}
        />
      </div>
      <div className="py-2 flex flex-col">
        <label htmlFor="pass">Password</label>
        <input
          className="border-b-2 border-gray-400 border-solid"
          {...register("password", {
            required: "Password is required",
            minLength: 8,
          })}
          type="password"
        />
      </div>

      <div className="flex py-4">
        <button type="submit" className="py-2 bg-blue-500 text-white w-full">
          Sign In
        </button>
      </div>
      <p className="text-center">or</p>
      <button
        // onClick={signInWithGoogle}
        className="bg-red-500 hover:bg-red-600 w-full py-2 text-white"
      >
        Sign In with Google
      </button>

      <p className="text-center">
        Dont have an account?{" "}
        <button
          onClick={() => toggleForm()}
          className="text-blue-500 hover:text-blue-600"
        >
          Sign up here
        </button>
      </p>
    </form>
  );
};

export default SignIn;
