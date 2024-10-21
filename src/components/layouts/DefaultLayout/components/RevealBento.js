import React from "react";
import { Row, Col, Card, Avatar, Button, Form, Input, Spin, Alert } from "antd";
import { MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import BannerChart from "./chart/bannerChart";
import CategoryChart from "./chart/categoryChart";
import TagChart from "./chart/TagChart";
import { useWeb } from "../../../../hooks/useWeb";
import { useUser } from "../../../../context/UserProvider";

const { Meta } = Card;

export const RevealBento = () => {
  const { userInfo } = useUser();
  const { data: web, error, isLoading } = useWeb();

  // Loading và Error handling
  if (isLoading) {
    return <Spin />;
  }
  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 text-black">
      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <HeaderBlock userInfo={userInfo} />
        </Col>
        <Col span={24} md={12}>
          <SocialsBlock data={web} />
        </Col>
        <Col span={24} md={8}>
          <LocationBlock userInfo={userInfo} />
        </Col>
        <Col span={24} md={16}>
          <EmailListBlock userInfo={userInfo} />
        </Col>
      </Row>
    </div>
  );
};

const HeaderBlock = ({ userInfo }) => (
  <Card bordered>
    <Meta
      avatar={<Avatar src={userInfo?.profile_image} size={64} />}
      title={`${userInfo?.first_name} ${userInfo?.last_name}`}
      description={`@${userInfo?.username}`}
    />
    <p>{userInfo?.about || "No bio available"}</p>
  </Card>
);

const SocialsBlock = ({ data }) => (
  <Row gutter={[16, 16]}>
    <Col span={12}>
      <Card title="Banner Chart">
        <BannerChart />
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Category Chart">
        <CategoryChart />
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Tag Chart">
        <TagChart />
      </Card>
    </Col>
    <Col span={12}>
      <Card>
        {data?.img ? (
          <img src={data.img} alt="logo" />
        ) : (
          <span>Logo not available</span>
        )}
      </Card>
    </Col>
  </Row>
);

const LocationBlock = ({ userInfo }) => (
  <Card title="Location" className="flex items-center">
    <EnvironmentOutlined style={{ fontSize: "24px", marginRight: "10px" }} />
    <span>{userInfo?.location || "No location available"}</span>
  </Card>
);

const EmailListBlock = ({ userInfo }) => (
  <Card title="Join my mailing list">
    <Form layout="inline">
      <Form.Item>
        <Input placeholder={userInfo?.email} />
      </Form.Item>
      {userInfo?.email && (
        <Form.Item>
          <Button
            type="primary"
            href={`mailto:${userInfo.email}`}
            icon={<MailOutlined />}
          >
            Liên hệ
          </Button>
        </Form.Item>
      )}
    </Form>
  </Card>
);
