import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/Logo.svg";
import { Button, Form, Grid, Input, theme, Typography } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function Login() {
  const { handleLogin, errMsg, addNotification } =
    React.useContext(AuthContext);
  const userRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  const onFinish = async (values) => {
    try {
      await handleLogin(values.username, values.password);
      addNotification("Đăng nhập thành công!", "success");
    } catch (error) {
      // Handle error if necessary
    }
  };

  const { token } = useToken();
  const screens = useBreakpoint();

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: token.colorBgContainer,
    },
    header: {
      textAlign: "center",
      marginBottom: token.marginXL,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logo: {
      width: "100px",
      height: "auto",
      marginBottom: token.marginLG,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      margin: "10px 0",
    },
    text: {
      color: token.colorTextSecondary,
      marginBottom: token.marginLG,
    },
    forgotPassword: {
      float: "right",
      color: token.colorPrimary,
      fontSize: token.fontSizeSmall,
    },
    section: {
      alignItems: "center",
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      justifyContent: "center",
      padding: screens.md ? `${token.sizeXXL}px 0` : "0",
      backgroundColor: token.colorBgLayout,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={Logo} alt="Logo" style={styles.logo} />
          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to <strong>H2T Tech Energy</strong>! Please enter your
            details below to sign in.
          </Text>
        </div>
        {errMsg && (
          <div className="flex items-center justify-center px-4 py-2 rounded-lg border border-red-500 bg-red-100 text-red-600 mb-4">
            <span>{errMsg}</span>
          </div>
        )}
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              type="text"
              placeholder="Phone number, username, or email"
              id="username"
              autoComplete="off"
              className="px-4 py-2 border rounded-lg border-zinc-400 bg-white text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                className={`px-4 py-2 border rounded-lg w-full ${
                  theme === "dark"
                    ? "border-zinc-600 bg-zinc-700 text-white"
                    : "border-zinc-400 bg-white text-black"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </Form.Item>
          <Form.Item>
            <a style={styles.forgotPassword} href="/">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
