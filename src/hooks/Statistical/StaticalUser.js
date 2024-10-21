import { useQuery } from "@tanstack/react-query";
import { authApi, endpoints } from "../../api/index";
import useAuth from "../useAuth";

const fetchStaticalUser = async (startDate, endDate, token) => {
  if (!token) {
    throw new Error("Không có token");
  }

  if (!startDate || !endDate) {
    throw new Error("Start date hoặc end date không hợp lệ");
  }

  try {
    const response = await authApi(token).get(
      `${endpoints.StaticalUser}?start_date=${encodeURIComponent(
        startDate
      )}&end_date=${encodeURIComponent(endDate)}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("Không có dữ liệu thống kê");
    }

    return response.data;
  } catch (err) {
    if (err.response) {
      // Lỗi HTTP
      const statusCode = err.response.status;
      const message =
        err.response.data.message || "Đã xảy ra lỗi khi lấy dữ liệu thống kê";
      throw new Error(`HTTP ${statusCode}: ${message}`);
    }
    // Lỗi khác
    console.error("Lỗi khác khi lấy dữ liệu thống kê", err);
    throw new Error("Đã xảy ra lỗi không xác định");
  }
};

const useStaticalUser = (startDate, endDate) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["staticalUser", startDate, endDate],
    queryFn: async () => {
      const token = await getToken();

      if (!startDate || !endDate) {
        throw new Error("Start date hoặc end date không hợp lệ");
      }

      return fetchStaticalUser(startDate, endDate, token);
    },
    enabled: !!startDate && !!endDate,
    staleTime: 60000,
    cacheTime: 300000,
    retry: (failureCount, error) => {
      // Retry nếu lỗi không phải là do không có dữ liệu
      return failureCount < 3 && error.message !== "Không có dữ liệu thống kê";
    },
    onError: (error) => {
      // Có thể thêm thông báo lỗi cho người dùng, ví dụ:
      console.error("Đã xảy ra lỗi khi lấy dữ liệu thống kê:", error.message);
    },
  });
};

export { useStaticalUser };
