import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

const AddTagPopup = ({ onClose, onSave }) => {
  const [newTag, setNewTag] = useState("");

  const handleSave = async () => {
    if (!newTag) {
      return;
    }
    try {
      await onSave(newTag);
      onClose();
    } catch (error) {
      // Handle error here if necessary
    }
  };

  return (
    <Modal
      title="Thêm Tag Mới"
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder="Nhập tên tag"
      />
    </Modal>
  );
};

export default AddTagPopup;
