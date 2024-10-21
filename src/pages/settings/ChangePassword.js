import React, { useState, useEffect } from "react";
import { Layout, Card, Form, Input, Button, notification } from "antd";
import { MdOutlinePassword } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { useToastDesign } from "../../context/ToastService";
import useUserInfo from "../../hooks/useUserInfo";
import { useUser } from "../../context/UserProvider";

const { Content } = Layout;

const ChangePassword = () => {
  const { changePassword } = useUserInfo();
  const { userInfo } = useUser();

  const { addNotification } = useToastDesign();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (formData.newPassword && confirmPassword) {
      if (formData.newPassword === confirmPassword) {
        setIsPasswordMismatch(false);
        setIsSubmitEnabled(true);
      } else {
        setIsPasswordMismatch(true);
        setIsSubmitEnabled(false);
      }
    } else {
      setIsPasswordMismatch(false);
      setIsSubmitEnabled(false);
    }
  }, [formData.newPassword, confirmPassword]);

  const handleSubmit = async (values) => {
    const data = {
      old_password: values.oldPassword,
      new_password: values.newPassword,
    };

    try {
      const result = await changePassword(data);
      if (result.success) {
        addNotification("Password changed successfully", "success");
        setSuccess(true);
        setError(null);
        // Clear the form fields
        setFormData({ oldPassword: "", newPassword: "" });
        setConfirmPassword("");
      } else {
        console.error(result.error || "Failed to change password");
        setSuccess(false);
        setError(result.error || "Failed to change password");
      }
    } catch (error) {
      addNotification("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
      setSuccess(false);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "50px" }}>
        <Card
          title="Đổi Mật Khẩu"
          style={{ maxWidth: "500px", margin: "auto" }}
        >
          {userInfo && (
            <Form
              name="change_password"
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={formData}
            >
              <Form.Item
                label="Mật khẩu cũ"
                name="oldPassword"
                rules={[{ required: true, message: "Nhập mật khẩu cũ!" }]}
              >
                <Input.Password
                  prefix={<FaLock />}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}
              >
                <Input.Password
                  prefix={<FaLockOpen />}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                rules={[{ required: true, message: "Xác nhận mật khẩu mới!" }]}
              >
                <Input.Password
                  prefix={<MdOutlinePassword />}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>

              {isPasswordMismatch && (
                <p className="text-red-500">Mật khẩu mới không khớp!</p>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isSubmitEnabled}
                >
                  Đổi Mật Khẩu
                </Button>
              </Form.Item>

              {error && (
                <div className="flex items-center justify-center px-4 py-2 rounded-lg border border-red-500 bg-red-100 text-red-600 mb-4">
                  <span>{error}</span>
                </div>
              )}
            </Form>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default ChangePassword;
