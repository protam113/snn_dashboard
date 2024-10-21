import React from "react";
import { Checkbox, Tooltip, Row, Col, Spin, Alert } from "antd";
import { usePermission } from "../../hooks/Admin/useAdminRole";

const PermissionsList = ({ selectedPermission = [], onPermissionChange }) => {
  // Lấy dữ liệu permissions
  const { data: permissionsData = {}, isLoading, isError } = usePermission();

  // Extract the results array from permissionsData
  const permissions = permissionsData.results || [];

  const handleCheckboxChange = (id) => {
    const newSelectedPermissions = selectedPermission.includes(id)
      ? selectedPermission.filter((permissionId) => permissionId !== id)
      : [...selectedPermission, id];

    onPermissionChange(newSelectedPermissions);
  };

  if (isLoading) return <Spin tip="Loading categories..." />;
  if (isError) return <Alert message="Error loading categories" type="error" />;

  return (
    <Row gutter={[16, 16]}>
      {permissions.map((permission) => (
        <Col key={permission.id} span={12}>
          <div className="p-2 border rounded-md bg-white shadow-sm">
            <Checkbox
              checked={selectedPermission.includes(permission.id)}
              onChange={() => handleCheckboxChange(permission.id)}
            >
              <Tooltip title={permission.description}>
                <span>{permission.name}</span>
              </Tooltip>
            </Checkbox>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default PermissionsList;
