import { baseApi } from "@/src/shared/api/baseApi";
import { tokenService } from "@/src/shared/store";
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UpdateProfileRequest,
  UserResponse,
} from "../model/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await tokenService.setTokens(data.access_token, data.refresh_token);
          await tokenService.debugTokens();
        } catch {
          // handleError(dispatch)(error.error);
        }
      },
    }),
    register: builder.mutation<TokenResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await tokenService.setTokens(data.access_token, data.refresh_token);
        } catch {}
      },
    }),
    refresh: builder.mutation<TokenResponse, string>({
      query: (refresh_token) => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refresh_token },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await tokenService.setTokens(data.access_token, data.refresh_token);
          await tokenService.debugTokens();
        } catch {}
      },
    }),
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<
      UserResponse,
      UpdateProfileRequest | FormData
    >({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAvatar: builder.mutation<UserResponse, void>({
      query: () => ({
        url: "/auth/me/avatar",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ detail: string }, string>({
      query: (refresh_token) => ({
        url: "/auth/logout",
        method: "POST",
        body: { refresh_token },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          await tokenService.removeTokens();
        } catch {}
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useDeleteAvatarMutation,
  useLogoutMutation,
} = authApi;
