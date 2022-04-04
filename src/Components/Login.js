/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { 
  useState, 
  // useEffect 
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import nutritivApi from '../Api/nutritivApi';
import { updateUser, updateUserCartQuantity } from '../Redux/reducers/user';

export default function LoginPage() {
  console.log("##### LoginPage render #####");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: "",
    usernameError: false,
    passwordError: false,
    loading: false,
    error: "",
  })
  const [invalidLogin, setInvalidLogin] = useState("")
  const loginData = {
    username: login.username,
    password: login.password,
  }
  
  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    })
  }
  
  const validation = () => {
    let usernameError = !login.username
    let passwordError = !login.password
    
    setLogin({
      ...login,
      usernameError,
      passwordError,
    })
    setInvalidLogin(false)
    
    // returns true only if both are true
    return !usernameError && !passwordError
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // We store and use the return value 
    // because the state won't update yet
    const isValid = validation();
    
    if(isValid) {
      function useNull() {
        return null;
      }
      
      // 1. LOGIN
      try {
        setLogin({ ...login, loading: true })
        await nutritivApi.post(
          `/auth/login`,
          loginData
        )
        
        // 2. GET USER INFO
        const method = "get"
        const requestsUrl = ['/users/self', '/carts/self']
        const requests = requestsUrl.map(url => {
          return { url, method }
        })
        
        await Promise.all([
          nutritivApi.request(requests[0]).catch(useNull),
          nutritivApi.request(requests[1]).catch(useNull),
        ]).then(function([userSelf, cartSelf]) {
          dispatch(
            updateUserCartQuantity(cartSelf.data.cart.totalQuantity)
          )
          dispatch(
            updateUser(userSelf.data)
          )
          console.log('# cartSelf total quantity :', cartSelf.data.cart.totalQuantity)
        }).catch(function([userSelf, cartSelf]) {
          console.log('# userSelf err :', userSelf)
          console.log('# cartSelf err :', cartSelf)
        })

      } catch (err) {
        console.log('# loginData err :', err)
      }
    }
  }
  
  return (
    <div>
      <h2>Login page</h2>
      <form onSubmit={ handleSubmit }>
        <label>
          <p>Username</p>
          <input 
            name="username" 
            onChange={ handleChange } 
            placeholder="Username..."
            type="text" 
          />
          {
            login.usernameError && (
              <p style={{color: "red"}}>
                Please enter your username
              </p>
            )
          }
        </label>
        <label>
          <p>Password</p>
          <input 
            name="password" 
            onChange={ handleChange }
            placeholder="Password..." 
            type="password"
          />
          {
            login.passwordError && (
              <p style={{color: "red"}}>
                Please enter your password
              </p>
            )
          }
        </label>
        {
          login.loading && (
            <p>
              Login in...
            </p>
          )
        }
        <div>
          <button type="submit">Submit</button>
        </div>
        {
          invalidLogin && (
            <p style={{color: "red"}}>
              {invalidLogin}
            </p>
          )
        }
      </form>
    </div>
  )
}