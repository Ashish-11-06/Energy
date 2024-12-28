import React, { useState } from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

// Mock data for the energy generator profile
const initialGeneratorData = {
  companyName: "Energy Solutions Inc.",
  generatorModel: "G-2000",
  location: "New York, USA",
  address: "456 Energy Rd, New York, NY",
  capacity: "2000 kW",
  status: "Active",
};

const ProfileGenerator = () => {
  const [generatorData] = useState(initialGeneratorData);

  return (
    <div style={styles.container}>
      <Card
        style={styles.card}
        title="Energy Generator Profile"
      >
        <Row
          justify="center"
          align="middle"
          style={styles.row}
        >
          <Col span={24} style={styles.col}>
            <Link to="/generator/profile/user">
              <Button type="primary" style={styles.button}>
                User Profile
              </Button>
            </Link>
          </Col>
          <Col span={24} style={styles.col}>
            <Link to="/generator/portfolio">
              <Button type="primary" style={styles.button}>
                Portfolio
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
    padding: "20px",
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  col: {
    marginBottom: "10px", // Add space between the buttons
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
  },
};

export default ProfileGenerator;






// import React, { useState } from "react";
// import { Card, Row, Col, Typography, Input, Button, Form, Modal, Divider } from "antd";
// import { EditOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// // Mock data for the energy generator profile
// const initialGeneratorData = {
//   companyName: "Energy Solutions Inc.",
//   generatorModel: "G-2000",
//   location: "New York, USA",
//   address: "456 Energy Rd, New York, NY",
//   capacity: "2000 kW",
//   status: "Active",
// };

// const ProfileGenerator = () => {
//   const [generatorData, setGeneratorData] = useState(initialGeneratorData);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();

//   const handleEditToggle = () => {
//     setIsEditing((prev) => !prev);
//     if (isEditing) {
//       // Reset form fields if canceled
//       form.resetFields();
//     }
//   };

//   const handleSave = (values) => {
//     setGeneratorData(values);
//     setIsEditing(false);
//     setIsModalVisible(false);
//   };

//   const handleEditModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancelModal = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//       <Card
//         style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
//         title="Energy Generator Profile"
//       >
//         <Row gutter={[16, 16]}>
//           <Col span={12}>
//             <Text strong>Company Name:</Text>
//             <p>{generatorData.companyName}</p>
//           </Col>
//           <Col span={12}>
//             <Text strong>Generator Model:</Text>
//             <p>{generatorData.generatorModel}</p>
//           </Col>
//         </Row>

//         <Row gutter={[16, 16]}>
//           <Col span={12}>
//             <Text strong>Location:</Text>
//             <p>{generatorData.location}</p>
//           </Col>
//           <Col span={12}>
//             <Text strong>Capacity:</Text>
//             <p>{generatorData.capacity}</p>
//           </Col>
//         </Row>

//         <Row gutter={[16, 16]}>
//           <Col span={12}>
//             <Text strong>Status:</Text>
//             <p>{generatorData.status}</p>
//           </Col>
//           <Col span={12}>
//             <Text strong>Address:</Text>
//             <p>{generatorData.address}</p>
//           </Col>
//         </Row>

//         <Divider />

//         <Row justify="end">
//           <Button
           
//             onClick={handleEditModal}
//             type="primary"
//             style={{ marginRight: "10px" }}
//           >
//             Edit Profile
//           </Button>
//         </Row>
//       </Card>

//       {/* Modal for editing profile */}
//       <Modal
//         title="Edit Generator Profile"
//         visible={isModalVisible}
//         onCancel={handleCancelModal}
//         footer={[
//           <Button key="cancel" onClick={handleCancelModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={() => form.submit()}
//           >
//             Save Changes
//           </Button>,
//         ]}
//         width={600}
//       >
//         <Form
//           form={form}
//           onFinish={handleSave}
//           initialValues={generatorData}
//         >
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Form.Item
//                 label="Company Name"
//                 name="companyName"
//                 rules={[{ required: true, message: "Please input the company name!" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label="Generator Model"
//                 name="generatorModel"
//                 rules={[{ required: true, message: "Please input the generator model!" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Form.Item
//                 label="Location"
//                 name="location"
//                 rules={[{ required: true, message: "Please input the location!" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label="Capacity"
//                 name="capacity"
//                 rules={[{ required: true, message: "Please input the capacity!" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Form.Item
//                 label="Status"
//                 name="status"
//                 rules={[{ required: true, message: "Please input the status!" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label="Address"
//                 name="address"
//                 rules={[{ required: true, message: "Please input the address!" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ProfileGenerator;
