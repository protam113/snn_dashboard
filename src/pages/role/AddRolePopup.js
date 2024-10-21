import React, { useState } from "react";
import { Button, Row, Col, Input, Typography } from "antd";
import PermissionsList from "./permissionsList";

const { Title } = Typography;

const AddRolePopup = ({ onClose, onSave }) => {
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [], // Danh sách permissions
  });

  const handlePermissionChange = (newSelectedPermissions) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: newSelectedPermissions, // Cập nhật danh sách permissions
    }));
  };

  const handleSave = async () => {
    // Kiểm tra các trường đã được điền
    if (
      !newRole.name ||
      !newRole.description ||
      newRole.permissions.length === 0
    ) {
      console.error("Tất cả các trường đều phải được điền");
      return;
    }

    // Gọi hàm lưu role
    await onSave(newRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
        <Title level={4} className="mb-4">
          Thêm Role Mới
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Nhập tên role"
              className="mb-4"
            />
            <Input
              value={newRole.description}
              onChange={(e) =>
                setNewRole({ ...newRole, description: e.target.value })
              }
              placeholder="Nhập mô tả"
              className="mb-4"
            />
          </Col>
          <Col span={12}>
            <PermissionsList
              selectedPermission={newRole.permissions} // Truyền permissions vào component
              onPermissionChange={handlePermissionChange}
            />
          </Col>
        </Row>
        <div className="flex justify-end mt-4">
          <Button type="primary" onClick={handleSave} className="mr-2">
            Lưu
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </div>
      </div>
    </div>
  );
};

export default AddRolePopup;
