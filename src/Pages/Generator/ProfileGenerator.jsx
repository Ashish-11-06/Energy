import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Table,
  Modal,
  Form,
} from "antd";
import EditProfileModal from "./Modal/EditProfileModal";
import dayjs from "dayjs";
import AddUserModal from "../Consumer/Modal/AddUserModal";
import { LogoutOutlined } from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchSubUserById } from "../../Redux/Slices/Consumer/subUserSlice";
import { useDispatch } from "react-redux";
import { editUser } from "../../Redux/Slices/userSlice";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUserModal, setIsUserModal] = useState(false);
  const [editableData, setEditaleData] = useState("");
  const [editValue, setEditValue] = useState(false);
  const [form] = Form.useForm();
    const dispatch = useDispatch();
   const [userDataSource, setUserDataSource] = useState([]);

  
  // Retrieve user data safely from localStorage
  const storedUser = localStorage.getItem("user");
  // console.log(storedUser);
  const userDat = JSON.parse(localStorage.getItem('user')).user;

  const initialUserData = storedUser ? JSON.parse(storedUser).user : {};
  // console.log(`ajdfljk ${JSON.stringify(initialUserData)}`);
const userId = initialUserData.id;
// console.log(userDat);

  const navigate = useNavigate();

  const role = initialUserData.role;
  // console.log(role);
  const [userData, setUserData] = useState(initialUserData);

  // Retrieve subscription plan safely from localStorage
  const storedPlan = localStorage.getItem("subscriptionPlanValidity");
  const subscriptionPlan = storedPlan ? JSON.parse(storedPlan) : {};

  const start_date = subscriptionPlan?.start_date
    ? dayjs(subscriptionPlan.start_date).isValid()
      ? dayjs(subscriptionPlan.start_date).format("DD/MM/YYYY")
      : "N/A"
    : "N/A";

  const end_date = subscriptionPlan?.end_date
    ? dayjs(subscriptionPlan.end_date).isValid()
      ? dayjs(subscriptionPlan.end_date).format("DD/MM/YYYY")
      : "N/A"
    : "N/A";

  // Initial users list
  // const [userDataSource, setUserDataSource] = useState([
  //   { key: 1, username: "abc", email: "abc@gmail.com", role: "Admin" },
  //   { key: 2, username: "def", email: "def@gmail.com", role: "Management" },
  //   { key: 3, username: "ghi", email: "ghi@gmail.com", role: "Edit" },
  //   { key: 4, username: "pqr", email: "pqr@gmail.com", role: "View" },
  // ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchSubUserById(userId));
        const users = res.payload; // Assuming the response is in the payload
        const formattedUsers = users.map(user => ({
          key: user.id,
          username: user.email.split('@')[0], // Assuming username is the part before the email
          email: user.email,
          role: user.role,
        }));
        setUserDataSource(formattedUsers);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, [dispatch, userId]);


  const handleEditToggle = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleUserCancel = () => {
    setIsUserModal(false);
    setEditValue(false);
    form.resetFields();
  };
  const handleAddUser = () => setIsUserModal(true);

