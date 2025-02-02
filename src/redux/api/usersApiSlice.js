import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "GET",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${"forgotpassword"}`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data, otp }) => ({
        url: `${USERS_URL}/resetpassword/${otp}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useProfileMutation,
  useGetUserDetailsQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice;
