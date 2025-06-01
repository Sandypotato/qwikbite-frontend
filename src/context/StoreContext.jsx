// src/context/StoreContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";

  // 1) token: initially null, then either the stored token or "" if none
  const [token, setToken] = useState(null);

  // 2) admin: null while we’re checking; then true/false
  const [admin, setAdmin] = useState(null);

  // 3) a “loading auth” flag
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [food_list, setFoodList] = useState([]);

  // Add to Cart / Remove from Cart / getTotalCartAmount (unchanged) …

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error adding to cart");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Item removed from cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error removing from cart");
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        alert("Error! Products are not fetching.");
      }
    } catch (err) {
      console.error("fetchFoodList error:", err);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (err) {
      console.error("loadCartData error:", err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // 1) Load token from localStorage (if any)
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);

        // 2) Immediately attempt to load “/api/user/profile” to see if user is admin
        try {
          const profileRes = await axios.get(url + "/api/user/profile", {
            headers: { token: storedToken },
          });
          // We expect profileRes.data to have something like { user: { role: "admin" } }
          setAdmin(profileRes.data.user.role === "admin");
        } catch (err) {
          console.warn("Failed to fetch user profile:", err);
          setAdmin(false);
        }

        // 3) Load existing cart contents
        await loadCartData(storedToken);
      } else {
        setToken("");
        setAdmin(false);
      }

      // 4) Fetch food list whether or not user is logged in
      await fetchFoodList();

      // 5) Done checking everything
      setCheckingAuth(false);
    };

    initialize();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    admin,
    checkingAuth,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
