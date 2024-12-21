import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const NewPage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <Title level={2} style={{ color: "#669800" }}>New Page</Title>
      <Paragraph>
       please wait while making your plan...
      </Paragraph>
    </div>
  );
};

export default NewPage;
