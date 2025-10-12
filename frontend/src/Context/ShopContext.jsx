import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i <= 300; i++) cart[i] = 0;
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [token, setToken] = useState(localStorage.getItem('auth-token'));

  useEffect(() => {
  fetch('http://localhost:4000/allproducts')
    .then(res => res.json())
    .then(data => setAll_Product(data));
}, []);


useEffect(() => {
  const storedToken = localStorage.getItem('auth-token');
  if (storedToken) setToken(storedToken);
}, []);

useEffect(() => {
    if (!token) return;
    fetch('http://localhost:4000/getcart', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => setCartItems(data))
    .catch(err => console.error("Get cart error:", err));
  }, [token]);

const addToCart = (itemId) => {
    console.log("Adding itemId:", itemId);

    setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    const token = localStorage.getItem('auth-token');
    if (!token) {
        console.log("No auth-token found in localStorage!");
        return;
    }

    fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ itemId })
    })
    .then(res => res.json())
    .then(data => console.log("Add to cart response:", data))
    .catch(err => console.error("Add to cart error:", err));
};


  const removeFromCart = (itemId) => {
    console.log("Removing itemId:", itemId);

    setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    const token = localStorage.getItem('auth-token');
    if (!token) {
        console.log("No auth-token found in localStorage!");
        return;
    }

    fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ itemId })
    })
    .then(res => res.json())
    .then(data => console.log("Remove from cart response:", data))
    .catch(err => console.error("Remove from cart error:", err));
};


  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = all_product.find(p => p.id === Number(item));
        if (product) total += product.new_price * cartItems[item];
      }
    }
    return total;
  };

  const getTotalCartItems = () => {
    let total = 0;
    for (const item in cartItems) if (cartItems[item] > 0) total += cartItems[item];
    return total;
  };

  const login = (tokenFromBackend) => {
    localStorage.setItem('auth-token', tokenFromBackend);
    setToken(tokenFromBackend);
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setCartItems(getDefaultCart());
  };

  return (
    <ShopContext.Provider value={{
      all_product,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      getTotalCartItems
    }}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
