import { useQuery } from "@tanstack/react-query";
import { authApi, endpoints } from "../../api/index";
import { toast } from "react-toastify";

// Fetch product list
const fetchProductList = async () => {
  try {
    const response = await authApi().get(endpoints.Products);
    return response.data.results || [];
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi tải sản phẩm!");
    throw error;
  }
};

// Custom hook for product list
const useProductList = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProductList,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export { useProductList };
