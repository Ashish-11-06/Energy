import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import "../SubscriptionPlan.css";
import proformaInvoice from "../../assets/proforma_invoice.png";
import { useDispatch } from "react-redux";
import {
  createPerformaById,
  fetchPerformaById,
} from "../../Redux/Slices/Consumer/performaInvoiceSlice";

const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [isProformaVisible, setIsProformaVisible] = useState(false); // State for proforma modal
  const [performa, setPerformaResponse] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [form] = Form.useForm(); // Form instance for validation
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  //console.log(userData[0]?.id);
  const userId = userData[0]?.id;

  // const [company, setCompany] = useState(company);
  // company= userData[0]?.company || '';
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsQuotationVisible(true); // Show the quotation view after selection
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    const fetchPerforma = async () => {
      try {
        const response = await dispatch(fetchPerformaById(userId)).unwrap();
        console.log("Fetched Performa:", response);
        setPerformaResponse(response);

        // Set the form values based on the fetched performa data
        setCompanyName(response.company_name);
        setGstinNumber(response.gst_number);
        setCompanyAddress(response.company_address);

        setError(null);
      } catch (err) {
        message.error(err || "Failed to fetch performa.");
      }
    };

    fetchPerforma();
  }, [dispatch, userId]);

  // Handle form submit
  const handleCreatePerforma = async () => {
    const performaData = {
      company_name: companyName,
      company_address: companyAddress,
      gst_number: gstinNumber,
      subscription: 3,
      due_date: "2025-01-25",
    };

    try {
      const response = await dispatch(
        createPerformaById({ id: userId, performaData })
      ).unwrap();
      console.log("Created Performa:", response);
    } catch (error) {
      console.error("Failed to create performa:", error);
    }
  };

  const renderQuotation = () => (
    // <Form form={form} layout="vertical">
    <Form form={form} onFinish={handleCreatePerforma}>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Please enter your company name" },
            ]}
          >
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            style={{ marginLeft: "2%" }}
            label="GSTIN Number"
            name="gstinNumber"
            rules={[
              { required: true, message: "Please enter your GSTIN number" },
            ]}
          >
            <Input
              value={gstinNumber}
              onChange={(e) => setGstinNumber(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Company Address" name="companyAddress">
            <Input.TextArea
              rows={2}
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <p>
        please provide additional details for generating proforma invoice -
        company name, company address, GSTIN no
        <br />
        remove download quotation button
        <br />
        provide additional details
        <br />
        notification triggered to Mail
      </p>
    </Form>

    // </Form>
  );

  const handleGenerateProforma = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        setIsProformaVisible(true); // Show the proforma modal
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };
  const handlePayment = () => {
    navigate("/consumer/energy-consumption-table");
    // form.validateFields().then((values) => {
    //   console.log('Form values:', values);
    //   setIsPaymentVisible(true); // Show the proforma modal
    // }).catch((errorInfo) => {
    //   console.log('Validation failed:', errorInfo);
    // });
  };

  const closeProforma = () => {
    setIsProformaVisible(false);
  };
  const closePayment = () => {
    setIsPaymentVisible(false);
  };

  // Handle payment done and navigate to the new page
  const handlePaymentDone = () => {
    // Navigate to the energy-consumption-table page after payment is done
    navigate("/consumer/energy-consumption-table");
  };

  return (
    <div className="subscription-plans-container">
      <Title level={2} style={{ marginTop: "5%", marginBottom: "5%" }}>
        Choose Your Annual Subscription Plan
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {/* Basic Plan */}

        <Col xs={24} sm={8} md={8}>
        <Card   hoverable 
          // style={{padding:'5px'}}
          className={selectedPlan === "basic" ? "selected-plan" : ""}
          onClick={() => handleSelectPlan("basic")}
          actions={[
            <Button
              type="primary"
              block
              size="small"
              style={{ width: "160px" }}
            >
              Select Plan
            </Button>,
          ]}
        >
        <div style={{backgroundColor:'#669800 ',marginBottom:'0',marginTop:'-25px',marginLeft:'-25px',marginRight:'-25px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}}>
            <p style={{padding:'5px'}}><span style={{marginTop:'10px',color:'white',fontSize:'22px',fontWeight:'bold'}}>EXT Lite Plan</span></p>
            <hr />
          </div>
          <Text className="price">50,000 INR</Text>
            <ul>
              <li>Matching IPP +</li>
              <li>Requirements +</li>
              <li>Transaction window</li>
            </ul>
  
        </Card>
        </Col>


        <Col xs={24} sm={8} md={8}>
        <Card   hoverable 
          // style={{padding:'5px'}}
          className={selectedPlan === "basic" ? "selected-plan" : ""}
          onClick={() => handleSelectPlan("basic")}
          actions={[
            <Button
              type="primary"
              block
              size="small"
              style={{ width: "160px" }}
            >
              Select Plan
            </Button>,
          ]}
        >
        <div style={{backgroundColor:'#669800 ',marginBottom:'0',marginTop:'-25px',marginLeft:'-25px',marginRight:'-25px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}}>
            <p style={{padding:'5px'}}><span style={{marginTop:'10px',color:'white',fontSize:'22px',fontWeight:'bold'}}>EXT Pro Plan</span></p>
            <hr />
          </div>
          <Text className="price">2,00,000 INR</Text>
            <ul>
            <li>Dashboard</li>
              <li>Advisory Support</li>
              <li>PowerX subscription</li>
            </ul>
  
        </Card>
        </Col>


        {/* <Col xs={24} sm={8} md={8}>
          <Card
            title="EXT Pro Plan"
            bordered
            hoverable
            className={selectedPlan === "standard" ? "selected-plan" : ""}
            onClick={() => handleSelectPlan("standard")}
            actions={[
              <Button
                type="primary"
                block
                size="small"
                style={{ width: "160px" }}
              >
                Select Plan
              </Button>,
            ]}
          >
            <Text className="price">2,00,000 INR</Text>
            <ul>
              <li>Dashboard</li>
              <li>Advisory Support</li>
              <li>PowerX subscription</li>
            </ul>
          </Card>
        </Col> */}


<Col xs={24} sm={8} md={8}>
        <Card   hoverable 
          // style={{padding:'5px'}}
          className={selectedPlan === "basic" ? "selected-plan" : ""}
          onClick={() => handleSelectPlan("basic")}
          actions={[
            <Button
              type="primary"
              block
              size="small"
              style={{ width: "160px" }}
            >
              Select Plan
            </Button>,
          ]}
        >
        <div style={{backgroundColor:'#669800 ',marginBottom:'0',marginTop:'-25px',marginLeft:'-25px',marginRight:'-25px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}}>
            <p style={{padding:'5px'}}><span style={{marginTop:'10px',color:'white',fontSize:'22px',fontWeight:'bold'}}>Trial Plan</span></p>
            <hr />
          </div>
          <Text className="price">Free</Text>
            <ul>
            <li>Trial</li>
              <li>Trial</li>
              <li>Trial</li>
            </ul>
  
        </Card>
        </Col>

        {/* <Col xs={24} sm={8} md={8}>
          <Card
            title="Trial Plan"
            bordered
            hoverable
            className={selectedPlan === "basic" ? "selected-plan" : ""}
            // onClick={() => handleSelectPlan('basic')}
            actions={[
              <Button
                type="primary"
                block
                size="small"
                style={{ width: "160px" }}
              >
                Select Plan
              </Button>,
            ]}
          >
            <Text className="price">Free</Text>
            <ul>
              <li>Trial</li>
              <li>Trial</li>
              <li> Trial</li>
            </ul>
          </Card>
        </Col> */}
      </Row>

      {/* Quotation View */}
      {isQuotationVisible && (
        <Modal
          title="Generate proforma invoice"
          open={isQuotationVisible}
          onCancel={closeQuotation}
          footer={[
            <Button key="button" onClick={handleCreatePerforma}>
              Generate Proforma
            </Button>,
          ]}
          width={600}
        >
          {renderQuotation()}
        </Modal>
      )}

      {/* Proforma Modal */}
      <Modal
        title="Proforma Invoice"
        open={isProformaVisible}
        onCancel={closeProforma}
        footer={[
          <Button key="button" onClick={handlePayment}>
            Proceed to Payment
          </Button>,
        ]}
        width={600}
      >
        <p>This is a proforma invoice.</p>
        <img
          src={proformaInvoice}
          alt=""
          style={{ height: "500px", width: "500px", marginLeft: "5%" }}
        />
        <p>Please proceed to payment to complete your subscription.</p>
      </Modal>

      <Modal
        title="Proceed to Payment"
        open={isPaymentVisible}
        onCancel={closePayment}
        footer={[
          <Button key="button" onClick={handlePayment}>
            Pay
          </Button>,
        ]}
        width={600}
      >
        This is dummy Payment
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;
