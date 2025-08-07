// import React, { useState, useEffect } from 'react';
// import { Table, Tag, Button, Modal, Descriptions, Upload, message, Input, Select, Card } from 'antd';
// import { EyeOutlined, CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
// // import creditRatingApi from '../../Redux/Admin/api/creditRatingApi';

// const { TextArea } = Input;
// const { Option } = Select;

// const CreditRatingVerification = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [currentRecord, setCurrentRecord] = useState(null);
//   const [remarks, setRemarks] = useState('');
//   const [action, setAction] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await creditRatingApi.getCreditRatings();
//       if (response.status === 200) {
//         setData(response.data);
//       } else {
//         message.error('Failed to fetch data');
//       }
//     } catch (error) {
//       message.error(error?.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleVerify = async () => {
//     if (!currentRecord || !action) return;

//     setLoading(true);
//     try {
//       const payload = {
//         id: currentRecord.id,
//         status: action,
//         remarks: remarks
//       };

//       const response = await creditRatingApi.updateCreditRating(payload);
//       if (response.status === 200) {
//         message.success(`Credit rating ${action.toLowerCase()} successfully`);
//         fetchData();
//         setIsModalVisible(false);
//       } else {
//         message.error('Failed to update status');
//       }
//     } catch (error) {
//       message.error(error?.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredData = data.filter(item => {
//     if (statusFilter === 'all') return true;
//     return item.status === statusFilter;
//   });

//   const columns = [
//     {
//       title: 'User',
//       dataIndex: 'userName',
//       key: 'userName',
//       render: (text, record) => (
//         <div>
//           <div>{record.userName}</div>
//           <div style={{ color: '#888', fontSize: 12 }}>{record.userEmail}</div>
//         </div>
//       ),
//     },
//     {
//       title: 'Credit Rating',
//       dataIndex: 'ratingValue',
//       key: 'ratingValue',
//       render: (value) => <span style={{ fontWeight: 'bold' }}>{value}</span>,
//     },
//     {
//       title: 'Documents',
//       dataIndex: 'documents',
//       key: 'documents',
//       render: (documents) => (
//         <div>
//           {documents?.map((doc, index) => (
//             <div key={index}>
//               <a href={doc.url} target="_blank" rel="noopener noreferrer">
//                 Document {index + 1}
//               </a>
//             </div>
//           ))}
//         </div>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => {
//         let color = '';
//         let icon = null;
        
//         if (status === 'approved') {
//           color = 'green';
//           icon = <CheckOutlined />;
//         } else if (status === 'rejected') {
//           color = 'red';
//           icon = <CloseOutlined />;
//         } else {
//           color = 'orange';
//         }
        
//         return (
//           <Tag color={color} icon={icon}>
//             {status.toUpperCase()}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Button
//           icon={<EyeOutlined />}
//           onClick={() => {
//             setCurrentRecord(record);
//             setIsModalVisible(true);
//           }}
//         >
//           Review
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: '16px' }}>
//       <h2>Credit Rating Verification</h2>
      
//       <Card>
//         <div style={{ marginBottom: 16 }}>
//           <Select
//             defaultValue="all"
//             style={{ width: 200 }}
//             onChange={(value) => setStatusFilter(value)}
//           >
//             <Option value="all">All Statuses</Option>
//             <Option value="pending">Pending</Option>
//             <Option value="approved">Approved</Option>
//             <Option value="rejected">Rejected</Option>
//           </Select>
//         </div>
        
//         <Table
//           columns={columns}
//           dataSource={filteredData}
//           loading={loading}
//           rowKey="id"
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>

//       <Modal
//         title={`Credit Rating Verification - ${currentRecord?.userName || 'User'}`}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         width={800}
//         footer={[
//           <Button key="cancel" onClick={() => setIsModalVisible(false)}>
//             Cancel
//           </Button>,
//           <Button
//             key="reject"
//             danger
//             icon={<CloseOutlined />}
//             loading={loading}
//             onClick={() => {
//               setAction('rejected');
//               handleVerify();
//             }}
//           >
//             Reject
//           </Button>,
//           <Button
//             key="approve"
//             type="primary"
//             icon={<CheckOutlined />}
//             loading={loading}
//             onClick={() => {
//               setAction('approved');
//               handleVerify();
//             }}
//           >
//             Approve
//           </Button>,
//         ]}
//       >
//         {currentRecord && (
//           <div>
//             <Descriptions bordered column={1}>
//               <Descriptions.Item label="User Information">
//                 <div>
//                   <div><strong>Name:</strong> {currentRecord.userName}</div>
//                   <div><strong>Email:</strong> {currentRecord.userEmail}</div>
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Credit Rating">
//                 <div style={{ fontSize: 24, fontWeight: 'bold' }}>
//                   {currentRecord.ratingValue}
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Status">
//                 <Tag color={
//                   currentRecord.status === 'approved' ? 'green' :
//                   currentRecord.status === 'rejected' ? 'red' : 'orange'
//                 }>
//                   {currentRecord.status.toUpperCase()}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="Supporting Documents">
//                 <div style={{ marginTop: 8 }}>
//                   {currentRecord.documents?.map((doc, index) => (
//                     <div key={index} style={{ marginBottom: 8 }}>
//                       <a href={doc.url} target="_blank" rel="noopener noreferrer">
//                         <Button icon={<UploadOutlined />}>
//                           View Document {index + 1}
//                         </Button>
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Admin Remarks">
//                 <TextArea
//                   rows={4}
//                   placeholder="Enter remarks (required for rejection)"
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                 />
//               </Descriptions.Item>
//             </Descriptions>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default CreditRatingVerification;


