import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/config/Store";
import apiClient from "@/config/ApiClient";

const OAuthSuccess = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAccessToken() {
      if (!isRefreshing) {
        setIsRefreshing(true);
        try {
          const res = await apiClient.post("/auth/refresh-token");
          const responseLoginData = res.data;
          console.log(responseLoginData);

          changeLocalLoginData(
            responseLoginData.accessToken,
            responseLoginData.user,
            true,
          );

          toast.success("Login success !");
          navigate("/"); // TODO: Change it when dashboard created, matching Signin.jsx
        } catch (error) {
          toast.error("Error while login!");
          console.log(error);
          navigate("/signin");
        } finally {
          setIsRefreshing(false);
        }
      }
    }

    getAccessToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-10 flex flex-col gap-3 justify-center items-center">
      <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
      <h1 className="text-2xl font-semibold">Please wait....</h1>
    </div>
  );
};

export default OAuthSuccess;
