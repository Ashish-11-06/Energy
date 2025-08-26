import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Table,
  Spin,
  message,
  Upload
} from "antd";
import {
  LogoutOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import EditProfileModal from "./Modal/EditProfileModal";
import AddUserModal from "./Modal/AddUserModal";
import { fetchSubUserById } from "../../Redux/Slices/Consumer/subUserSlice";
import { editUser } from "../../Redux/Slices/userSlice";
import { decryptData, encryptData } from "../../Utils/cryptoHelper";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUserModal, setIsUserModal] = useState(false);
  const [userDataSource, setUserDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Retrieve user data
  const userDataa = decryptData(localStorage.getItem('user'));
  const user = userDataa?.user;
  const userId = user?.id;
  const role = user?.role;
  const [userData, setUserData] = useState(user);
  
  // Retrieve subscription plan
  const subscriptionPlan = decryptData(localStorage.getItem("subscriptionPlanValidity"));
  const baseurl = import.meta.env.VITE_BASE_URL_GEN;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchSubUserById(userId));
        const users = res.payload;
        const formattedUsers = users.map((user) => ({
          key: user.id,
          email: user.email,
          role: user.role,
        }));
        setUserDataSource(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, [dispatch, userId]);

  const handleEditToggle = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleAddUser = () => setIsUserModal(true);
  const handleUserCancel = () => setIsUserModal(false);

  const handleSave = async (values) => {
    try {
      const userData = decryptData(localStorage.getItem('user'));
      const existingUserData = userData?.user;
      
      let proofBase64 = undefined;
      
      // Handle file upload
      if (values.proof && Array.isArray(values.proof) && values.proof.length > 0) {
        const file = values.proof[0].originFileObj;
        
        if (file) {
          proofBase64 = await convertToBase64(file);
        }
      }
      
      const updatedUserData = {
        ...existingUserData,
        company_representative: values.company_representative ?? existingUserData.company_representative,
        company: values.company ?? existingUserData.company,
        email: values.email ?? existingUserData.email,
        mobile: values.mobile ?? existingUserData.mobile,
        credit_rating: values.credit_rating ?? existingUserData.credit_rating,
        credit_rating_proof: proofBase64 !== undefined ? proofBase64 : existingUserData.credit_rating_proof,
      };
      
      const res = await dispatch(editUser({ userId, userData: updatedUserData }));
      
      if (res.payload && res.payload.data && res.payload.data.data) {
        const updatedLocalStorageData = {
          ...userData,
          user: {
            ...userData.user,
            ...res.payload.data.data,
          },
        };
        
        localStorage.setItem("user", encryptData(updatedLocalStorageData));
        setUserData(updatedLocalStorageData.user);
        
        // Trigger custom event to notify HeaderComponent
        const event = new Event("userDetailsUpdated");
        window.dispatchEvent(event);
        
        message.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      message.error("Failed to update profile. Please try again.");
    }
    
    setIsModalVisible(false);
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSaveUser = (values) => {
    setIsUserModal(false);
    if (values && typeof values === "object") {
      setUserDataSource([
        ...userDataSource,
        { ...values, key: userDataSource.length + 1 },
      ]);
    }
  };

  const credit_rating_proof = userData?.credit_rating_proof 
    ? `${baseurl}${userData.credit_rating_proof}` 
    : null;

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    navigate("/");
  };

  const userColumns = [
    {
      title: "SR No.",
      key: "srNo",
      render: (text, record, index) => index + 1,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  return (
    <Row justify="center" style={{ marginTop: "50px", width: "100%" }}>
      <Row
        gutter={[16, 16]}
        justify="center"
        style={{
          width: "100%",
        }}
      >
        <Col span={12} xs={24} sm={12} md={12} lg={10}>
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
              <Col span={12}>
                <Text strong>CIN Number</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.cin_number || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Company</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.company || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Representative</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.company_representative || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Email</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.email || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Mobile</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.mobile || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>User Category</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.user_category || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Credit Rating</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData?.credit_rating || "N/A"} {'    '}</Text>
                {userData?.credit_rating && userData?.credit_rating !== "N/A" && (
                  <a
                    href={credit_rating_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="credit_rating_proof.pdf"
                    style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', textDecoration: 'underline' }}
                  >
                    Proof
                  </a>
                )}
              </Col>

              <Col span={12}>
                <Text strong>Subscription plan</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {" "}
                  :
                  {subscriptionPlan?.subscription_type
                    ? ` EXT ${subscriptionPlan.subscription_type} Plan`
                    : "N/A"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Plan validity</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {start_date === "N/A" && end_date === "N/A"
                    ? "N/A"
                    : `: ${start_date} `}
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
                Edit
              </Button>
              <Button type="primary"
                icon={<LogoutOutlined />} onClick={handleLogOut}>
                Log out
              </Button>
            </Row>
          </Card>
        </Col>

        {userData?.role === "Admin" ? (
          <Col span={12} xs={24} sm={12} md={12} lg={10}>
            <Card bordered style={{ borderRadius: "8px", minHeight: "400px" }}>
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
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table
                    columns={userColumns}
                    dataSource={userDataSource}
                    bordered
                    style={{ marginTop: "10px" }}
                    pagination={false}
                  />
                </div>
              )}
            </Card>
          </Col>
        ) : null}
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
      />
    </Row>
  );
};

export default ProfilePage;