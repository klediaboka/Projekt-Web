import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user?.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Project', 'Application'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params = {}) => ({ url: '/projects', params }),
      providesTags: ['Project'],
    }),
    getMyProjects: builder.query({
      query: () => '/projects/my',
      providesTags: ['Project'],
    }),
    createProject: builder.mutation({
      query: (data) => ({ url: '/projects', method: 'POST', body: data }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/projects/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
    applyToProject: builder.mutation({
      query: (data) => ({ url: '/applications', method: 'POST', body: data }),
      invalidatesTags: ['Application'],
    }),
    getMyApplications: builder.query({
      query: () => '/applications/my',
      providesTags: ['Application'],
    }),
    getProjectApplications: builder.query({
      query: (projectId) => `/applications/project/${projectId}`,
      providesTags: ['Application'],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/applications/${id}`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Application', 'Project'],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetMyProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useApplyToProjectMutation,
  useGetMyApplicationsQuery,
  useGetProjectApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = projectApi
