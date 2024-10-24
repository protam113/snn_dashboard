import React, { createContext, useState } from "react";
import { authApi, endpoints, baseURL } from "../api/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  removeLocalStorage,
  encryptData,
  decryptData,
} from "../utils/cryptoUtils";
import { useToastDesign } from "./ToastService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [errMsg, setErrMsg] = useState("");
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();
  const { addNotification } = useToastDesign();

  const getToken = () => {
    const encryptedToken = localStorage.getItem("access_token");
    return encryptedToken ? decryptData(encryptedToken) : null;
  };

  const refreshAccessToken = async () => {
    const encryptedRefreshToken = Cookies.get("refresh_token");
    const refreshToken = encryptedRefreshToken
      ? decryptData(encryptedRefreshToken)
      : null;

    if (refreshToken) {
      try {
        const api = authApi();
        const response = await api.post(endpoints.refreshLogin, {
          refreshToken: refreshToken,
        });
        const { access_token } = response.data;
        const encryptedAccessToken = encryptData(access_token);
        localStorage.setItem("access_token", encryptedAccessToken);
        setAuth((prevAuth) => ({
          ...prevAuth,
          access_token: encryptedAccessToken,
        }));
      } catch (err) {
        if (err.response?.status === 401) {
          console.error("Refresh token đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else {
          console.error("Lỗi khi refresh token", err);
        }
      }
    } else {
      logout();
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(
        `${baseURL}${endpoints.login}`,
        new URLSearchParams({
          grant_type: "password",
          client_id: process.env.REACT_APP_client_id_ENDPOINT,
          client_secret: process.env.REACT_APP_client_secret_ENDPOINT,
          username,
          password,
        })
      );

      const { access_token, refresh_token } = response.data;

      const encryptedAccessToken = encryptData(access_token);
      const encryptedRefreshToken = encryptData(refresh_token);

      setAuth({ username, access_token: encryptedAccessToken });
      localStorage.setItem("access_token", encryptedAccessToken);
      Cookies.set("refresh_token", encryptedRefreshToken, {
        secure: true,
        expires: 7,
      });
      addNotification("Đăng nhập thành công!", "success");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (!err.response) {
      addNotification("Không có phản hồi từ máy chủ", "error");
    } else if (err.response.status === 400) {
      addNotification("Sai tên đăng nhập hoặc mật khẩu", "warning");
      setErrMsg("Sai tên đăng nhập hoặc mật khẩu");
    } else {
      setErrMsg(
        "Đăng nhập thất bại: " +
          (err.response.data?.message || "Đã xảy ra lỗi không mong muốn")
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    Cookies.remove("refresh_token");

    removeLocalStorage("user_info");

    localStorage.clear();
    sessionStorage.clear();

    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; Max-Age=-99999999;";
    }

    setAuth(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        errMsg,
        auth,
        setAuth,
        handleLogin,
        logout,
        getToken,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
