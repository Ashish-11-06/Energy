import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Input, DatePicker, Modal, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import assignPlanApi from '../../../Redux/Admin/api/assignPlanApi';


const { Option } = Select;

const AssignPlanUserModal = ({ visible, onCancel, record = null, mode = 'add', onUpdate, recordList = [] }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if ((mode === 'edit' && record) || (mode === 'add' && record)) {
      let userCategory = "Consumer";
      if (record?.fromGeneratorPage || (!record?.company_representative && record?.company)) {
        userCategory = "Generator";
      }
      form.setFieldsValue({
        ...record,
        userCategory,
        name: record?.company_representative || record?.name || "",
        companyName: record?.company || record?.companyName || "",
        startDate: record?.startDate ? dayjs(record.startDate) : undefined,
        endDate: record?.endDate ? dayjs(record.endDate) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [record, mode, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Prevent duplicate assignment
      const isDuplicate = recordList?.some(
        (item) =>
          item.userCategory === values.userCategory &&
          item.name === values.name &&
          item.companyName === values.companyName &&
          item.subscriptionPlan === values.subscriptionPlan
      );

      if (isDuplicate && mode === 'add') {
        // message.warning('This plan for the user is already present');

        return;
      }

      setConfirmLoading(true);

      // Build payload for API
      const payload = {
        user_id: record?.id || 10, // 👈 Ideally this should come from your record
        subscription_id:
          values.subscriptionPlan === "Free"
            ? 1
            : values.subscriptionPlan === "Lite"
            ? 2
            : 3,
      };

      console.log("Submitting payload:", payload);

      // Call API
      await assignPlanApi.assignPlan(payload);
      console.log();
      

      message.success(mode === 'edit' ? 'Updated successfully' : 'Added successfully');
      onUpdate?.();
      onCancel();
    } catch (error) {
      console.error("Assign plan error:", error);
      message.error(error?.message || "Operation failed");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="Assign Subscription Plan"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={mode === 'edit' ? 'Update' : 'Add'}
      confirmLoading={confirmLoading}
      width={1000}
    >
      <Card style={{ marginTop: 20 }} title={mode === 'edit' ? 'Edit Plan Details' : 'Add Plan Details'}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userCategory"
                label="User Category"
                rules={[{ required: true, message: 'User category is required' }]}
              >
                <Select placeholder="Select category" disabled>
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
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Company name is required' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subscriptionPlan"
                label="Subscription Plan"
                rules={[{ required: true, message: 'Subscription plan is required' }]}
              >
                <Select placeholder="Select plan">
                  <Option value="Free">FREE</Option>
                  <Option value="Lite">LITE</Option>
                  <Option value="Pro">PRO</Option>
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
              <Form.Item name="endDate" label="End Date">
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
