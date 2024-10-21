import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Pagination,
  Spin,
  Alert,
  Space,
  Typography,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import EditTagPopup from "./EditTagPopup";
import AddTagPopup from "./AddTagPopup";
import {
  useAddTag,
  useDeleteTag,
  useEditTag,
  useTags,
} from "../../hooks/useTag";

const { Title } = Typography;

const ManageTag = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useTags(page);
  const { mutate: addTagMutation } = useAddTag();
  const { mutate: editTagMutation } = useEditTag();
  const { mutate: deleteTagMutation } = useDeleteTag();

  const [editingTag, setEditingTag] = useState(null);
  const [showAddTagPopup, setShowAddTagPopup] = useState(false);

  const handleAddTag = (newTag) => {
    addTagMutation(
      { name: newTag },
      {
        onSuccess: () => {
          setShowAddTagPopup(false);
        },
      }
    );
  };

  const handleEditTag = (updatedTag) => {
    editTagMutation(
      { TagId: updatedTag.id, edtTag: updatedTag },
      {
        onSuccess: () => setEditingTag(null),
      }
    );
  };

  const handleDeleteTag = (tagId) => {
    deleteTagMutation({ TagId: tagId });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1 + (page - 1) * 20,
      align: "center",
    },
    {
      title: "Tên Tag",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setEditingTag(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTag(record.id)}
          />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Quản lý Tag</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddTagPopup(true)}
        >
          Thêm Tag
        </Button>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        {error && !isLoading && (
          <Alert
            message="Error"
            description={error.message}
            type="error"
            showIcon
          />
        )}

        <Table
          dataSource={data?.tags || []}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "Không có tag nào" }}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          total={(data?.totalPages || 1) * 20}
          pageSize={20}
          showSizeChanger={false}
          onChange={(page) => setPage(page)}
          itemRender={(current, type, originalElement) => {
            if (type === "prev") {
              return <LeftOutlined />;
            }
            if (type === "next") {
              return <RightOutlined />;
            }
            return originalElement;
          }}
        />
      </div>

      {editingTag && (
        <EditTagPopup
          tag={editingTag}
          onClose={() => setEditingTag(null)}
          onSave={handleEditTag}
        />
      )}

      {showAddTagPopup && (
        <AddTagPopup
          onClose={() => setShowAddTagPopup(false)}
          onSave={handleAddTag}
        />
      )}
    </div>
  );
};

export default ManageTag;
