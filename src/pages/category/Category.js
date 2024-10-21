import React, { useState } from "react";
import { Table, Button, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import EdtCategory from "./edtCategory";
import CreateCategory from "./createCategory";
import {
  useAddCategory,
  useCategoryList,
  useDeleteCategory,
  useEditCategory,
} from "../../hooks/Product/useCategories";
import Loading from "../error/load";

const AdCategory = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useCategoryList(page);
  const { mutate: addCategoryMutation } = useAddCategory();
  const { mutate: editCategoryMutation } = useEditCategory();
  const { mutate: deleteCategoryMutation } = useDeleteCategory();

  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = (newCategory) => {
    addCategoryMutation(
      { name: newCategory },
      {
        onSuccess: () => {
          setShowAddCategoryPopup(false);
        },
      }
    );
  };

  const handleEditCategory = (updatedCategory) => {
    editCategoryMutation(
      { categoryId: updatedCategory.id, edtCategory: updatedCategory },
      {
        onSuccess: () => {
          setEditingCategory(null);
        },
      }
    );
  };

  const handleDelete = (categoryId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa category này không?",
      onOk: () => {
        deleteCategoryMutation(
          { categoryId },
          {
            onSuccess: () => {},
          }
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Failed to load categories</p>
    );
  }

  const columns = [
    {
      title: "Stt",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "created_date",
      key: "created_date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updated_date",
      key: "updated_date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (category) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setEditingCategory(category)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(category.id)}
            danger
          />
        </>
      ),
    },
  ];

  const categories = data?.categories || [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-semibold">
          Quản lý thể loại (Categories)
        </h5>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddCategoryPopup(true)}
        >
          Tạo Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={false}
      />

      <div className="flex justify-center mt-6">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          icon={<ArrowLeftOutlined />}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setPage((prev) => (prev < data?.totalPages ? prev + 1 : prev))
          }
          disabled={page === data?.totalPages}
          icon={<ArrowRightOutlined />}
        >
          Next
        </Button>
      </div>

      {/* Modal for Editing */}
      {editingCategory && (
        <EdtCategory
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleEditCategory}
        />
      )}

      {/* Modal for Adding Category */}
      {showAddCategoryPopup && (
        <CreateCategory
          onClose={() => setShowAddCategoryPopup(false)}
          onSave={handleAddCategory}
        />
      )}
    </div>
  );
};

export default AdCategory;
