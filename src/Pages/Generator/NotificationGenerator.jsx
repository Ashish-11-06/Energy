import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Input } from "antd";
import ippData from "../../Data/IPPData.js";
import throttleByAnimationFrame from "antd/es/_util/throttleByAnimationFrame.js";

const { Title, Text } = Typography;

const NotificationGenerator = () => {
  const [tariffValues, setTariffValues] = useState(
    ippData.reduce((acc, item) => {
      acc[item.key] = item.perUnitCost;
      return acc;
    }, {})
  );

  const handleValueChange = (key, newTariff) => {
    setTariffValues((prevValues) => ({
      ...prevValues,
      [key]: newTariff,
    }));
    console.log(`Updated Tariff for IPP ${key}:`, newTariff);
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fb" }}>
      <Title level={2} style={{ textAlign: "center", color: "#4B4B4B" }}>
        IPP Details
      </Title>
      <Text
        style={{
          display: "block",
          textAlign: "center",
          fontSize: "16px",
          color: "#777",
        }}
      >
        This is the notification page visible only from 10 PM to 11 PM IST.
      </Text>
      <p
        style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "600",
          color: "#4B4B4B",
        }}
      >
        These are the IPP details:
      </p>
      <Button
                    type="primary"
                    style={{
                      backgroundColor: "#1890ff",
                      borderColor: "#1890ff",
                      marginBottom:'2%',
                      marginLeft:'80%'
                    }}
                    onClick={() =>
                      prompt('Enter tarrif value::')
                      
                    }
                  >
                    Negotiate Tariff
                  </Button>
      <Row gutter={[16, 16]} justify="center">
        {ippData.map((item) => (
          <Col span={24} key={item.key}>
            <Card
              title={
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  IPP {item.ipp}
                </span>
              }
              bordered={true}
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                }}
              >
                {/* First Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <p style={{ marginRight: "20px", flex: "1" }}>
                    <strong>Tariff:</strong> {tariffValues[item.key]}
                  </p>
                  {/* <Input
                    type="number"
                    value={tariffValues[item.key]}
                    onChange={(e) =>
                      handleValueChange(item.key, e.target.value)
                    }
                    style={{ width: "100px", marginRight: "10px" }}
                  /> */}
               
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NotificationGenerator;

//after clicking on Negotiate Tariff button that  that input field should display otherwise it should be hidden









