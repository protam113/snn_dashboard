import React, { useState } from "react";
import { Table, Spin, Button, Modal } from "antd";
import { DeleteOutlined, EyeFilled } from "@ant-design/icons";

import AddRolePopup from "./AddRolePopup";
import UserInRolePopup from "./UserInRolePopup";
import EdtRolePopup from "./EdtRolePopup";
import {
  useAddRole,
  useDelRole,
  useRoles,
  useUpdateRole,
} from "../../hooks/Admin/useAdminRole";

const RoleList = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRoles(); // Add isFetchingNextPage
  const { mutate: addRoleMutation } = useAddRole();
  const { mutate: delRoleMutation } = useDelRole();
  const { mutate: edtRoleMutation } = useUpdateRole();

  const [showAddRolePopup, setShowAddRolePopup] = useState(false);
  const [showEdtRolePopup, setShowEdtRolePopup] = useState(false);
  const [showUserInRolePopup, setShowUserInRolePopup] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  // Dữ liệu hiển thị trong bảng
  const roles = data?.pages.flatMap((page) => page.results) || [];

  const handleAddRole = (newRole) => {
    addRoleMutation(
      {
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions, // Truyền danh sách permissions
      },
      {
        onSuccess: () => {
          setShowAddRolePopup(false);
        },
      }
    );
  };

  const handleEditRole = (updatedRole) => {
    edtRoleMutation(
      {
        roleId: roleToEdit.id, // Truyền roleId thay vì id
        updatedRole, // Truyền toàn bộ updatedRole
      },
      {
        onSuccess: () => {
          setShowEdtRolePopup(false);
          setRoleToEdit(null);
        },
      }
    );
  };

  const handleDeleteRole = (roleId) => {
    delRoleMutation(roleId, {
      onSuccess: () => {
        setIsDeleteConfirmVisible(false);
        setRoleToDelete(null);
      },
    });
  };

  const showDeleteConfirm = (role) => {
    setRoleToDelete(role);
    setIsDeleteConfirmVisible(true);
  };

  const handleShowUserInRole = (roleId) => {
    setSelectedRoleId(roleId);
    setShowUserInRolePopup(true);
  };

  const columns = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="text"
            icon={<EyeFilled style={{ color: "blue" }} />}
            onClick={() => handleShowUserInRole(record.id)}
          />
          {record.name !== "admin" && record.name !== "manager" && (
            <>
              <Button
                type="text"
                onClick={() => {
                  setShowEdtRolePopup(true);
                  setRoleToEdit(record);
                }}
              >
                Sửa
              </Button>

              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => showDeleteConfirm(record)}
              />
            </>
          )}
        </div>
      ),
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
        Đã xảy ra lỗi khi tải danh sách roles
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Danh sách Roles</h2>
        <Button
          type="primary"
          onClick={() => setShowAddRolePopup(true)}
          className="mb-4"
        >
          Thêm Role
        </Button>
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
        {/* Nút tải thêm */}
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage} // Hiển thị trạng thái loading khi đang tải thêm
            >
              Tải thêm
            </Button>
          </div>
        )}
      </div>

      {showAddRolePopup && (
        <AddRolePopup
          onClose={() => setShowAddRolePopup(false)}
          onSave={handleAddRole}
        />
      )}
      {showEdtRolePopup && roleToEdit && (
        <EdtRolePopup
          role={roleToEdit} // Truyền dữ liệu role cần chỉnh sửa
          onClose={() => setShowEdtRolePopup(false)}
          onSave={handleEditRole} // Hàm lưu khi chỉnh sửa
        />
      )}

      {showUserInRolePopup && selectedRoleId && (
        <UserInRolePopup
          roleId={selectedRoleId}
          onClose={() => setShowUserInRolePopup(false)}
        />
      )}

      <Modal
        title="Xác nhận xóa"
        visible={isDeleteConfirmVisible}
        onOk={() => handleDeleteRole(roleToDelete.id)}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có muốn xóa role này không?</p>
      </Modal>
    </>
  );
};

export default RoleList;