import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, message, Input, Select, Card, Tooltip } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

// Dummy data for credit rating verification requests
const dummyData = [
  {
    id: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    ratingValue: 750,
    documents: [
      { url: 'https://example.com/doc1.pdf', name: 'Bank Statement.pdf' }
    ],
    status: 'pending',
    submittedDate: '2023-05-15'
  },
  {
    id: '2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    ratingValue: 680,
    documents: [
      { url: 'https://example.com/doc3.pdf', name: 'Income Proof.pdf' }
    ],
    status: 'approved',
    approvedDate: '2023-05-10',
    approvedBy: 'Admin User'
  },
  {
    id: '3',
    userName: 'Robert Johnson',
    userEmail: 'robert.j@example.com',
    ratingValue: 820,
    documents: [
      { url: 'https://example.com/doc4.pdf', name: 'Tax Returns.pdf' },
    ],
    status: 'rejected',
    rejectedDate: '2023-05-08',
    rejectedBy: 'Admin User',
    remarks: 'Incomplete documentation provided'
  }
];

const CreditRatingVerification = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [action, setAction] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Simulate API fetch with dummy data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(dummyData);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async () => {
    if (!currentRecord || !action) return;

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the dummy data
      const updatedData = data.map(item => {
        if (item.id === currentRecord.id) {
          const updatedItem = { 
            ...item, 
            status: action,
            ...(action === 'approved' ? {
              approvedDate: new Date().toISOString().split('T')[0],
              approvedBy: 'Current Admin'
            } : {
              rejectedDate: new Date().toISOString().split('T')[0],
              rejectedBy: 'Current Admin',
              remarks: remarks
            })
          };
          setCurrentRecord(updatedItem); // Update current record in modal
          return updatedItem;
        }
        return item;
      });

      setData(updatedData);
      message.success(`Credit rating ${action} successfully`);
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <div>
          <div>{record.userName}</div>
          <div style={{ color: '#888', fontSize: 12 }}>{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: 'Credit Rating',
      dataIndex: 'ratingValue',
      key: 'ratingValue',
      render: (value) => <span style={{ fontWeight: 'bold' }}>{value}</span>,
    },
    {
  title: 'Documents',
  dataIndex: 'documents',
  key: 'documents',
  render: (documents) => (
    <div>
      {documents?.map((doc, index) => (
        <div key={index} style={{ marginBottom: 4 }}>
          <a 
            style={{ 
              color: '#669800',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
            onClick={() => message.info(`Would normally open: ${doc.name}`)}
          >
            <UploadOutlined />
            {doc.name}
          </a>
        </div>
      ))}
    </div>
  ),
},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let icon = null;
        
        if (status === 'approved') {
          color = 'green';
          icon = <CheckOutlined />;
        } else if (status === 'rejected') {
          color = 'red';
          icon = <CloseOutlined />;
        } else {
          color = 'orange';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
   {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
        <Tooltip title="View details">
        <EyeOutlined
            style={{
            fontSize: '16px',
            color: '#3b3b3bff',
            cursor: 'pointer',
            }}
            onClick={() => {
            setCurrentRecord(record);
            setRemarks(record.remarks || '');
            setIsModalVisible(true);
            }}
        />
        </Tooltip>
    ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h2>Credit Rating Verification</h2>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={`Credit Rating Verification - ${currentRecord?.userName || 'User'}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseOutlined />}
            loading={loading}
            onClick={() => {
              if (!remarks && action === 'rejected') {
                message.warning('Please provide remarks for rejection');
                return;
              }
              setAction('rejected');
              handleVerify();
            }}
            disabled={currentRecord?.status !== 'pending'}
          >
            Reject
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckOutlined />}
            loading={loading}
            onClick={() => {
              setAction('approved');
              handleVerify();
            }}
            disabled={currentRecord?.status !== 'pending'}
          >
            Approve
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="User Information">
                <div>
                  <div><strong>Name:</strong> {currentRecord.userName}</div>
                  <div><strong>Email:</strong> {currentRecord.userEmail}</div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Credit Rating">
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {currentRecord.ratingValue}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  currentRecord.status === 'approved' ? 'green' :
                  currentRecord.status === 'rejected' ? 'red' : 'orange'
                }>
                  {currentRecord.status.toUpperCase()}
                </Tag>
                {currentRecord.status !== 'pending' && (
                  <div style={{ marginTop: 8 }}>
                    <div>
                      <strong>
                        {currentRecord.status === 'approved' ? 'Approved' : 'Rejected'} by:
                      </strong> {currentRecord.approvedBy || currentRecord.rejectedBy}
                    </div>
                    <div>
                      <strong>Date:</strong> {currentRecord.approvedDate || currentRecord.rejectedDate}
                    </div>
                  </div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Supporting Documents">
                <div style={{ marginTop: 8 }}>
                  {currentRecord.documents?.map((doc, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <Button 
                        icon={<UploadOutlined />}
                        onClick={() => message.info(`Would normally open: ${doc.name}`)}
                      >
                        {doc.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
              {currentRecord.status === 'rejected' && currentRecord.remarks && (
                <Descriptions.Item label="Rejection Reason">
                  <div style={{ padding: 8, background: '#fff2f0', borderRadius: 4 }}>
                    {currentRecord.remarks}
                  </div>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Admin Remarks">
                <TextArea
                  rows={4}
                  placeholder={
                    currentRecord.status === 'pending' 
                      ? 'Enter remarks (required for rejection)' 
                      : 'Add additional remarks'
                  }
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={currentRecord.status !== 'pending'}
                />
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreditRatingVerification;