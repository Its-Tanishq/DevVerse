import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../config/ApiClient";

const LOCAL_KEY = "devverse_app";

// main logic for global state
const useAuth = create()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,

      changeLocalLoginData: (accessToken, user, authStatus) => {
        set({
          accessToken,
          user,
          authStatus,
        });
      },

      login: async (loginData) => {
        // console.log("started login...");
        set({ authLoading: true });

        try {
          const response = await apiClient.post("/auth/login", loginData);
          const loginResponseData = response.data.data;

          // console.log(loginResponseData);

          let userPayload = loginResponseData.userDTO || loginResponseData.user;
          if (userPayload) {
            const { password, ...rest } = userPayload;
            userPayload = rest;
          }

          set({
            accessToken:
              loginResponseData.accessToken || loginResponseData.token,
            user: userPayload,
            authStatus: true,
          });

          return loginResponseData;
        } catch (error) {
          // console.log(error);
          throw error;
        } finally {
          set({
            authLoading: false,
          });
        }
      },

      logout: async (silent = false) => {
        try {
          set({
            authLoading: true,
          });

          await apiClient.post("/auth/logout");
        } catch (error) {
          console.error(error);
        } finally {
          set({
            authLoading: false,
            accessToken: null,
            user: null,
            authStatus: false,
          });
        }
      },

      checkLogin: () => {
        if (get().accessToken && get().authStatus) {
          return true;
        }
        return false;
      },
    }),
    {
      name: LOCAL_KEY,
    },
  ),
);

export default useAuth;
