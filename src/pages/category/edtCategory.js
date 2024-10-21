import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message } from "antd";

const EdtCategory = ({ category, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const handleSave = async () => {
    if (!categoryName) {
      setErrMsg("Vui lòng nhập tên category!"); // Cập nhật errMsg
      return;
    }
    try {
      setErrMsg(""); // Xóa thông báo lỗi khi yêu cầu thành công
      await onSave({ id: category.id, name: categoryName });
      onClose();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật category.");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thể loại"
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      {errMsg && (
        <div className="mb-4">
          <span className="text-red-500">{errMsg}</span>
        </div>
      )}
      <Input
        placeholder="Tên thể loại"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        required
      />
    </Modal>
  );
};

export default EdtCategory;
