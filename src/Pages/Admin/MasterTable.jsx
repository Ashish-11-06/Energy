import React, { useState } from 'react';
import { Table, Button, Space, Typography, Card } from 'antd';

const { Title } = Typography;

const MasterTable = () => {
    const [data, setData] = useState([
        {
            id: 1,
            state: 'Maharashtra',
            ISTS_charges: 0.31,
            state_charges: 1.2,
            banking_charges: 8.0,
            rooftop_price: 1.0,
            max_capacity: 1.0,
            transmission_charge: 126819.0,
            transmission_loss: 3.84,
            wheeling_charges: 0.2053,
            wheeling_losses: 7.25,
            combined_average_replacement_PLF: 43.0,
        },
    ]);

    const handleEdit = (record) => {
        console.log('Edit', record);
        // Open modal or form here
    };

    const handleDelete = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    const columns = [
        { title: 'State', dataIndex: 'state', key: 'state' },
        { title: 'ISTS Charges', dataIndex: 'ISTS_charges', key: 'ISTS_charges' },
        { title: 'State Charges', dataIndex: 'state_charges', key: 'state_charges' },
        { title: 'Banking Charges', dataIndex: 'banking_charges', key: 'banking_charges' },
        { title: 'Rooftop Price', dataIndex: 'rooftop_price', key: 'rooftop_price' },
        { title: 'Max Capacity', dataIndex: 'max_capacity', key: 'max_capacity' },
        { title: 'Transmission Charge', dataIndex: 'transmission_charge', key: 'transmission_charge' },
        { title: 'Transmission Loss (%)', dataIndex: 'transmission_loss', key: 'transmission_loss' },
        { title: 'Wheeling Charges', dataIndex: 'wheeling_charges', key: 'wheeling_charges' },
        { title: 'Wheeling Losses (%)', dataIndex: 'wheeling_losses', key: 'wheeling_losses' },
        { title: 'Avg Replacement PLF (%)', dataIndex: 'combined_average_replacement_PLF', key: 'combined_average_replacement_PLF' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button danger type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>State-wise Transmission Details</Title>
                <Button type="primary" onClick={() => console.log('Open Add Modal')}>Add Data</Button>
            </div>
            <Card>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    );
};

export default MasterTable;
