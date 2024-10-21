import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { publicRoutes, privateRoutes, AdminLayout } from "./routes/index";
import "./App.css";
import { HelmetProvider } from "react-helmet-async";
// import ProtectedRoutes from "./utils/ProtectedRoutes.js";

import { ErrorProvider, useError } from "./context/ErrorProvider.js";
import { Error404, Error500, WebMaintenance } from "./pages/error/error.js";
import { SecureStorageProvider } from "./context/SecureStorageProvider.js";
import { AuthProvider } from "./context/AuthContext.js";
import { UserProvider } from "./context/UserProvider.js";
import { ToastDesignProvider } from "./context/ToastService.js";
import ProtectedRoutes from "./utils/ProtectedRoutes.js";
import useAuth from "./hooks/useAuth.js";
import Login from "./pages/auth/Login.js";

function AppContent() {
  const { error } = useError();
  const { isAuthenticated } = useAuth();

  if (error?.type === "maintenance") {
    return <WebMaintenance />;
  }

  if (error?.type === "server") {
    return <Error500 message="Lỗi máy chủ. Vui lòng thử lại sau." />;
  }

  if (error?.type === "default") {
    return (
      <Error404 message={error.message || "Đã xảy ra lỗi không xác định."} />
    );
  }

  return (
    <div className="app ">
      <Routes>
        {/* Route cho trang đăng nhập chỉ hiển thị khi chưa đăng nhập */}
        {!isAuthenticated && <Route path="/login" element={<Login />} />}

        {publicRoutes.map((route, id) => {
          const Page = route.component;
          const Layout = route.layout;

          return (
            <Route
              key={id}
              path={route.path}
              element={
                Layout ? (
                  <ProtectedRoutes>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectedRoutes>
                ) : (
                  <ProtectedRoutes>
                    <Page />
                  </ProtectedRoutes>
                )
              }
            />
          );
        })}

        {privateRoutes.map((route, id) => {
          const Page = route.component;
          const Layout = route.layout || AdminLayout;

          return (
            <Route
              key={id}
              path={route.path}
              element={
                <ProtectedRoutes>
                  {Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )}
                </ProtectedRoutes>
              }
            />
          );
        })}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SecureStorageProvider>
        <ToastDesignProvider>
          <ErrorProvider>
            <AuthProvider>
              <UserProvider>
                <HelmetProvider>
                  <AppContent />
                </HelmetProvider>
              </UserProvider>
            </AuthProvider>
          </ErrorProvider>
        </ToastDesignProvider>
      </SecureStorageProvider>
    </Router>
  );
}

export default App;
