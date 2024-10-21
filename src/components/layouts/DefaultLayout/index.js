// AdminLayout.js
import React, { useState } from "react";
import { Layout, theme } from "antd";
import Sidebar from "./components/AdSidebar"; // Ensure the correct path to Sidebar
import AdHeader from "./components/AdHeader";
import AntdFooter from "./components/Footer";

const { Content } = Layout;

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <AdHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
      <AntdFooter />
    </>
  );
};

export default DefaultLayout;
