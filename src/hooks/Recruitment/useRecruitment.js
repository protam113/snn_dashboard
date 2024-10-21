import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { authApi, endpoints } from "../../api/index";

const fetchRecruitmentList = async ({ pageParam = 1 }) => {
  try {
    const response = await authApi().get(
      `${endpoints.Recruitment}?page=${pageParam}`
    );
    const results = response.data.results || [];
    const next = response.data.next;

    return {
      recruitments: results.sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      ),
      nextPage: next ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error("Đã xảy ra lỗi khi tải tin tuyển dụng!");
    throw error;
  }
};

// Custom hook for Recruitment list
const useRecruitmentList = () => {
  return useInfiniteQuery({
    queryKey: ["recruitments"],
    queryFn: ({ pageParam }) => fetchRecruitmentList({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};
// Fetch Recruitment detail
const fetchRecruitmentDetail = async (postId) => {
  if (!postId) return null;

  try {
    const url = endpoints.RecruitmentDetail.replace(":id", postId);
    const response = await authApi().get(url);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi tải tin tuyển dụng!");
    throw error;
  }
};

const useRecruitmentDetail = (postId) => {
  return useQuery({
    queryKey: ["recruitment", postId],
    queryFn: () => fetchRecruitmentDetail(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
};

export { useRecruitmentList, useRecruitmentDetail };
