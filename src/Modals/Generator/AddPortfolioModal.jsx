import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Radio } from 'antd';

const AddPortfolioModal = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [energyType, setEnergyType] = useState(null); // To track the selected energy type
  const [essType, setEssType] = useState(null); // To track the ESS type (BESS or PHSP)
  const [unit, setUnit] = useState('MW'); // To track the selected unit (MW or GW)

  const handleEnergyTypeChange = (value) => {
    setEnergyType(value);
    if (value !== 'ESS') {
      setEssType(null); // Reset ESS type when selecting Solar or Wind
    }
  };

  const handleEssTypeChange = (e) => {
    setEssType(e.target.value); // Update ESS type based on radio button selection
  };

  const handleUnitChange = (value) => {
    setUnit(value); // Update selected unit (MW or GW)
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onAdd({
          ...values,  // Include all form values
          unit, // Add the unit here explicitly
        });
        onClose();
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };
  

  return (
    <Modal
      title="Add New Entry"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" name="add_entry_form">
        {/* Type selection */}
        <Form.Item
          name="type"
          label="Energy Type"
          rules={[{ required: true, message: 'Please select the energy type!' }]}
        >
          <Select
            placeholder="Select Energy Type"
            onChange={handleEnergyTypeChange}
          >
            <Select.Option value="Solar">Solar</Select.Option>
            <Select.Option value="Wind">Wind</Select.Option>
            <Select.Option value="ESS">ESS</Select.Option>
          </Select>
        </Form.Item>

        {/* ESS Type selection (only visible if ESS is selected) */}
        {energyType === 'ESS' && (
          <Form.Item
            name="essType"
            label="ESS Type"
            rules={[{ required: true, message: 'Please select the ESS type!' }]}
          >
            <Radio.Group onChange={handleEssTypeChange} value={essType}>
              <Radio value="BESS">BESS</Radio>
              <Radio value="PHSP">PHSP</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {/* State selection */}
        <Form.Item
          name="state"
          label="State"
          rules={[{ required: true, message: 'Please select the state!' }]}
        >
          <Select placeholder="Select State">
            <Select.Option value="Karnataka">Karnataka</Select.Option>
            <Select.Option value="Maharashtra">Maharashtra</Select.Option>
            <Select.Option value="Rajasthan">Rajasthan</Select.Option>
            {/* Add more states as required */}
          </Select>
        </Form.Item>

        {/* Capacity input */}
        <Form.Item
          name="capacity"
          label="State Capacity"
          rules={[{ required: true, message: 'Please enter the state capacity!' }]}
        >
          <Input
            placeholder={`Enter capacity in ${unit}`}
            addonAfter={
              <Select value={unit} onChange={handleUnitChange} style={{ width: 100 }}>
                <Select.Option value="MW">MW</Select.Option>
                <Select.Option value="GW">GW</Select.Option>
              </Select>
            }
          />
        </Form.Item>

        {/* COD input */}
        <Form.Item
          name="cod"
          label="COD (Commercial Operation Date)"
          rules={[{ required: true, message: 'Please select the COD!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPortfolioModal;
