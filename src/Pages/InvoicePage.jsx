import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Spin } from 'antd';
import './InvoicePage.css';
import { fetchPerformaById } from '../Redux/Slices/Consumer/performaInvoiceSlice';
import { useDispatch } from "react-redux";
import ProformaInvoiceModal from './Consumer/Modal/ProformaInvoiceModal';
import moment from 'moment';

const InvoicePage = () => {
  const [invoice, setInvoice] = useState([]);
  const [isProformaVisible, setIsProformaVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState();
  const [subscription_type, setSubscriptionType] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")).user;
  const userId = user.id;

  const viewInvoice = (record) => {
    // Implement the logic to view the invoice details
    setIsProformaVisible(true);
    // console.log(`Viewing invoice ${record}`);
    setSelectedPlan(record);
    setSubscriptionType(record.subscription.subscripton_type)

  };
  const closeProforma = () => {
    setIsProformaVisible(false);
  };

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Company Address',
      dataIndex: 'company_address',
      key: 'company_address',
    },

    {
      title: 'Issue Date',
      dataIndex: 'issue_date',
      key: 'issue_date',
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'status',
      // render: status => (
      //   <Tag color={status === 'Paid' ? 'green' : 'volcano'}>
      //     {status.toUpperCase()}
      //   </Tag>
      // ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" onClick={() => viewInvoice(record)}>
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchPerforma = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchPerformaById(userId)).unwrap();
        setInvoice(response);
        console.log(response);


        setLoading(false);

      } catch (err) {
        console.log(err);
        message.error(err.message || "Failed to fetch performa.");
      }
    };

    fetchPerforma();
  }, [dispatch, userId]);
  // console.log(selectedPlan);

  console.log(invoice);


  return (
    <>
      <div className="invoice-page">
        <h1>Invoices</h1>
        {loading ? (
          <Spin spinning={loading} tip="Loading..." />
        ) : (
          <Table
            style={{ marginTop: 16, padding: "20px" }}
            // dataSource={Array.isArray(invoice) ? invoice : []} // Ensuring it's an array
            dataSource={invoice} // Ensuring it's an array
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        )}


      </div>

      <ProformaInvoiceModal
        title="Proforma Invoice"
        open={isProformaVisible}
        onCancel={closeProforma}
        selectedPlan={selectedPlan}
        subscripton_type={subscription_type}
        selectedPlanId={selectedPlan?.id}
        fromSubscription={false}
      />
    </>

  );
};

export default InvoicePage;
