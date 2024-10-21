import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useBanner from "../../hooks/useBanner";

const { Option } = Select;

const EditBanner = ({ banner, onClose }) => {
  const [form] = Form.useForm();
  const { editBanner } = useBanner();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(banner?.image || "");

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title,
        description: banner.description,
        status: banner.status,
      });
      setImagePreview(banner.image || "");
    }
  }, [banner, form]);

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImage(info.file.originFileObj);
      setImagePreview(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await editBanner(banner.id, { ...values, image });
      onClose();
      message.success("Cập nhật banner thành công!");
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật banner");
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-5 text-center">
          Chỉnh sửa Banner
        </h2>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
              >
                <Input placeholder="Nhập tiêu đề" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea placeholder="Nhập mô tả" rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh" name="image">
                <Upload
                  name="image"
                  accept="image/*"
                  showUploadList={false}
                  onChange={handleImageChange}
                >
                  <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                </Upload>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-40 object-cover rounded-md"
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Trạng thái" name="status">
                <Select placeholder="Chọn trạng thái">
                  <Option
                    value="show"
                    style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
                  >
                    Hiển thị
                  </Option>
                  <Option
                    value="hide"
                    style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                  >
                    Ẩn
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Button
                type="default"
                onClick={onClose}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" loading={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật Banner"}
              </Button>
            </Col>
          </Row>
          {/* Hiển thị lỗi */}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </Form>
      </div>
    </div>
  );
};

export default EditBanner;
