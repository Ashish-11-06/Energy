import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, DatePicker, Row, Col, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import { addProject } from '../../../Redux/Slices/Generator/portfolioSlice'; // Import addProject action
import states from '../../../Data/States';

const AddPortfolioModal = ({ visible, onClose }) => {
  const [form] = Form.useForm(); // Ant Design form instance
  const [unit, setUnit] = useState('MW'); // State to manage the unit dynamically
  const dispatch = useDispatch(); // Get the dispatch function
  const { status, error } = useSelector((state) => state.portfolio); // Select status and error from the Redux store
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    if (status === 'failed' && error) {
      // console.log('Error:', error); // Log the error
      message.error(error); // Show error message if the status is failed
    }
  }, [status, error]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true); // Set loading state to true during the request
      dispatch(addProject(values)) // Dispatch addProject action
        .unwrap() // Use unwrap to get result or catch error
        .then(() => {
          setLoading(false); // Reset loading state after successful action
          form.resetFields(); // Reset the form after submission
          onClose(); // Close the modal
          message.success('Project added successfully!'); // Show success message
        })
        .catch((err) => {
          setLoading(false); // Reset loading state after failure
          message.error(err.message || 'Failed to add project. Please try again.'); // Show specific error message
        });
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // Disable past dates and today
  const disablePastDates = (current) => {
    return current && current < dayjs().endOf('day');
  };

  // Handle technology type change
  const handleTechnologyChange = (value) => {
    if (value === 'ess') {
      setUnit('MWh');
    } else {
      setUnit('MW');
    }
  };

  return (
    <Modal
      title="Add New Project Entry"
      open={visible} // Controlled by the parent component
      onCancel={onClose} // Close the modal when canceling
      footer={null} // Remove default footer
    >
      <Form form={form} layout="vertical" name="addPortfolioForm">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Technology"
              name="energy_type"
              rules={[{ required: true, message: 'Please select type!' }]} >
              <Select placeholder="Select Type" onChange={handleTechnologyChange}>
                <Select.Option value="solar">Solar</Select.Option>
                <Select.Option value="wind">Wind</Select.Option>
                <Select.Option value="ess">ESS (Energy Storage System)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: 'Please select state!' }]} >
              <Select placeholder="Select State">
                {states.map((state) => (
                  <Select.Option key={state} value={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Connectivity"
              name="connectivity"
              rules={[{ required: true, message: 'Please select connectivity type!' }]} >
              <Select placeholder="Select Connectivity">
                <Select.Option value="CTU">CTU</Select.Option>
                <Select.Option value="STU">STU</Select.Option>
                <Select.Option value="Discom">Discom</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={`Total Install Capacity (in ${unit})`}
              name="installCapacity"
              rules={[{ required: true, message: 'Please input energy capacity!' }, { type: 'number', message: 'Please enter a valid number!' }]} >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={`Energy Capacity in ${unit}`}
                min={0} // Optionally, set a minimum value (0 for no negative capacity)
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={`Total Available Capacity (in ${unit})`}
              name="availableCapacity"
              rules={[{ required: true, message: 'Please input energy capacity!' }, { type: 'number', message: 'Please enter a valid number!' }]} >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={`Energy Capacity in ${unit}`}
                min={0} // Optionally, set a minimum value (0 for no negative capacity)
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="COD (Commercial Operation Date)"
              name="cod"
              rules={[{ required: true, message: 'Please select COD!' }]} >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disablePastDates} // Disable past dates and today
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ width: '100%' }}
            loading={loading} // Show loading indicator
          >
            Add Entry
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPortfolioModal;
