import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import nationalHolidayApi from '../../Redux/Admin/api/nationalHolidayApi';
import NationalHolidayEditModal from './Modal/NationalHolidayEditModal';

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
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modalMode, setModalMode] = useState('edit');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
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
        setSelectedRecord(record);
        setModalMode('edit');
        setEditModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedRecord(null);
        setModalMode('add');
        setEditModalVisible(true);
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
        { title: 'Date', dataIndex: 'date', key: 'date', render: (v) => v || 'N/A' },
        { title: 'Name', dataIndex: 'name', key: 'name', render: (v) => v || 'N/A' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => handleEdit(record)}
                        style={{ color: '#669800', cursor: 'pointer' }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>National Holidays</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Data
                </Button>
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
            <NationalHolidayEditModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                record={selectedRecord}
                onUpdate={fetchData}
                mode={modalMode}
            />
        </div>
    );
};

export default NationalHoliday;
