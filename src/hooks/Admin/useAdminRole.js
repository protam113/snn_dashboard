import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { authApi, endpoints } from "../../api/index";
import useAuth from "../useAuth";
import { useToastDesign } from "../../context/ToastService";

// Hàm fetchRoles dùng để lấy danh sách nPermission từ API
const fetchRoles = async ({ token, pageParam = 1 }) => {
  try {
    // Gửi yêu cầu GET tới API để lấy danh sách Roles
    const response = await authApi(token).get(
      `${endpoints.Roles}?page=${pageParam}`
    );

    // Destructure dữ liệu nhận được từ response
    const { results, next } = response.data;
    // Xác định trang tiếp theo nếu có
    const nextPage = next ? pageParam + 1 : undefined;

    return {
      results, // Kết quả Permission
      nextPage, // Trang tiếp theo
    };
  } catch (err) {
    // Hiển thị thông báo lỗi nếu có sự cố trong việc lấy dữ liệu
    console.error("Đã xảy ra lỗi khi tải danh sách roles");
    throw err; // Ném lỗi để useInfiniteQuery xử lý
  }
};

// Custom hook để lấy danh sách roles
const useRoles = () => {
  const { getToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ["roles"], // Khóa truy vấn duy nhất cho dữ liệu người dùng
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken(); // Lấy token từ hook auth
      return fetchRoles({ token, pageParam }); // Gọi hàm fetchRoles
    },
    getNextPageParam: (lastPage) => lastPage.nextPage, // Lấy trang tiếp theo
    staleTime: 60000, // Thời gian giữ dữ liệu còn tươi mới (60 giây)
    cacheTime: 300000, // Thời gian lưu trữ dữ liệu trong cache (5 phút)
    onError: () => {
      console.error("Đã xảy ra lỗi khi tải danh sách roles"); // Thông báo lỗi
    },
  });
};

const addRole = async (formData, token) => {
  if (!token) throw new Error("No token available");

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);

    // Thêm từng permission riêng biệt vào FormData
    formData.permissions.forEach((permission) => {
      formDataToSend.append("permission", permission); // Gửi từng permission riêng biệt
    });

    const response = await authApi(token).post(
      endpoints.Roles,
      formDataToSend,
      {
        headers: { "Content-Type": "multipart/form-data" }, // Đảm bảo là multipart
      }
    );

    return response.data;
  } catch (err) {
    console.error("Lỗi khi tạo role:", err);
    throw err;
  }
};

const useAddRole = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { addNotification } = useToastDesign();

  return useMutation({
    mutationFn: async (newRole) => {
      const token = await getToken();
      return addRole(newRole, token);
    },
    onSuccess: () => {
      addNotification("Role đã được thêm thành công", "success");
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (error) => {
      console.error(error.message || "Lỗi khi tạo role!");
    },
  });
};

// Phương thức để sửa role
const updateRole = async (roleId, formData, token) => {
  if (!token) throw new Error("No token available");

  // Kiểm tra nếu formData không tồn tại
  if (!formData) {
    throw new Error("No form data provided");
  }

  // Tạo FormData
  const formDataToSend = new FormData();

  // Chỉ thêm các trường có giá trị
  if (formData.name) {
    formDataToSend.append("name", formData.name);
  }
  if (formData.description) {
    formDataToSend.append("description", formData.description);
  }
  if (Array.isArray(formData.permissions)) {
    formData.permissions.forEach((permissionId) => {
      formDataToSend.append("permissions", permissionId);
    });
  }

  try {
    // Sử dụng replace để thay thế ":id" bằng roleId
    const endpointUrl = endpoints.Role.replace(":id", roleId);

    const response = await authApi(token).patch(
      endpointUrl, // Đường dẫn endpoint đã thay thế :id
      formDataToSend,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Lỗi khi sửa role:", err);
    throw err;
  }
};

// Hook để sử dụng updateRole
const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { addNotification } = useToastDesign();

  return useMutation({
    mutationFn: async ({ roleId, updatedRole }) => {
      const token = await getToken();
      return updateRole(roleId, updatedRole, token);
    },
    onSuccess: () => {
      addNotification("Role đã được cập nhật thành công", "success");
      queryClient.invalidateQueries(["roles"]); // Làm mới lại danh sách roles
    },
    onError: (error) => {
      console.error(error.message || "Lỗi khi cập nhật role!");
    },
  });
};

