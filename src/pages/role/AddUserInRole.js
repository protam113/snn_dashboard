import React, { useState } from "react";
import { Checkbox, Spin, Alert, Button } from "antd";
import { useAdminUser } from "../../hooks/Admin/useAdminUser";

const AddUserInRoleContent = ({ onSave, roleId }) => {
  const { data, isLoading, isError } = useAdminUser(); // Lấy dữ liệu từ useAdminUser
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Kiểm tra trạng thái loading
  if (isLoading) {
    return <Spin size="large" className="flex justify-center items-center" />;
  }

  // Kiểm tra trạng thái lỗi
  if (isError) {
    return (
      <Alert
        message="Lỗi"
        description="Đã xảy ra lỗi khi tải danh sách người dùng."
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  // Tạo mảng chứa danh sách người dùng từ dữ liệu
  const users = data.pages.flatMap((page) => page.results || []); // Sửa để sử dụng results

  const handleUserChange = (userId) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Bỏ chọn nếu đã chọn
          : [...prevSelected, userId] // Thêm người dùng vào danh sách đã chọn
    );
  };

  const handleSave = () => {
    // Gọi onSave cho từng người dùng đã chọn
    selectedUsers.forEach((userId) => {
      onSave(userId, roleId); // Truyền trực tiếp userId và roleId
    });
  };

  return (
    <div>
      {users.map((user) => (
        <Checkbox
          key={user.id}
          checked={selectedUsers.includes(user.id)}
          onChange={() => handleUserChange(user.id)}
        >
          {user.username} ({user.email})
        </Checkbox>
      ))}
      <Button type="primary" onClick={handleSave} className="mt-4">
        Thêm vào vai trò
      </Button>
    </div>
  );
};

export default AddUserInRoleContent;
