import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import nutritivApi from '../Api/nutritivApi'
import { storageKeys } from '../Helpers/localStorage';
import { logoutUser } from '../Redux/reducers/user';

export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await nutritivApi.delete(
        `/auth/logout`,
      )
      dispatch(logoutUser())
      localStorage.removeItem(storageKeys.accessToken)
      localStorage.removeItem(storageKeys.refreshToken)
      navigate('/', { replace: true })
    } catch(err) {
      console.error(':', err)
    }
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}