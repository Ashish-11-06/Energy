import React from "react";
import { Table, Button, Card, Typography } from "antd";

const { Title } = Typography;

const OnsiteREOffers = () => {
  const dataSource = [
    { key: "1", contractedDemand: "500 kW", roofArea: "2000 sq.ft", demandId: "DEM001" },
    { key: "2", contractedDemand: "750 kW", roofArea: "3500 sq.ft", demandId: "DEM002" },
    { key: "3", contractedDemand: "1000 kW", roofArea: "5000 sq.ft", demandId: "DEM003" },
  ];

  const columns = [
    { title: "Contracted Demand", dataIndex: "contractedDemand", key: "contractedDemand" },
    { title: "Roof Area", dataIndex: "roofArea", key: "roofArea" },
    { title: "Demand ID", dataIndex: "demandId", key: "demandId" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => console.log("Clicked:", record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ margin: 20 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Onsite RE Offers
      </Title>
        <Table
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)", borderRadius: 8 }}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
        />
     
    </div>
  );
};

export default OnsiteREOffers;