const fetchUserInRole = async ({ roleId, pageParam = 1, token }) => {
  if (!token) throw new Error("No token available");

  if (!roleId) {
    throw new Error("Role ID is required");
  }

  try {
    const response = await authApi(token).get(
      `${endpoints.AdminUserSearch}?role=${roleId}&page=${pageParam}`
    );

    const { results: userRole = [], next } = response.data;

    return {
      userRole,
      nextPage: next ? pageParam + 1 : undefined,
    };
  } catch (error) {
    console.error("Error fetching user in role:", error);
    throw new Error("Failed to fetch user data. Please try again.");
  }
};

const useUserInRole = (roleId) => {
  const { getToken } = useAuth();
  const token = getToken(); // Lấy token từ useAuth

  return useInfiniteQuery({
    queryKey: ["userRole", roleId, token],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserInRole({ roleId, pageParam, token }), // Truyền token vào fetchUserInRole
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    onError: (error) => {
      console.error(`Error fetching user roles: ${error.message}`);
    },
  });
};

const addUserRole = async (formData, token) => {
  if (!token) throw new Error("No token available");

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("user", formData.userId); // Sử dụng userId từ formData
    formDataToSend.append("role", formData.roleId); // Thêm roleId vào FormData

    const response = await authApi(token).post(
      endpoints.RoleDecentralize,
      formDataToSend,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Response data from server:", response.data);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi thêm người dùng!", err);
    throw err;
  }
};

const useAddUserRole = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { addNotification } = useToastDesign();

  return useMutation({
    mutationFn: async (newUserRole) => {
      const token = await getToken(); // Lấy token
      console.log("Adding user role with data:", newUserRole); // Log thông tin dữ liệu

      return addUserRole(newUserRole, token); // Gọi hàm thêm người dùng
    },
    onSuccess: (data) => {
      // Log thông tin thành công
      console.log("User role added successfully:", data);
      addNotification("Người dùng đã được thêm vào role thành công", "success");
      queryClient.invalidateQueries(["userRole"]); // Làm mới dữ liệu liên quan đến userRole
    },
    onError: (error) => {
      console.error(error.message || "Lỗi khi thêm người dùng!"); // Log lỗi nếu có
    },
  });
};

const deleteRole = async ({ roleId, token }) => {
  if (!token) throw new Error("No token available");
  if (!roleId) throw new Error("RoleId is missing");

  try {
    await authApi(token).delete(endpoints.Role.replace(":id", roleId));
  } catch (error) {
    console.error("Lỗi khi xóa role:", error);
    throw error;
  }
};

const useDelRole = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { addNotification } = useToastDesign();

  return useMutation({
    mutationFn: async (roleId) => {
      const token = await getToken();
      return deleteRole({ roleId, token });
    },
    onSuccess: () => {
      addNotification("Role đã được xóa thành công", "success");
      // Invalidate the roles query để cập nhật lại danh sách roles
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (error) => {
      console.error(error.message || "Lỗi khi xóa role!");
      // Hiển thị thông báo lỗi
      addNotification("Đã xảy ra lỗi khi xóa role", "error");
    },
  });
};

const fetchPermission = async ({ token }) => {
  try {
    // Gửi yêu cầu GET tới API để lấy danh sách Permission
    const response = await authApi(token).get(endpoints.Permission);

    // Destructure dữ liệu nhận được từ response
    const { results } = response.data;

    return {
      results, // Kết quả Permission
    };
  } catch (err) {
    // Hiển thị thông báo lỗi nếu có sự cố trong việc lấy dữ liệu
    console.error("Đã xảy ra lỗi khi tải danh sách Permission");
    throw err; // Ném lỗi để useQuery xử lý
  }
};

// Custom hook để lấy danh sách Permission
const usePermission = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["permission"], // Khóa truy vấn duy nhất cho dữ liệu quyền
    queryFn: async () => {
      const token = await getToken(); // Lấy token từ hook auth
      return fetchPermission({ token }); // Gọi hàm fetchPermission
    },
    staleTime: 60000, // Thời gian giữ dữ liệu còn tươi mới (60 giây)
    cacheTime: 300000, // Thời gian lưu trữ dữ liệu trong cache (5 phút)
    onError: () => {
      console.error("Đã xảy ra lỗi khi tải danh sách Permission"); // Thông báo lỗi
    },
  });
};

export {
  useRoles,
  useAddRole,
  usePermission,
  useDelRole,
  useUserInRole,
  useUpdateRole,
  useAddUserRole,
}; // Xuất custom hook
