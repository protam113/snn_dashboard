import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { useToastDesign } from "../../context/ToastService";

const EditTagPopup = ({ tag, onClose, onSave }) => {
  const [tagName, setTagName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { addNotification } = useToastDesign();

  useEffect(() => {
    if (tag) {
      setTagName(tag.name);
    }
  }, [tag]);

  const handleSave = async () => {
    if (!tagName) {
      setErrMsg("Vui lòng nhập tên tag!");
      return;
    }
    try {
      await onSave({ id: tag.id, name: tagName });
      onClose();
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi cập nhật tag.", "error");
    }
  };

  return (
    <Modal
      title="Sửa Tag"
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
      {errMsg && (
        <div className="mb-4">
          <span style={{ color: "red" }}>{errMsg}</span>
        </div>
      )}
      <Input
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
        placeholder="Nhập tên tag"
      />
    </Modal>
  );
};

export default EditTagPopup;
