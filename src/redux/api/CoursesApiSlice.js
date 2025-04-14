import { apiSlice } from "./apiSlice";
import { COURSES_URL } from "../constants";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: `${COURSES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getCourses: builder.query({
      query: (params) => {
        // Construct the full URL with query parameters
        let queryString = "";
        if (params.class) queryString += `class=${params.class}&`;
        if (params.term) queryString += `term=${params.term}&`;
        if (params.school) queryString += `school=${params.school}&`;
        if (params.name) queryString += `name=${params.name}&`; 
        queryString += `isPublish=true&`;


        const url = `${COURSES_URL}${queryString ? `?${queryString}` : ""}`;
        return { url };
      },
      providesTags: ["Course"],
      keepUnusedDataFor: 5, 
    }),
    getCoursesQuestions: builder.query({
      query: (params) => {
        let queryString = "";
        if (params.class) queryString += `class=${params.class}&`;
        if (params.school) queryString += `school=${params.school}&`;
        if (params.term) queryString += `term=${params.term}&`; // Already comma-separated
        if (params.name) queryString += `name=${params.name}&`; // Already comma-separated
        queryString += `isPublish=true&`;

        const url = `${COURSES_URL}${queryString ? `?${queryString}` : ""}`;
        return { url };
      },
      providesTags: ["Course"],
      keepUnusedDataFor: 5,
    }),
    
    
    deleteCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `${COURSES_URL}/${id}`,
        method: "DELETE",
        body: data,
      }),
    }),
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `${COURSES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `${COURSES_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseDetailsQuery,
  useGetCoursesQuestionsQuery
} = courseApiSlice;
