import { configureStore } from '@reduxjs/toolkit'
import userReducer    from './slices/userSlice'
import projectReducer from './slices/projectSlice'
import { userApi }    from './apis/userApi'
import { projectApi } from './apis/projectApi'

export const store = configureStore({
  reducer: {
    user:                      userReducer,
    projects:                  projectReducer,
    [userApi.reducerPath]:     userApi.reducer,
    [projectApi.reducerPath]:  projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(projectApi.middleware),
})
