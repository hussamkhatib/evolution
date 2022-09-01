import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { completeCheckout } from "../../src/firebase/helper";
import { addOrder } from "../../src/redux/allOrders";
import {
  cartSelector,
  setInitialOrder,
  shippingAddressSelector,
  totalAmountSelector,
} from "../../src/redux/orderSlice";
import { closeSlider } from "../../src/redux/sliderSlice";
import { ReadOnlyCartItems } from "../Cart/CartItems";
import Modal from "../common/Modal";
import { EditShippingAddress } from "./ShippingAddress";

const Checkout = () => {
  const dispatch = useDispatch();
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const cart = useSelector(cartSelector);
  const shippingAddress = useSelector(shippingAddressSelector);
  const total = useSelector(totalAmountSelector);
  const idRef = useRef();

  const placeOrder = async () => {
    const { id, orderCompletedAt } = await completeCheckout(
      cart,
      shippingAddress,
      total
    );
    idRef.current = id;
    dispatch(
      addOrder({
        prodcuts: cart,
        total,
        shippingAddress,
        orderCompletedAt,
      })
    );
    setIsOrderCompleted(true);
  };

  return (
    <div>
      <section className="mb-4">
        <h3 className="mb-6 text-lg font-semibold">Shipping Address</h3>
        <EditShippingAddress shippingAddress={shippingAddress} />
      </section>
      <section>
        <h3 className="mb-6 text-lg font-semibold">Order List</h3>
        <ReadOnlyCartItems cart={cart} />
      </section>
      <h3 className="my-6 text-lg font-semibold text-end">Total: Rs {total}</h3>
      <button
        disabled={isOrderCompleted}
        className="w-full flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
        onClick={() => placeOrder()}
      >
        Complete Order
      </button>
      {isOrderCompleted && (
        <Modal
          main={<OrderSucessfull id={idRef.current} />}
          state={{ open: isOrderCompleted, setOpen: setIsOrderCompleted }}
          onClose={() => {
            dispatch(closeSlider());
            dispatch(setInitialOrder());
          }}
        />
      )}
    </div>
  );
};

export default Checkout;

const OrderSucessfull = ({ id }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const viewOrder = () => {
    /* TODO: add this page */
    router.push(`/order/${id}`);
    dispatch(closeSlider());
    dispatch(setInitialOrder());
  };
  return id ? (
    <div>
      <h1 className="text-center font-bold text-xl">Order Successfull!</h1>
      <p className="text-center my-2">
        You have successfully completed the order.
      </p>
      <button
        className="w-full flex items-center justify-center px-3 mt-2 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
        onClick={() => viewOrder()}
      >
        View Order
      </button>
    </div>
  ) : null;
};