const handleSave = (values) => {
  const storedUser = localStorage.getItem("user");
  const existingUserData = storedUser ? JSON.parse(storedUser) : {};

  // Compare and update only changed fields
  const updatedUserData = {
    ...existingUserData.user,
    ...(values.company_representative !== existingUserData.user.company_representative && { company_representative: values.company_representative }),
    ...(values.company !== existingUserData.user.company && { company: values.company }),
    ...(values.email !== existingUserData.user.email && { email: values.email }),
    ...(values.mobile !== existingUserData.user.mobile && { mobile: values.mobile }),
  };

  dispatch(editUser({ userId, userData: updatedUserData }))
    .then((res) => {
      if (res.payload && res.payload.data) {
        // Merge API response with existing localStorage data
        const updatedLocalStorageData = {
          ...existingUserData,
          user: {
            ...existingUserData.user,
            ...res.payload.data.data, // Use the `data` object from the API response
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedLocalStorageData));
        setUserData(updatedLocalStorageData.user);

        // Trigger custom event to notify HeaderComponent
        const event = new Event("userDetailsUpdated");
        window.dispatchEvent(event);

        console.log("User updated successfully:", res);
      } else {
        console.error("API response is missing required data.");
      }
    })
    .catch((error) => {
      console.error("Failed to update user:", error);
    });

  setIsModalVisible(false);
};

  const handleSaveUser = (values) => {
    setIsUserModal(false);
    // console.log("User saved:", values);

    // Ensure `values` is an object before updating state
    if (values && typeof values === "object") {
      setUserDataSource([
        ...userDataSource,
        { ...values, key: userDataSource.length + 1 },
      ]);
    }
  };  
  const handleEdit = (record) => {
    setEditaleData(record);
    // console.log(record);
    setIsUserModal(true);
    setEditValue(true);
    form.resetFields();
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = (key) => {
    const updatedDataSource = userDataSource.filter(
      (record) => record.key !== key
    );
    setUserDataSource(updatedDataSource);
  };

  const userColumns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   render: (_, record) => (
    //     <>
    //       {/* <a
    //         type="primary"
    //         style={{ marginRight: 8 }}
    //         icon={<EditOutlined />}
    //         onClick={() => handleEdit(record)}
    //       >
    //         Edit
    //       </a> */}
    //       <a
    //         type="danger"
    //         style={{ color: "red" }}
    //         icon={<DeleteOutlined />}
    //         onClick={() => handleDelete(record.key)}
    //       >
    //         Delete
    //       </a>
    //     </>
    //   ),
    // },


  return (
    <Row justify="center" style={{ marginTop: "50px", width: "100%",  }}>
      <Row
        gutter={[16, 16]}
        justify="center"
        style={{
          width: "100%",
        }}
      >
        <Col span={14} xs={24} sm={20} md={20} lg={12}>

          <Card bordered style={{ borderRadius: "8px", minHeight: "400px" }}>
            <Row justify="center" style={{ marginBottom: "20px" }}>
              <Avatar size={70} src="/src/assets/profile1.jpeg" />
            </Row>
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Profile
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <Text strong>CIN Number</Text>
              </Col>
              <Col span={14}>
                <Text> : {userData.cin_number || "-"}</Text>
              </Col>
              <Col span={10}>
                <Text strong>Company</Text>
              </Col>
              <Col span={14}>
                <Text> : {userData.company || "N/A"}</Text>
              </Col>
              <Col span={10}>
                <Text strong>Representative</Text>
              </Col>
              <Col span={14}>
                <Text> : {userData.company_representative || "N/A"}</Text>
              </Col>
             <Col span={10}>
  <Text strong>Email</Text>
</Col>
<Col span={14}>
  {/* <Text style={{ marginLeft: "10px", display: "inline-block", width: "calc(100% - 20px)" }}> */}
    : {userData.email || "N/A"}
  {/* </Text> */}
</Col>
              <Col span={10}>
                <Text strong>Mobile</Text>
              </Col>
              <Col span={14}>
                <Text> : {userData.mobile || "N/A"}</Text>
              </Col>
              <Col span={10}>
                <Text strong>User Category</Text>
              </Col>
              <Col span={14}>
                <Text> : {userData.user_category || "N/A"}</Text>
              </Col>
              <Col span={10}>
                <Text strong>Subscription plan </Text>
              </Col>
              <Col span={14}>
                <Text> :
                  {" "}
                  
                  {subscriptionPlan?.subscription_type
                    ? `EXT ${subscriptionPlan.subscription_type} Plan`
                    : "N/A"}
                </Text>
              </Col>
              <Col span={10}>
                <Text strong>Plan validity</Text>
              </Col>
              <Col span={14}>
                <Text> :
                  {" "}
                  {start_date === "N/A" && end_date === "N/A"
                    ? "N/A"
                    : `${start_date} `}
                  {start_date !== "N/A" && end_date !== "N/A" && (
                    <span style={{ fontWeight: "bold" }}>To</span>
                  )}
                  {end_date !== "N/A" && ` ${end_date}`}
                </Text>
              </Col>
            </Row>
            <Row
              justify="center"
              style={{ marginTop: "20px", justifyContent: "space-between" }}
            >
              <Button type="primary" onClick={handleEditToggle}>
                Edit Profile
              </Button>
              <Button type="primary" icon={<LogoutOutlined /> } onClick={handleLogOut}>
                Log out
              </Button>
            </Row>
          </Card>
        </Col>

        {/* {role === "Admin" ? (
          <Col span={12} xs={24} sm={12} md={12} lg={10}>
            <Card bordered style={{ borderRadius: "8px", minHeight: "530px" }}>
              <Title
                level={3}
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  marginTop: "4%",
                }}
              >
                User Management
              </Title>
              <Row justify="center">
                <Button type="primary" onClick={handleAddUser}>
                  Add User
                </Button>
              </Row>
              <br />
              <Table
                columns={userColumns}
                dataSource={userDataSource}
                bordered
                style={{ marginTop: "10px" }}
                pagination={false}
              />
            </Card>
          </Col>
        ) : null} */}
      </Row>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
        initialValues={userData}
      />

      {/* Add User Modal */}
      <AddUserModal
        isVisible={isUserModal}
        onCancel={handleUserCancel}
        onSave={handleSaveUser}
        editableData={editableData}
        edit={editValue}
      />
    </Row>
  );
};

export default ProfilePage;
