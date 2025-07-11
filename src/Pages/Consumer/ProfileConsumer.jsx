/* eslint-disable no-unused-vars */
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
  Spin,
} from "antd";
import EditProfileModal from "./Modal/EditProfileModal";
import dayjs from "dayjs";
import AddUserModal from "./Modal/AddUserModal";
import { render } from "less";
import { DeleteOutlined, DownloadOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
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
  const [loading, setLoading] = useState(false);

  // Retrieve user data safely from localStorage
  const storedUser = localStorage.getItem("user");
  const initialUserData = storedUser ? JSON.parse(storedUser).user : {};
  const userId = initialUserData.id;
  console.log(userId);
  const baseurl="http://52.66.186.241:8000"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchSubUserById(userId));
        const users = res.payload; // Assuming the response is in the payload
        const formattedUsers = users.map((user) => ({
          key: user.id,
          // username: user.email.split("@")[0], // Assuming username is the part before the email
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
  }, [dispatch]);

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
console.log('credit rating:', values.proof);

    // Debug: log the proof field structure
 // console.log('values.proof:', values.proof);

    // Extract base64 from proof upload
    let proofBase64 = undefined;
    if (values.proof && Array.isArray(values.proof) && values.proof.length > 0) {
      proofBase64 = values.proof[0].base64;
    }
 // console.log('proofBase64:', proofBase64);

    // Prevent submission if proofBase64 is missing
    // if (!proofBase64) {
    //   alert("Please wait for the file to finish uploading/converting before submitting.");
    //   return;
    // }

    const updatedUserData = {
        ...existingUserData.user,
        company_representative: values.company_representative ?? existingUserData.user.company_representative,
        company: values.company ?? existingUserData.user.company,
        email: values.email ?? existingUserData.user.email,
        mobile: values.mobile ?? existingUserData.user.mobile,
        credit_rating: values.credit_rating ?? existingUserData.user.credit_rating,
        credit_rating_proof: proofBase64,
    };

 // console.log('Payload to backend:', { userId, userData: updatedUserData });

    dispatch(editUser({ userId, userData: updatedUserData }))
        .then((res) => {
            if (res.payload && res.payload.data && res.payload.data.data) {
                const updatedLocalStorageData = {
                    message: existingUserData.message || "Login successful",
                    token: existingUserData.token,
                    user: {
                        ...existingUserData.user,
                        ...res.payload.data.data, // Use the updated user data from the API response
                    },
                    subscription_type: existingUserData.subscription_type,
                    start_date: existingUserData.start_date,
                    end_date: existingUserData.end_date,
                    status: existingUserData.status,
                };

                // Update localStorage immediately
                localStorage.setItem("user", JSON.stringify(updatedLocalStorageData));
                setUserData(updatedLocalStorageData.user); // Update state immediately

                // Trigger custom event to notify HeaderComponent
                const event = new Event("userDetailsUpdated");
                window.dispatchEvent(event);

             // console.log("User updated successfully:", res);
            }
        })
        .catch((error) => {
            console.error("Failed to update user:", error);
        });

    setIsModalVisible(false);
};

  const handleSaveUser = (values) => {
    setIsUserModal(false);

    // Ensure `values` is an object before updating state
    if (values && typeof values === "object") {
      setUserDataSource([
        ...userDataSource,
        { ...values, key: userDataSource.length + 1 },
      ]);
    }
  };
 
const credit_rating_proof=`${baseurl}${userData.credit_rating_proof}`|| "N/A";
  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    navigate("/");
  };

  

  const userColumns = [
    {
      title: "SR No.",
      key: "srNo",
      render: (text, record, index) => index + 1, // This will display the serial number starting from 1
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
                <Text> : {userData.cin_number || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Company</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData.company || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Representative</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData.company_representative || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Email</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData.email || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Mobile</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData.mobile || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>User Category</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData.user_category || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Credit Rating</Text>
              </Col>
              <Col span={12}>
                <Text> : {userData.credit_rating || "N/A"} {'    '}</Text> 
  <a
  href={credit_rating_proof}
  target="_blank"
  rel="noopener noreferrer"
  download
  style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', textDecoration: 'underline' }}
>
  {/* <DownloadOutlined />  */}
  Proof
</a>

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

        {role === "Admin" ? (
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
                    height: "60vh", // Full height of the viewport
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
        editableData={editableData}
        edit={editValue}
      />
    </Row>
  );
};

export default ProfilePage;
