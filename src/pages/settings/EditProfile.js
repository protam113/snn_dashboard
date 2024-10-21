import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useToastDesign } from "../../context/ToastService";
import { useUser } from "../../context/UserProvider";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Row,
  Col,
} from "antd";
import LocationSelector from "../../components/Location/LocationSelector";
import Loading from "../error/load";

const { Title } = Typography;

const EditProfile = () => {
  const { addNotification } = useToastDesign();
  const { userInfo, loading, error, updateUserInfo } = useUser();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    about: "",
    profile_image: null,
    profile_bg: null,
    link: "",
  });
  const [location, setLocation] = useState({
    province: "",
    district: "",
  });

  const navigate = useNavigate();

  const handleChange = (name) => (info) => {
    if (info.file.status === "done") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: info.file.originFileObj,
      }));
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleLocationChange = (formattedLocation) => {
    const [province, district] = formattedLocation.split(", ");
    setLocation({
      province,
      district,
    });
    setFormData((prevState) => ({
      ...prevState,
      location: formattedLocation,
    }));
  };

  const handleSubmit = async (values) => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      await updateUserInfo(data);
      addNotification("Cập nhật thông tin thành công!", "success");
      if (userInfo && userInfo.username) {
        navigate("/");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin!", err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFormData({
        first_name: userInfo.first_name || "",
        last_name: userInfo.last_name || "",
        phone_number: userInfo.phone_number || "",
        location: userInfo.location || "",
        about: userInfo.about || "",
        profile_image: null,
        profile_bg: null,
        link: userInfo.link || "",
      });
    }
  }, [userInfo]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  if (error) return <p>{error.message}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Title level={3} className="text-center mb-6">
        Chỉnh sửa Hồ sơ
      </Title>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        encType="multipart/form-data"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ"
              name="first_name"
              rules={[{ required: true, message: "Vui lòng nhập họ của bạn!" }]}
            >
              <Input
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tên"
              name="last_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn!" },
              ]}
            >
              <Input
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item label="Địa điểm">
          <LocationSelector
            selectedProvince={location.province}
            selectedDistrict={location.district}
            onLocationChange={handleLocationChange}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Ảnh đại diện" name="profile_image">
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleChange("profile_image")}
              >
                <Button icon={<AiOutlinePlus />}>Tải ảnh đại diện</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ảnh nền" name="profile_bg">
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleChange("profile_bg")}
              >
                <Button icon={<AiOutlinePlus />}>Tải ảnh nền</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Giới thiệu" name="about">
          <Input.TextArea
            value={formData.about}
            onChange={(e) =>
              setFormData({ ...formData, about: e.target.value })
            }
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Liên kết" name="link">
          <Input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;
