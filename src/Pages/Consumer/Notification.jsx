// Notification.js
import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import ippData from '../../Data/IPPData.js';

const { Title, Text } = Typography;

const Notification = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f5f6fb' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#4B4B4B' }}>
        IPP Details
      </Title>
      <Text style={{ display: 'block', textAlign: 'center', fontSize: '16px', color: '#777' }}>
        This is the notification page visible only from 10 PM to 11 PM IST.
      </Text>
      <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600', color: '#4B4B4B' }}>
        These are the IPP details:
      </p>

      <Row gutter={[16, 16]} justify="center">
        {ippData.map((item) => (
          <Col span={8} key={item.key}>
            <Card
              title={<span style={{ fontSize: '18px', fontWeight: '500' }}>IPP {item.ipp}</span>}
              bordered={true}
              style={{
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>
                <p><strong>State:</strong> {item.states}</p>
                <p><strong>Capacity:</strong> {item.capacity}</p>
                <p><strong>Replacement:</strong> {item.replacement}</p>
                <p><strong>Per Unit Cost:</strong> ₹{item.perUnitCost}</p>
              </div>

              {/* Request Button */}
              <Button
                type="primary"
                block
                style={{
                  marginTop: '10px',
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                }}
              >
                Request
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Notification;
