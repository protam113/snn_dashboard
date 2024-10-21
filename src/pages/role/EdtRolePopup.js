import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Button,
  Row,
  Col,
  Input,
  Typography,
  Spin,
  Alert,
  Pagination,
} from "antd";
import { usePermission } from "../../hooks/Admin/useAdminRole";

const { Title, Text } = Typography;

const EdtRolePopup = ({ onClose, onSave, role }) => {
  const [updatedRole, setUpdatedRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const { data: permissions = [], isLoading, isError } = usePermission();

  // Thiết lập state cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng permissions trên mỗi trang

  // Cập nhật state updatedRole khi role thay đổi
  useEffect(() => {
    if (role) {
      setUpdatedRole({
        name: role.name || "",
        description: role.description || "",
        permissions: Array.isArray(role.permissions)
          ? role.permissions.map((perm) => perm.id)
          : [],
      });
    }
  }, [role]);

  const handleSave = async () => {
    try {
      await onSave(updatedRole);
      onClose();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleCheckboxChange = (checkedValues) => {
    setUpdatedRole((prevRole) => ({
      ...prevRole,
      permissions: checkedValues,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Lỗi"
        description="Đã xảy ra lỗi khi tải danh sách permissions"
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  // Chuyển đổi permissions thành một danh sách có thể sử dụng
  const permissionOptions = Array.isArray(permissions.results)
    ? permissions.results.map((permission) => ({
        label: (
          <div>
            <strong>{permission.name}</strong> - {permission.description}
          </div>
        ),
        value: permission.id,
      }))
    : [];

  // Tính toán permissions được hiển thị theo trang
  const indexOfLastPermission = currentPage * itemsPerPage;
  const indexOfFirstPermission = indexOfLastPermission - itemsPerPage;
  const currentPermissions = permissionOptions.slice(
    indexOfFirstPermission,
    indexOfLastPermission
  );

  // Chia permissions thành hai cột
  const halfLength = Math.ceil(currentPermissions.length / 2);
  const firstColumn = currentPermissions.slice(0, halfLength);
  const secondColumn = currentPermissions.slice(halfLength);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
        <Title level={4} className="mb-4">
          Chỉnh sửa Role
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              value={updatedRole.name}
              onChange={(e) =>
                setUpdatedRole({ ...updatedRole, name: e.target.value })
              }
              placeholder="Nhập tên role"
              className="mb-4"
            />
            <Input
              value={updatedRole.description}
              onChange={(e) =>
                setUpdatedRole({ ...updatedRole, description: e.target.value })
              }
              placeholder="Nhập mô tả"
              className="mb-4"
            />
          </Col>
          <Col span={12}>
            <Text className="font-semibold mb-2 block">Chọn Permissions:</Text>
            <Row gutter={16}>
              <Col span={12}>
                <Checkbox.Group
                  options={firstColumn}
                  value={updatedRole.permissions}
                  onChange={handleCheckboxChange}
                />
              </Col>
              <Col span={12}>
                <Checkbox.Group
                  options={secondColumn}
                  value={updatedRole.permissions}
                  onChange={handleCheckboxChange}
                />
              </Col>
            </Row>
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={permissionOptions.length}
              onChange={handlePageChange}
              className="mt-4"
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

export default EdtRolePopup;
