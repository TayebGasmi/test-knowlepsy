import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/events`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
          }
        })
        
        return `?${searchParams.toString()}`
      },
      providesTags: ['Event'],
    }),
    getEvent: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Event'],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    getEventStats: builder.query({
      query: () => '/stats',
      providesTags: ['Event'],
    }),
  }),
})
