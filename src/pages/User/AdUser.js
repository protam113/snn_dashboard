import React, { useState } from "react";
import { FaSearch, FaUsers } from "react-icons/fa";
import * as XLSX from "xlsx";
import { Button, Table, Input, Select, message } from "antd";
import { debounce } from "lodash";
import { BiTrashAlt } from "react-icons/bi";
import { useRoles } from "../../hooks/Admin/useAdminRole";
import { useAdminFiltersUser } from "../../hooks/Admin/useAdminUser";
import { useUser } from "../../context/UserProvider";

const { Option } = Select;

const AdUser = () => {
  const { userRoles } = useUser();
  const [filters, setFilters] = useState({});
  const [searchField, setSearchField] = useState("username"); // Trường tìm kiếm mặc định là username
  const [searchValue, setSearchValue] = useState("");
  const { data: rolesData, isLoading: isRolesLoading } = useRoles(); // Lấy danh sách vai trò
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useAdminFiltersUser(filters); // Truyền filters vào hook
  const isAdmin = userRoles.includes("admin");

  const exportToExcel = () => {
    if (!data || !data.pages) {
      message.error("Data không có sẵn.");
      return;
    }

    const allUsers = data.pages.flatMap((page) => page.results || []);
    const ws = XLSX.utils.json_to_sheet(allUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users_data.xlsx");
    message.success("Xuất dữ liệu thành công!");
  };

  const columns = [
    {
      title: "Tên người dùng",
      key: "name",
      render: (user) => `${user.first_name} ${user.last_name}`,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Vai trò",
      dataIndex: ["role", "name"],
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
    },
  ];

  const expandedRowRender = (user) => {
    return (
      <div className="p-4">
        <p>
          <strong>Full Name:</strong> {user.first_name} {user.last_name}
        </p>
        <p>
          <strong>Phone Number:</strong> {user.phone_number || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role?.name || "N/A"}
        </p>
      </div>
    );
  };

  const handleTableChange = (pagination) => {
    if (pagination.current && hasNextPage) {
      fetchNextPage();
    }
  };

  // Hàm debounce để xử lý đầu vào tìm kiếm
  const debouncedSearch = debounce((value) => {
    handleFilterChange(searchField, value);
  }, 300); // 300ms debounce time

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    debouncedSearch(value); // Gọi hàm debounce
  };

  const handleFieldChange = (value) => {
    setSearchField(value);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleWithoutRoleChange = (roleId) => {
    if (roleId) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        role: null, // Đặt role thành null để lọc người dùng không có vai trò này
        without_role: roleId, // Lưu id vai trò mà bạn muốn lọc
      }));
    } else {
      const { without_role, ...restFilters } = filters; // Bỏ lọc nếu không chọn
      setFilters(restFilters);
    }
  };

  const resetFilters = () => {
    setFilters({});
    setSearchField("username");
    setSearchValue("");
  };

  return (
    <div className="p-6 min-h-screen ">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaUsers /> Quản lý người dùng
        </h1>
        <div>
          {isAdmin && (
            <Button
              type="primary"
              icon={<FaUsers />}
              onClick={exportToExcel}
              disabled={isLoading || !data?.pages?.length}
            >
              Xuất Excel
            </Button>
          )}
        </div>
      </header>

      {/* Thêm các thành phần lọc */}
      <div className="flex gap-4 mb-4">
        <Select
          onChange={handleFieldChange}
          value={searchField}
          className=" rounded mb-2"
          placeholder="Chọn trường tìm kiếm"
          suffixIcon={<FaSearch />}
        >
          <Option value="username">Username</Option>
          <Option value="last_name">Họ</Option>
          <Option value="first_name">Tên</Option>
          <Option value="id">ID</Option>
          <Option value="email">Email</Option>
        </Select>

        <Input
          placeholder={`Tìm kiếm theo ${searchField}`}
          onChange={handleSearchChange}
          value={searchValue}
        />
        <Select
          placeholder="Lọc theo vai trò"
          onChange={(value) => handleFilterChange("role", value)}
          style={{ width: 200 }}
          loading={isRolesLoading}
        >
          {Array.isArray(rolesData?.pages[0]?.results) ? (
            rolesData.pages[0].results.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))
          ) : (
            <Option disabled>Không có vai trò nào</Option>
          )}
        </Select>
        <Select
          placeholder="Lọc theo is_staff"
          onChange={(value) => handleFilterChange("is_staff", value)}
          style={{ width: 200 }}
        >
          <Option value={true}>Có</Option>
          <Option value={false}>Không</Option>
        </Select>
        <Select
          placeholder="Lọc người dùng không có vai trò"
          onChange={handleWithoutRoleChange}
          style={{ width: 200 }}
        >
          <Option value={null}>Không có vai trò</Option>
        </Select>
        <Button
          type="default"
          onClick={resetFilters}
          className="bg-red-500 text-white"
        >
          <BiTrashAlt />
        </Button>
      </div>

      <div>
        {isLoading ? (
          <p>Đang tải người dùng...</p>
        ) : isError ? (
          <p>Có lỗi xảy ra: {isError.message}</p>
        ) : (
          <Table
            columns={columns}
            dataSource={data?.pages.flatMap((page) => page.results) || []}
            rowKey="id"
            pagination={{
              pageSize: 20,
              total: data?.pages.flatMap((page) => page.results).length,
              onChange: handleTableChange,
            }}
            expandable={{ expandedRowRender }}
          />
        )}
      </div>
    </div>
  );
};

export default AdUser;
