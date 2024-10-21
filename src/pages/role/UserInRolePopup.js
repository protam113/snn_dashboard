import React, { useState } from "react";
import { Modal, Table, Spin, Button, Alert } from "antd";

import AddUserInRoleContent from "./AddUserInRole";
import { useAddUserRole, useUserInRole } from "../../hooks/Admin/useAdminRole";

const UserInRolePopup = ({ roleId, onClose }) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useUserInRole(roleId);

  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const { mutate: addUserRoleMutation } = useAddUserRole();

  const users = data?.pages.flatMap((page) => page.userRole) || [];

  const handleAddRole = (userId, roleId) => {
    console.log("User ID being added:", userId); // Log userId để kiểm tra
    addUserRoleMutation(
      {
        userId, // Truyền trực tiếp userId
        roleId, // Truyền trực tiếp roleId
      },
      {
        onSuccess: () => {
          setShowAddUserPopup(false);
        },
      }
    );
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
    },
  ];

  if (isLoading) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Đã xảy ra lỗi khi tải danh sách người dùng
      </div>
    );
  }

  return (
    <>
      <Modal
        title="Danh sách người dùng trong vai trò"
        visible={Boolean(roleId)} // Sử dụng Boolean để đảm bảo giá trị hợp lệ
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <Button
          type="primary"
          onClick={() => setShowAddUserPopup(true)} // Mở popup thêm người dùng
          className="mb-4"
        >
          Thêm người dùng
        </Button>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={false}
          onScroll={(e) => {
            const bottom =
              e.target.scrollHeight ===
              e.target.scrollTop + e.target.clientHeight;
            if (bottom && hasNextPage) {
              fetchNextPage();
            }
          }}
        />
      </Modal>

      {/* Modal cho việc thêm người dùng mới */}
      <Modal
        title="Chọn người dùng để thêm vào vai trò"
        visible={showAddUserPopup}
        onCancel={() => setShowAddUserPopup(false)}
        footer={null} // Bỏ footer để sử dụng button trong AddUserInRoleContent
      >
        <AddUserInRoleContent
          onSave={(userId) => {
            handleAddRole(userId, roleId); // Truyền userId và roleId riêng biệt
            setShowAddUserPopup(false); // Đóng popup sau khi thêm
          }}
        />
      </Modal>
    </>
  );
};

export default UserInRolePopup;
