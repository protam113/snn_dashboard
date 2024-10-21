import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TagsOutlined,
  PictureOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  PieChartOutlined,
  SolutionOutlined,
  ShoppingOutlined,
  FileOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { FaUser, FaUserLock } from "react-icons/fa";
import Logo from "../../../../assets/img/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../context/UserProvider";
import LogoutButton from "../../../Button/LogoutButton";

const { Sider } = Layout;

function getItem(label, key, icon, path, children) {
  return {
    key,
    icon,
    path,
    children,
    label,
  };
}

const Sidebar = ({ collapsed }) => {
  const { userRoles } = useUser();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("1"); // State to keep track of selected key

  // Define items with paths
  const items = [
    getItem("Dashboard", "1", <DashboardOutlined />, "/"),
    ...(userRoles.includes("admin")
      ? [
          getItem("User", "5", <FaUser />, "/user"),
          getItem("Web Info", "12", <FileTextOutlined />, "/thong_tin_web"),
          getItem("Role", "14", <FaUserLock />, "/role"),
        ]
      : []),
    getItem("Categories", "2", <TagsOutlined />, "/the_loai"),
    getItem("Tags", "3", <TagsOutlined />, "/tag"),
    getItem("Banners", "4", <PictureOutlined />, "/banners"),
    getItem("Statistics", "sub1", <BarChartOutlined />, null, [
      getItem("Bài Viết", "6", <FileOutlined />, "/thong_ke/blog"),
      getItem("Danh Mục Sản Phẩm", "7", <TagsOutlined />, "/thong_ke/the_loai"),
      getItem(
        "Sản Phẩm Theo Danh Mục",
        "8",
        <ShoppingOutlined />,
        "/thong_ke/san_pham"
      ),
      getItem(
        "Đơn Ứng Tuyển",
        "9",
        <SolutionOutlined />,
        "/thong_ke/don_ung_tuyen"
      ),
      getItem("Ứng Tuyển", "10", <PieChartOutlined />, "/thong_ke/ung_tuyen"),
      getItem("Tin Tuyển Dụng", "11", <UserOutlined />, "/thong_ke/tuyen_dung"),
    ]),
    getItem("Cài Đặt", "15", <SettingFilled />, "/setting"),
  ];

  // Handle menu item click
  const onClick = (e) => {
    const { key } = e; // Lấy key được chọn
    let selectedItem = items.find((item) => item.key === key);

    if (!selectedItem) {
      // Nếu không tìm thấy ở mục chính, tìm ở mục con
      items.forEach((item) => {
        if (item.children) {
          selectedItem = item.children.find((child) => child.key === key);
        }
      });
    }

    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path);
      setSelectedKey(key); // Cập nhật selected key
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="bg-main-blue2"
      width={250} // Set the maximum width of Sider
    >
      {/* Logo Section */}
      <div
        className="flex justify-center items-center py-4"
        style={{
          height: collapsed ? "64px" : "120px", // Adjust the height based on collapse state
          transition: "all 0.3s",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: collapsed ? "40px" : "100px", // Adjust the width based on collapse state
            transition: "all 0.3s",
          }}
        />
      </div>

      {/* Menu Section */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]} // Set the selected keys to the state
        className="bg-main-blue2"
        items={items.map((item) => ({
          ...item,
          label: <span className="text-white">{item.label}</span>,
        }))}
        onClick={onClick}
        style={{
          border: "none",
        }}
        inlineCollapsed={collapsed}
      />

      {/* Logout Button */}
      <div className="px-4 mt-auto">
        <LogoutButton />
      </div>
    </Sider>
  );
};

export default Sidebar;
