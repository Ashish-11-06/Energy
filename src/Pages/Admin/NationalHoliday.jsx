import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, message } from 'antd';
import nationalHolidayApi from '../../Redux/Admin/api/nationalHolidayApi';
import { use } from 'react';

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

const NationalHoliday = () => {
    const [data, setData] = useState([]);
    const [hoveredId, setHoveredId] = useState({ edit: null, delete: null });

    const fetchData = async () => {
        setLoding(true);
        try {
            const response = await nationalHolidayApi.getData();
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
            const res = await nationalHolidayApi.deleteData(record.id);
            if (res.status === 200) {
                message.success('Deleted successfully');
                fetchData();
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Delete failed');
        }
    };

    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
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
                <Title level={4} style={{ margin: 0 }}>National Holidays</Title>
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

export default NationalHoliday;
