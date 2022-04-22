import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../features/account/accountSlice'

// Redux store
export default configureStore({
  reducer: {
      account: accountReducer,
  },
})