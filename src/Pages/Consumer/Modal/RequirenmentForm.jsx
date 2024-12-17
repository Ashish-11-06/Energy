import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import states from '../../../Data/States';
import industries from '../../../Data/Industry';

const RequirenmentForm = ({ isVisible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form Values: ', values);
    if (onSubmit) {
      onSubmit(values);
    }
    form.resetFields();
  };

  const renderLabelWithTooltip = (label, tooltip) => (
    <span>
      {label}{' '}
      <Tooltip title={tooltip}>
        <InfoCircleOutlined style={{ color: '#999', marginLeft: 4 }} />
      </Tooltip>
    </span>
  );

  return (
    <Modal
      title="Fill in the details"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                'State',
                'State where the company is located or operates.'
              )}
              name="state"
              rules={[{ required: true, message: 'Please select your state!' }]}
            >
              <Select
                showSearch
                placeholder="Select your state"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {states.map((state, index) => (
                  <Select.Option key={index} value={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                'Industry',
                'Industry your company is involved in (e.g., IT, Manufacturing).'
              )}
              name="industry"
              rules={[{ required: true, message: 'Please select your industry!' }]}
            >
              <Select
                placeholder="Select your industry"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {industries.map((industry, index) => (
                  <Select.Option key={index} value={industry}>
                    {industry}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={renderLabelWithTooltip(
                'Contracted Demand (in kWh)',
                'The contracted demand is the amount of electricity in kWh that the company has committed to using.'
              )}
              name="contractedDemand"
              rules={[{ required: true, message: 'Please enter the contracted demand!' }]}
            >
              <Input type="number" placeholder="Enter contracted demand in kWh" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                'Tariff Category',
                'Select the tariff category applicable to your company (e.g., HT Commercial, LT Industrial).'
              )}
              name="tariffCategory"
              rules={[{ required: true, message: 'Please select a tariff category!' }]}
            >
              <Select placeholder="Select tariff category">
                <Select.Option value="HT Commercial">HT Commercial</Select.Option>
                <Select.Option value="HT Industrial">HT Industrial</Select.Option>
                <Select.Option value="LT Commercial">LT Commercial</Select.Option>
                <Select.Option value="LT Industrial">LT Industrial</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                'Voltage Level',
                'Select the voltage level of the electricity being supplied to your company.'
              )}
              name="voltageLevel"
              rules={[{ required: true, message: 'Please select the voltage level!' }]}
            >
              <Select placeholder="Select voltage level">
                <Select.Option value="11kv">11 kV</Select.Option>
                <Select.Option value="33kv">33 kV</Select.Option>
                <Select.Option value="66kv">66 kV</Select.Option>
                <Select.Option value="110kv">110 kV</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={renderLabelWithTooltip(
                'Procurement Date',
                'Select the date when the procurement of services or goods occurred (expected Date).'
              )}
              name="procurement"
              rules={[{ required: true, message: 'Please select a procurement date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ padding: '10px 20px' }}>
            Continue
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequirenmentForm;
