import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user?.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/users', method: 'POST', body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/users/login', method: 'POST', body }),
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({ url: '/users/delete', method: 'DELETE' }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} = userApi
