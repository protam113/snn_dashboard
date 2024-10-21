import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Spin, notification, Select } from "antd";
import EditBanner from "./edtBanner";
import useBanner from "../../hooks/useBanner";
import { useAdminBanner } from "../../hooks/Banner/useAdminBanner";

const Banner = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useAdminBanner();
  const { deleteBanner, editBanner } = useBanner();

  const handleCreateBanner = () => {
    navigate("/banners/tao_banner");
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setShowModal(true);
  };

  const handleDeleteBanner = async (bannerId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa banner này?");
    if (confirm) {
      try {
        await deleteBanner(bannerId);
        notification.success({ message: "Xóa thành công!" });
      } catch (err) {
        notification.error({ message: "Đã xảy ra lỗi!" });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBanner(null);
  };

  const handleStatusChange = async (bannerId, status) => {
    try {
      await editBanner(bannerId, { status });
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Đã xảy ra lỗi khi tải Banner
      </div>
    );
  }

  const banners = data?.pages.flatMap((page) => page.adminBanner) || [];

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "No description",
    },
    {
      title: "Hình ảnh banner",
      dataIndex: "image",
      key: "image",
      render: (image, banner) => (
        <img
          src={image}
          alt={banner.title}
          className="w-32 h-32 object-cover rounded-md border border-gray-300"
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, banner) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(banner.id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="show" className="text-green-800 bg-green-100">
            Hiện
          </Select.Option>
          <Select.Option value="hide" className="text-red-800 bg-red-100">
            Ẩn
          </Select.Option>
        </Select>
      ),
    },
    {
      title: "Hoạt động",
      key: "action",
      render: (_, banner) => (
        <div className="flex items-center justify-center space-x-2">
          <MdEdit
            className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleEditBanner(banner)}
          />
          <MdDelete
            className="text-red-500 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => handleDeleteBanner(banner.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Quản lý Banner</h1>
        <Button type="primary" onClick={handleCreateBanner}>
          Tạo Banner
        </Button>
      </div>
      {banners.length > 0 ? (
        <>
          <Table
            dataSource={banners}
            columns={columns}
            pagination={false}
            rowKey="id"
          />
          {hasNextPage && (
            <Button className="mt-4" onClick={() => fetchNextPage()}>
              Tải thêm
            </Button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">No Banners Available</p>
      )}
      {showModal && selectedBanner && (
        <Modal
          title="Chỉnh sửa Banner"
          visible={showModal}
          onCancel={closeModal}
          footer={null}
        >
          <EditBanner banner={selectedBanner} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default Banner;
