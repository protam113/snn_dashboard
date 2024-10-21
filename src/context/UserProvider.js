import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { decryptData, encryptData } from "../utils/cryptoUtils";
import useAuth from "../hooks/useAuth";
import { authApi, endpoints } from "../api/index";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getToken } = useAuth();
  const userInfoFetchedRef = useRef(false);

  const cacheUserInfo = (data) => {
    const encryptedData = encryptData(JSON.stringify(data));
    localStorage.setItem("user_info", encryptedData);
  };

  const getCachedUserInfo = () => {
    const cachedData = localStorage.getItem("user_info");
    if (cachedData) {
      try {
        const decryptedData = decryptData(cachedData);
        return JSON.parse(decryptedData);
      } catch (error) {
        console.error("Error decrypting user info:", error);
        localStorage.removeItem("user_info");
        return null;
      }
    }
    return null;
  };

  const fetchUserInfo = useCallback(async () => {
    if (userInfoFetchedRef.current) return;

    setLoading(true);

    const cachedData = getCachedUserInfo();
    if (cachedData) {
      setUserInfo(cachedData);
      setUserRoles(cachedData.role ? cachedData.role.name : null); // Đặt thành null nếu không có vai trò
      userInfoFetchedRef.current = true;
      setLoading(false);
      return;
    }

    const token = await getToken();

    if (!token) {
      setUserInfo(null);
      setUserRoles(null); // Đặt thành null nếu không có token
      setLoading(false);
      return;
    }

    try {
      const response = await authApi(token).get(endpoints.currentUser);
      const userData = response.data;

      cacheUserInfo(userData);
      setUserInfo(userData);
      setUserRoles(userData.role ? userData.role.name : null); // Đặt thành null nếu không có vai trò
      userInfoFetchedRef.current = true;
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const updateUserInfo = useCallback(
    async (updatedInfo) => {
      const token = await getToken();
      if (!token) return;

      try {
        const response = await authApi(token).patch(
          endpoints.UpdateProfile,
          updatedInfo,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setUserInfo(response.data);
        cacheUserInfo(response.data);
      } catch (err) {
        console.error(
          "Error updating user info:",
          err.response?.data || err.message
        );
        setError(err.response?.data || err.message);
      }
    },
    [getToken]
  );

  const value = {
    userInfo,
    userRoles,
    loading,
    error,
    refreshUserInfo: fetchUserInfo,
    updateUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
