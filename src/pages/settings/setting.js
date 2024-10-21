import React from "react";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import { Row, Col, Card, Typography } from "antd";

const { Title } = Typography;

const Setting = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Title level={2} className="text-center mb-6">
        Cài Đặt Tài Khoản
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Chỉnh Sửa Hồ Sơ" bordered={false}>
            <EditProfile />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Đổi Mật Khẩu" bordered={false}>
            <ChangePassword />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Setting;
