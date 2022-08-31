import React from "react";
import { useForm } from "react-hook-form";

// import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword } from "../../src/firebase/user.firebase";

const SignUp = ({ closeDialog, toggleForm }) => {
  // const [updateProfile, updating, updateError] = useUpdateProfile(auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password, confirmPassword, displayName } = data;
    if (password === confirmPassword) {
      await createUserWithEmailAndPassword(email, password, {
        sendEmailVerification: false,
        displayName,
      });
      closeDialog();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto">
      <div className="py-1 md:py-2 flex flex-col">
        <label>Display name</label>
        <input
          {...register("displayName", { required: "Name Address is required" })}
          className="border-b-2 border-gray-400 border-solid"
          type="text"
          required
        />
      </div>
      <div className="py:1 md:py-2 flex flex-col">
        <label htmlFor="email">email</label>
        <input
          className="border-b-2 border-gray-400 border-solid"
          {...register("email", { required: "Email Address is required" })}
          type="email"
          required
        />
      </div>
      <div className="py-1 md:py-2 flex flex-col">
        <label htmlFor="pass">Password</label>
        <input
          className="border-b-2 border-gray-400 border-solid"
          {...register("password", {
            minLength: 8,
            required: "Password is required",
          })}
          type="password"
          minLength="8"
          required
        />
      </div>
      <div className="py-1 md:py-2 flex flex-col">
        <label htmlFor="pass">Confirm Password</label>
        <input
          className="border-b-2 border-gray-400 border-solid"
          {...register("confirmPassword", {
            minLength: 8,
            required: "Password is required",
          })}
          type="password"
          minLength="8"
          required
        />
      </div>
      <div className="flex py-2 md:py-4">
        <button type="submit" className="py-2 bg-blue-500 text-white w-full">
          Sign up
        </button>
      </div>
      <p className="text-center">or</p>
      <button
        // onClick={signInWithGoogle}
        className="bg-red-500 hover:bg-red-600 w-full py-1 md:py-2 text-white"
      >
        Sign In with Google
      </button>
      <p className="text-center">
        Already have an account?
        <button
          onClick={() => toggleForm()}
          className="text-blue-500 hover:text-blue-600"
        >
          Sign in here
        </button>
      </p>
    </form>
  );
};

export default SignUp;
