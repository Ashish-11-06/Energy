import React from "react";
import { Modal, Typography, Row, Col, Button, Table, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const SummaryOfferModal = ({ visible, onCancel, offerDetails }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'srNo',
      key: 'srNo',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Offered Capacity (MW)',
      dataIndex: 'offeredCapacity',
      key: 'offeredCapacity',
    },
  ];

  const data = [
    {
      key: '1',
      srNo: '1',
      type: 'Solar',
      offeredCapacity: offerDetails.solarCapacity,
    },
    {
      key: '2',
      srNo: '2',
      type: 'Wind',
      offeredCapacity: offerDetails.windCapacity,
    },
    {
      key: '3',
      srNo: '3',
      type: 'ESS',
      offeredCapacity: offerDetails.essCapacity,
    },
  ];

  const handleSendToConsumer = () => {
    message.success("Offer successfully sent to consumer.");
    onCancel();
    navigate('/generator/matching-consumer');
  };

  return (
    <Modal
      title={<Title level={4} style={{ color: "#001529" }}>Summary Offer</Title>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
        style={{ marginBottom: "20px" }}
      />

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Paragraph>
            <strong>Offer Tariff (INR/kWh):</strong> {offerDetails.offerTariff}
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph>
            <strong>Term of PPA (years):</strong> {offerDetails.ppaTerm}
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph>
            <strong>Lock-in Period (years):</strong> {offerDetails.lockInPeriod}
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph>
            <strong>Commencement of Supply:</strong> {offerDetails.commencementOfSupply}
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph>
            <strong>Contracted Energy (million units):</strong> {offerDetails.contractedEnergy}
          </Paragraph>
        </Col>
      </Row>

      <Row justify="end" style={{ marginTop: "20px" }}>
        <Button style={{ marginRight: "10px" }} onClick={onCancel}>
          Revised Offer
        </Button>
        <Button type="primary" onClick={handleSendToConsumer}>
          Send to Consumer
        </Button>
      </Row>
    </Modal>
  );
};

export default SummaryOfferModal;
