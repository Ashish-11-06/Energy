import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Input, DatePicker, Modal, Row, Select, Table, message } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const AssignPlanUserModal = ({ visible, onCancel, record = null, mode = 'add', onUpdate }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && record) {
      form.setFieldsValue({
        ...record,
        startDate: dayjs(record.startDate),
        endDate: dayjs(record.endDate),
      });
    } else {
      form.resetFields();
    }
  }, [record, mode, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };

      console.log('Form Submitted:', payload);

      // Simulate API success
      message.success(mode === 'edit' ? 'Updated successfully' : 'Added successfully');
      onUpdate?.();
      onCancel();
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    { title: 'User Category', dataIndex: 'userCategory', key: 'userCategory' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Subscription Plan', dataIndex: 'subscriptionPlan', key: 'subscriptionPlan' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
  ];

//   const data = [
//     {
//       key: '1',
//       userCategory: 'Consumer',
//       name: 'John Doe',
//       companyName: 'Acme Corp',
//       subscriptionPlan: 'Gold',
//       startDate: '2025-08-01',
//       endDate: '2026-08-01',
//     },
//     {
//       key: '2',
//       userCategory: 'Generator',
//       name: 'Jane Smith',
//       companyName: 'Freelancer',
//       subscriptionPlan: 'Silver',
//       startDate: '2025-07-15',
//       endDate: '2026-07-15',
//     },
//   ];

  return (
    <Modal
      title="Assign Subscription Plan"
      open={visible}
      onCancel={() => {
        setSelectedPlan(null);
        onCancel();
      }}
      onOk={handleSubmit}
      okText={mode === 'edit' ? 'Update' : 'Add'}
      confirmLoading={confirmLoading}
      width={1000}
    >
      {/* <Card>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card> */}

      <Card style={{ marginTop: 20 }} title={mode === 'edit' ? 'Edit Plan Details' : 'Add Plan Details'}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userCategory"
                label="User Category"
                rules={[{ required: true, message: 'User category is required' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Consumer">Consumer</Option>
                  <Option value="Generator">Generator</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Company name is required' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="subscriptionPlan"
                label="Subscription Plan"
                rules={[{ required: true, message: 'Subscription plan is required' }]}
              >
                <Select placeholder="Select plan">
                  <Option value="Lite">LITE</Option>
                  <Option value="Pro">PRO</Option>
                  <Option value="Free">FREE</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Start date is required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                // rules={[{ required: true, message: 'End date is required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default AssignPlanUserModal;
