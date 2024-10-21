import React from "react";
import { Modal, Form, Input, message } from "antd";

const CreateCategory = ({ onClose, onSave }) => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values.name);
      onClose();
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <Modal
      title="Tạo Category Mới"
      visible={true}
      onCancel={onClose}
      onOk={handleSave}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên Category"
          rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCategory;
