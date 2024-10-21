// AdminLayout.js
import React, { useState } from "react";
import { Layout, theme } from "antd";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
      <Layout>
        {/* <AdHeader collapsed={collapsed} setCollapsed={setCollapsed} /> */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
