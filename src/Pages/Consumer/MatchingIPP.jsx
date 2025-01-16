import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spin, Alert, Row, Button, Radio,Modal, Tooltip, } from "antd";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import { QuestionCircleOutlined } from '@ant-design/icons';


const MatchingIPP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState(null); // Track selected row
  const { matchingIPP, status, error } = useSelector(
    (state) => state.matchingIPP
  );
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal

  useEffect(() => {
    const requirementId = location.state?.selectedRequirement?.id;
    if (requirementId) {
      dispatch(fetchMatchingIPPById(requirementId));
    } else {
      console.error("Requirement ID not found in location state.");
    }
  }, [location, dispatch]);

  const handleRowClick = (record) => {
    setSelectedRow(record); // Set selected row when a row is clicked
  };

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const handleRadioChange = (e, record) => {
    if (e.target.checked) {
      setSelectedRow(record); // Set selected row when radio button is checked
    }
  };

  const handleContinue = () => {
    if (selectedRow) {
      const requirementId = location.state?.selectedRequirement?.id;
      navigate("/consumer/annual-saving", { state: { requirementId } });
    }
  };

  const columns = [
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Radio
          onChange={(e) => handleRadioChange(e, record)} // Pass the entire record
          checked={selectedRow?.id === record.id} // Ensure the selection logic matches
        />
      ),
    },
    {
      title: "IPP",
      dataIndex: "user__username",
      key: "user__username",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Available Capacity (MW)",
      dataIndex: "available_capacity",
      key: "available_capacity",
    },
  ];

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading IPP details..." />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Row style={{ width: "100%" }}>
        <h2>Matching IPP Details</h2>
           <Tooltip title="Help">
                <Button
                  shape="circle"
                  icon={<QuestionCircleOutlined />}
                  onClick={showInfoModal}
                  style={{ position: 'absolute', top: 120, right: 30 }}
                />
              </Tooltip>
        <Table
          columns={columns}
          dataSource={Array.isArray(matchingIPP) ? matchingIPP : []}
          rowKey={(record) => record.user || record.id || Math.random()}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record), // Handle row click to set selected row
          })}
          locale={{
            emptyText: "No Matching IPPs found",
          }}
          style={{ marginTop: "5%", width: "60%" }}
        />
      </Row>
      <Row
        style={{
          width: "100%",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        <Button
          type="primary"
          onClick={handleContinue}
          disabled={!selectedRow} // Disable button until a row is selected
          style={{
            pointerEvents: selectedRow ? "auto" : "none",
            opacity: selectedRow ? 1 : 0.5,
            cursor: selectedRow ? "pointer" : "not-allowed",
          }}
        >
          Continue
        </Button>
      </Row>
      <Modal
        title="Welcome"
        open={isInfoModalVisible}
        onOk={handleInfoModalOk}
        onCancel={() => setIsInfoModalVisible(false)} // Add onCancel handler
        okText="Got it"
        footer={[
          <Button key="submit" type="primary" onClick={handleInfoModalOk}>
            Got it
          </Button>,
        ]}
      >
        <p>Hi</p>
       
        <p>Welcome to the EXG. Please follow these steps to proceed:</p>
        <ol>
          <li>Add your requirements by clicking the "Add Requirement +" button.</li>
          <li>Fill in the details shown in the form.</li>
          <li>Use the tooltip option for each field for more information.</li>
          <li>You can add multiple requirements (demands).</li>
          <li>To continue, select a requirement and click the "Continue" button.</li>
        </ol>
        <p>Thank you!</p>
      </Modal>
    </main>
  );
};

export default MatchingIPP;
