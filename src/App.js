import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { updateUser, updateUserCartQuantity } from './Redux/reducers/user';
import nutritivApi from './Api/nutritivApi';
import { Elements } from '@stripe/react-stripe-js';
import Register from './Components/Register.js';
import Login from './Components/Login.js';
import Profile from './Components/Profile';
import { Products } from './Components/Products';
import { CheckoutSuccess } from './Components/CheckoutSuccess';
import { CheckoutCancel } from './Components/CheckoutCancel';
import { ProductPage } from './Components/ProductPage';
import { Cart } from './Components/Cart';
import { Welcome } from './Components/Homepage';
import { PageNotFound } from './Components/PageNotFound';
import { ChatConnection } from './Components/ChatConnection';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Components/Navbar';

// init stripe
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

function App() {
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.user.loggedIn)
  const location = useLocation();

  // ON LOAD
  // Fetch user-self info
  useEffect(() => {
    let isSubscribed = true;
    
    if(isSubscribed) {
      const method = "get"
      const requestsUrl = ['/users/self', '/carts/self']
      const requests = requestsUrl.map(url => {
        return { url, method }
      })
      const fetchUserInfo = async () => {
        function useNull() {
          return null;
        }
        try {
          await Promise.all([
            nutritivApi.request(requests[0]).catch(useNull),
            nutritivApi.request(requests[1]).catch(useNull),
          ]).then(function([userSelf, cartSelf]) {
            dispatch(
              updateUser(userSelf.data)
            )
            dispatch(
              updateUserCartQuantity(cartSelf.data.cart?.totalQuantity)
            )
          }).catch(function([userSelf, cartSelf]) {
            console.log('# /users/self err :', userSelf)
            console.log('# /carts/self err :', cartSelf)
          })
        } catch(err) {
          console.log("Could not fetch user info on App initialization")
        }
      }
      fetchUserInfo();
    }
    return () => { isSubscribed = false }
  }, [dispatch]);
  
  // RESTRICTED ROUTES
  const Restricted = ({ type }) => {
    const cartSelection = location.state?.cartSelection;
    console.log('# APP.JS - cartSelection :', cartSelection)
    const isLogged = () => {
      console.log('# loggedIn :', loggedIn)
      return loggedIn;
    }
    if(loggedIn !== null) {
      if(type === "guest") {
        if(isLogged()){
          if(location.state?.from) {
            return <Navigate 
              replace 
              to={location.state.from}
              state={{cartSelection: cartSelection}}
            />
          } else {
            return <Navigate replace to="/" />
          }
        } else {
          return <Outlet />;
        }
      } else if(type === "user") {
        return isLogged() ? (
          <Outlet /> 
        ) : <Navigate replace to="/" />;
      }
    } else {
      return <h2>Loading user data...</h2>
    }
  }
  
  return (
    <Elements
      stripe={stripePromise}
      // options={stripeOptions}
    >
      <Navbar />
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          {/* PUBLIC */}
          {/* <Route path="*" element={<Navigate replace to="/page-not-found"/>} /> */}
          {/* <Route path="/" element={<GeneralLayout/>}> */}
            <Route index element={<Welcome/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/product">
              <Route path=":productTitle" element={<ProductPage/>} />
            </Route>
            <Route path="/chat" element={<ChatConnection/>} /> 
            <Route path="/cancel" element={<CheckoutCancel/>} /> 
            <Route path="/success" element={<CheckoutSuccess/>} />
            <Route path="/page-not-found" element={<PageNotFound/>} />
            {/* PRIVATE */}
            {/* RESTRICTED - USER */}
            <Route element={<Restricted type="user" />}>
              <Route path="/profile" element={<Profile/>} />
              <Route path="/cart" element={<Cart/>} />
            </Route>
            {/* RESTRICTED - GUEST */}
            <Route element={<Restricted type="guest" />}>
              <Route path="login" element={<Login/>} />
              <Route path="register" element={<Register/>} />
            </Route>
          {/* </Route> */}
        </Routes>
      </AnimatePresence>
    </Elements>
  );
}

export default App;
