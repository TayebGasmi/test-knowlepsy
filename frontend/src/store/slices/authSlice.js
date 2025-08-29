import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('token')
      if (token) {
        state.token = token
        state.isAuthenticated = true
      }
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false
        const { user, token } = action.payload.data
        state.user = user
        state.token = token
        state.isAuthenticated = true
        localStorage.setItem('token', token)
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.loading = false
      })
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
        state.loading = false
        const { user, token } = action.payload.data
        state.user = user
        state.token = token
        state.isAuthenticated = true
        localStorage.setItem('token', token)
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state) => {
        state.loading = false
      })
      .addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.user = action.payload.data.user
      })
  },
})

export const { logout, checkAuth, setCredentials } = authSlice.actions
export default authSlice.reducer
