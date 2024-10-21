import { useInfiniteQuery } from "@tanstack/react-query";
import { authApi, endpoints } from "../../api/index";
import useAuth from "../useAuth";

// Hàm fetchAdminUser dùng để lấy danh sách người dùng từ API
const fetchAdminUser = async ({ token, pageParam = 1 }) => {
  try {
    const response = await authApi(token).get(
      `${endpoints.AdminUserSearch}?page=${pageParam}`
    );

    // Kiểm tra response có chứa data không
    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ API");
    }

    const { results, next } = response.data;

    // Xác định trang tiếp theo nếu có
    const nextPage = next ? pageParam + 1 : undefined;

    return {
      results, // Kết quả người dùng
      nextPage, // Trang tiếp theo
    };
  } catch (err) {
    console.error("Đã xảy ra lỗi khi tải danh sách người dùng");
    throw err; // Ném lỗi để useInfiniteQuery xử lý
  }
};

// Custom hook để lấy danh sách người dùng
const useAdminUser = () => {
  const { getToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ["adminUser"], // Khóa truy vấn duy nhất c
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken(); // Lấy token từ hook auth
      return fetchAdminUser({ token, pageParam }); // Gọi hàm fetchAdminUser
    },
    getNextPageParam: (lastPage) => lastPage.nextPage, // Lấy trang tiếp theo
    staleTime: 60000, // Thời gian giữ dữ liệu còn tươi mới (60 giây)
    cacheTime: 300000, // Thời gian lưu trữ dữ liệu trong cache (5 phút)
    onError: () => {
      console.error("Đã xảy ra lỗi khi tải danh sách người dùng"); // Thông báo lỗi
    },
  });
};

// Hàm fetchAdminUser với khả năng lọc người dùng
const fetchAdminFiltersUser = async ({
  token,
  pageParam = 1,
  filters = {},
}) => {
  try {
    // Lọc ra các giá trị có trong filters mà không phải là undefined
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );

    // Tạo chuỗi query string dựa trên các tham số đã lọc
    const queryString = new URLSearchParams({
      page: pageParam,
      ...validFilters, // Chèn các tham số lọc hợp lệ vào query string
    }).toString();

    const response = await authApi(token).get(
      `${endpoints.AdminUserSearch}${queryString ? `?${queryString}` : ""}`
    );

    // Kiểm tra response có chứa data không
    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ API");
    }

    const { results, next } = response.data;

    // Xác định trang tiếp theo nếu có
    const nextPage = next ? pageParam + 1 : undefined;

    return {
      results, // Kết quả người dùng
      nextPage, // Trang tiếp theo
    };
  } catch (err) {
    console.error("Đã xảy ra lỗi khi tải danh sách người dùng");
    throw err; // Ném lỗi để useInfiniteQuery xử lý
  }
};

// Custom hook để lấy danh sách người dùng với khả năng lọc
const useAdminFiltersUser = (filters = {}) => {
  const { getToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ["adminUser", filters], // Khóa truy vấn duy nhất bao gồm cả filters
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken(); // Lấy token từ hook auth
      return fetchAdminFiltersUser({ token, pageParam, filters }); // Truyền filters vào hàm fetchAdminUser
    },
    getNextPageParam: (lastPage) => lastPage.nextPage, // Lấy trang tiếp theo
    staleTime: 60000, // Thời gian giữ dữ liệu còn tươi mới (60 giây)
    cacheTime: 300000, // Thời gian lưu trữ dữ liệu trong cache (5 phút)
    onError: () => {
      console.error("Đã xảy ra lỗi khi tải danh sách người dùng"); // Thông báo lỗi
    },
  });
};

export { useAdminUser, useAdminFiltersUser }; // Xuất custom hook
