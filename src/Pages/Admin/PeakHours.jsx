import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Card, message } from 'antd';
import peakHoursApi from '../../Redux/Admin/api/peakHoursApi';

const { Title } = Typography;

const buttonStyle = {
    background: '#d4f7d4',
    border: '1px solid #d9d9d9',
    color: '#333',
    transition: 'background 0.3s'
};
const buttonHoverStyle = {
    background: '#fff'
};

const PeakHours = () => {
    const [data, setData] = useState([]);
    const [hoveredId, setHoveredId] = useState({ edit: null, delete: null });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await peakHoursApi.getData();
            if (response.status === 200) {
                setData(response.data);
            } else {
                message.error('Failed to fetch data');
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (record) => {
        console.log('Edit', record);
        // Open modal or form here
    };

    const handleDelete = async (record) => {
        try {
            const res = await peakHoursApi.deleteData(record.id);
            if (res.status === 200) {
                message.success('Deleted successfully');
                fetchData();
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Delete failed');
        }
    };

    const columns = [
        { title: 'State', dataIndex: 'state', key: 'state' },
        { title: 'Peak Hours', dataIndex: 'peak_hours', key: 'peak_hours' },
        { title: 'Off Peak Hours', dataIndex: 'off_peak_hours', key: 'off_peak_hours' },
        { title: 'Peak Start 1', dataIndex: 'peak_start_1', key: 'peak_start_1' },
        { title: 'Peak End 1', dataIndex: 'peak_end_1', key: 'peak_end_1' },
        { title: 'Peak Start 2', dataIndex: 'peak_start_2', key: 'peak_start_2' },
        { title: 'Peak End 2', dataIndex: 'peak_end_2', key: 'peak_end_2' },
        { title: 'Off Peak Start', dataIndex: 'off_peak_start', key: 'off_peak_start' },
        { title: 'Off Peak End', dataIndex: 'off_peak_end', key: 'off_peak_end' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        style={hoveredId.edit === record.id ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                        onMouseEnter={() => setHoveredId(h => ({ ...h, edit: record.id }))}
                        onMouseLeave={() => setHoveredId(h => ({ ...h, edit: null }))}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        style={hoveredId.delete === record.id ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                        onMouseEnter={() => setHoveredId(h => ({ ...h, delete: record.id }))}
                        onMouseLeave={() => setHoveredId(h => ({ ...h, delete: null }))}
                        onClick={() => handleDelete(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>State-wise Peak/Off-Peak Hours</Title>
                <Button type="primary" onClick={() => console.log('Open Add Modal')}>Add Data</Button>
            </div>
            <Card>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    bordered
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default PeakHours;
