import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const RooftopConsumerModal = ({ visible, onClose, consumer }) => {
  const [solarArray, setSolarArray] = useState([]);
  const [windArray, setWindArray] = useState([]);
  const [essArray, setEssArray] = useState([]);

  useEffect(() => {
    if (consumer) {
      setSolarArray(consumer.solar || []);
      setWindArray(consumer.wind || []);
      setEssArray(consumer.ess || []);
    }
  }, [consumer]);

  return (
    <Modal
      title="IPP Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Table
        dataSource={[
          ...solarArray.map((item) => ({
            ...item,
            technology: "Solar",
            banking_available: item.banking_available,
          })),
          ...windArray.map((item) => ({
            ...item,
            technology: "Wind",
            banking_available: item.banking_available ?? false,
          })),
          ...essArray.map((item) => ({
            ...item,
            technology: "ESS",
            banking_available: item.banking_available ?? false,
          })),
        ]}
        columns={[
          { title: "Technology", dataIndex: "technology", key: "technology" },
          { title: "State", dataIndex: "state", key: "state" },
          { title: "Connectivity", dataIndex: "connectivity", key: "connectivity" },
          {
            title: "Available Capacity (MW)",
            dataIndex: "available_capacity",
            key: "available_capacity",
          },
          {
            title: "Total Installed Capacity (MW)",
            dataIndex: "total_install_capacity",
            key: "total_install_capacity",
          },
          {
            title: "Banking Available",
            dataIndex: "banking_available",
            key: "banking_available",
            width: 300,
            align: "center",
            render: (value) => (
              <div style={{ textAlign: "center" }}>
                {value === false ? (
                  <CloseCircleTwoTone twoToneColor="#FF0000" />
                ) : (
                  <CheckCircleTwoTone twoToneColor="#669800" />
                )}
              </div>
            ),
          },
        ]}
        rowKey={(record, index) => index}
        pagination={false}
        locale={{ emptyText: "No Data Available" }}
      />

      <br />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default RooftopConsumerModal;
