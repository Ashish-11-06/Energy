import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Tooltip,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import states from "../../../Data/States";
import industries from "../../../Data/Industry";

const requirementForm = ({ isVisible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [customVoltage, setCustomVoltage] = useState(""); // State to hold custom voltage input
  const [isCustomVoltage, setIsCustomVoltage] = useState(false); // Flag to toggle custom voltage input visibility

  const handleSubmit = (values) => {
    const user = JSON.parse(localStorage.getItem('user')).user;
    const formattedValues = {
      user: user.id,
      state: values.state,
      industry: values.industry,
      contracted_demand: values.contractedDemand,
      tariff_category: values.tariffCategory,
      voltage_level: values.voltageLevel === "other" ? customVoltage : values.voltageLevel,
      procurement_date: values.procurement.format('YYYY-MM-DD'),
      site: values.site,
    };
    if (onSubmit) {
      onSubmit(formattedValues);
    }
    form.resetFields();
    setCustomVoltage(""); // Reset custom voltage field
    setIsCustomVoltage(false); // Reset custom voltage flag
  };

  const renderLabelWithTooltip = (label, tooltip) => (
    <span>
      {label}{" "}
      <Tooltip title={tooltip}>
        <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
      </Tooltip>
    </span>
  );

  const handleVoltageChange = (value) => {
    if (value === "other") {
      setIsCustomVoltage(true);
    } else {
      setIsCustomVoltage(false);
      setCustomVoltage(""); // Reset custom voltage if "Other" is not selected
    }
  };

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
                "State",
                "State where the company is located or operates."
              )}
              name="state"
              rules={[{ required: true, message: "Please select your state!" }]}
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
                "Industry",
                "Industry your company is involved in (e.g., IT, Manufacturing)."
              )}
              name="industry"
              rules={[
                { required: true, message: "Please select your industry!" },
              ]}
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

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Tariff Category",
                "Select the tariff category applicable to your company (e.g., HT Commercial, LT Industrial)."
              )}
              name="tariffCategory"
              rules={[
                { required: true, message: "Please select a tariff category!" },
              ]}
            >
              <Select placeholder="Select tariff category">
                <Select.Option value="HT Commercial">
                  HT Commercial
                </Select.Option>
                <Select.Option value="HT Industrial">
                  HT Industrial
                </Select.Option>
                <Select.Option value="LT Commercial">
                  LT Commercial
                </Select.Option>
                <Select.Option value="LT Industrial">
                  LT Industrial
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Voltage Level",
                "Select the voltage level of the electricity being supplied to your company."
              )}
              name="voltageLevel"
              rules={[
                { required: true, message: "Please select the voltage level!" },
              ]}
            >
              <Select
                placeholder="Select voltage level"
                onChange={handleVoltageChange}
              >
                <Select.Option value="33">33 kV</Select.Option>
                <Select.Option value="11">11 kV</Select.Option>
                <Select.Option value="66">66 kV</Select.Option>
                <Select.Option value="110">110 kV</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {isCustomVoltage && (
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Custom Voltage",
                  'Enter the custom voltage level if "Other" was selected.'
                )}
                name="customVoltage"
                rules={[
                  {
                    required: true,
                    message: "Please enter a custom voltage value!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter custom voltage"
                  value={customVoltage}
                  onChange={(e) => setCustomVoltage(e.target.value)}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Contracted Demand (in MW)",
                "The contracted demand is the amount of electricity in MW that the company has committed to using."
              )}
              name="contractedDemand"
              rules={[
                {
                  required: true,
                  message: "Please enter the contracted demand!",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter contracted demand in MW"
              />
            </Form.Item>
          </Col>

          <Row>
          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Site name",
                "Name of the site where the electricity is being consumed."
              )}
              name="site"
              rules={[
                {
                 
                  required: true,
                  message: "Please enter the Site name!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Enter Site name"
              />
            </Form.Item>
          </Col>

            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Procurement Date",
                  "Select the date when the procurement of services or goods occurred (expected Date)."
                )}
                name="procurement"
                rules={[
                  {
                    required: true,
                    message: "Please select a procurement date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    // Disable today and all past dates
                    return current && current <= new Date();
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Row>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ padding: "10px 20px" }}
          >
            Continue
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default requirementForm;
