import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Row, Col, Typography } from "antd";
import { FaImage } from "react-icons/fa";
import Loading from "../error/load";
import useAdmin from "../../hooks/useAdmin";
import { useWeb } from "../../hooks/useWeb";

const { Title, Text } = Typography;

const AdminWeb = () => {
  const { UpdateWeb } = useAdmin();
  const { data: web, error, isLoading } = useWeb();

  const [formData, setFormData] = useState({
    img: null,
    about: "",
    phone_number: "",
    mail: "",
    location: "",
    link: "",
  });

  useEffect(() => {
    if (web) {
      setFormData({
        img: null,
        about: web.about || "",
        phone_number: web.phone_number || "",
        mail: web.mail || "",
        location: web.location || "",
        link: web.link || "",
      });
    }
  }, [web]);

  const handleChange = (info) => {
    if (info.fileList.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        img: info.fileList[0].originFileObj,
      }));
    }
  };

  const handleSubmit = (values) => {
    const formDataToSend = new FormData();
    if (formData.img) formDataToSend.append("img", formData.img);
    if (values.about) formDataToSend.append("about", values.about);
    if (values.phone_number)
      formDataToSend.append("phone_number", values.phone_number);
    if (values.mail) formDataToSend.append("mail", values.mail);
    if (values.location) formDataToSend.append("location", values.location);
    if (values.link) formDataToSend.append("link", values.link);

    // Perform update
    UpdateWeb(formDataToSend, {
      onSuccess: () => {},
      onError: () => {},
    });
  };

  if (isLoading)
    return (
      <div className="text-center">
        <Loading />
      </div>
    );
  if (error)
    return <Text className="text-red-500">Error: {error.message}</Text>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Title level={1} className="text-center mb-10">
        Admin Web
      </Title>
      <Form layout="vertical" onFinish={handleSubmit} className="space-y-8">
        <Row gutter={16}>
          <Col span={12}>
            {/* Hình ảnh */}
            <Form.Item label={<Text strong>Hình ảnh:</Text>}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleChange}
              >
                <Button icon={<FaImage />} className="w-full">
                  Chọn Hình
                </Button>
              </Upload>
            </Form.Item>

            {/* About */}
            <Form.Item label={<Text strong>Thông tin về web:</Text>}>
              <Input.TextArea
                name="about"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                placeholder="Viết vài điều về công ty..."
                rows={4}
              />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item label={<Text strong>Số điện thoại:</Text>}>
              <Input
                name="phone_number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder="Nhập số điện thoại..."
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Email */}
            <Form.Item label={<Text strong>Email:</Text>}>
              <Input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={(e) =>
                  setFormData({ ...formData, mail: e.target.value })
                }
                placeholder="Nhập địa chỉ email..."
              />
            </Form.Item>

            {/* Vị trí */}
            <Form.Item label={<Text strong>Khu vực (Địa chỉ):</Text>}>
              <Input
                name="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Nhập vị trí..."
              />
            </Form.Item>

            {/* Liên kết */}
            <Form.Item label={<Text strong>Liên kết:</Text>}>
              <Input
                type="url"
                name="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="Nhập liên kết..."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Nút cập nhật */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminWeb;
