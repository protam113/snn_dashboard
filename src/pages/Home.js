import { Row, Col, Typography } from "antd";
import card from "../assets/img/Logo.svg";
import React from "react";
import AntdCard from "../components/AntCard";
import LineChart from "../components/Charts/LineChart";
import { Iconify } from "../utils/Iconify";
import { useWeb } from "../hooks/useWeb";
import Echat from "../components/Charts/Echat";

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const { data: web, error, isLoading } = useWeb();

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <AntdCard xl={10}>
            {/* Add a chart component or any other content here */}
            <Echat />
          </AntdCard>
          <AntdCard xl={14}>
            <LineChart />
          </AntdCard>
        </Row>
        <Row gutter={[24, 0]}>
          <AntdCard cardClass="cardbody" xl={16}>
            <div className="ant-list-box table-responsive"></div>
          </AntdCard>
          <AntdCard xl={8}>
            <div className="ant-list-box table-responsive"></div>
          </AntdCard>
        </Row>
        <Row gutter={[24, 0]}>
          <AntdCard xl={14}>
            <Row>
              <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
                <div className="h-full col-content p-20">
                  <div className="ant-muse">
                    <Text>Built by XLR</Text>
                    <Title level={5}>H2H Dashboard for XLR Team</Title>
                    <Paragraph className="lastweek mb-36">
                      {web.about} {/* Displaying the about info */}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Phone:</Text> {web.phone_number}{" "}
                      {/* Displaying phone number */}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Email:</Text> {web.mail}{" "}
                      {/* Displaying email */}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Location:</Text> {web.location}{" "}
                      {/* Displaying location */}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Website:</Text>{" "}
                      <a
                        href={web.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {web.link}
                      </a>{" "}
                      {/* Displaying link */}
                    </Paragraph>
                  </div>
                  <div className="card-footer">
                    <a href="#pablo" className="icon-move-right">
                      Read more{" "}
                      <Iconify
                        icon="eva:chevron-right-fill"
                        width="17px"
                        height="17px"
                      />
                    </a>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12} sm={24} lg={12} xl={10} className="col-img">
                <div className="ant-cret text-right">
                  <img src={web.img} className="border10" alt="Company Logo" />{" "}
                  {/* Displaying the logo */}
                </div>
              </Col>
            </Row>
          </AntdCard>
          <AntdCard xl={10} cardClass="card-info-2">
            <div className="gradent h-full col-content">
              <div className="card-content">
                <Title level={5}>Work with the best</Title>
                <p>
                  Chúng tôi luôn lấy khách hàng làm trọng tâm và phục vụ khách
                  hàng là yếu tố mang đến sự thành công.
                </p>
              </div>
            </div>
          </AntdCard>
        </Row>
      </div>
    </div>
  );
};

export default Home;
