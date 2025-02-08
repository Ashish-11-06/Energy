import React, { useState,useEffect } from "react";
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
import { useDispatch ,useSelector} from "react-redux";
import dayjs from 'dayjs';
import { fetchState } from "../../../Redux/Slices/Consumer/stateSlice";
import { fetchIndustry } from "../../../Redux/Slices/Consumer/industrySlice";


const requirementForm = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [customVoltage, setCustomVoltage] = useState(""); // State to hold custom voltage input
  const [isCustomVoltage, setIsCustomVoltage] = useState(false); // Flag to toggle custom voltage input visibility
  const [customIndustry, setCustomIndustry] = useState(""); // State to hold custom industry input
  const [isCustomIndustry, setIsCustomIndustry] = useState(false); // Flag to toggle custom industry input visibility
 const [isState,setIsState]=useState([]);
 const [isIndustry,setIsIndustry]=useState([]);
// const states = useSelector((state) => state.consumer.states);
  const dispatch = useDispatch();
const industryy=useSelector((state)=>state.industry.industry);
const statee=useSelector((state)=>state.state.state);
// console.log(industryy);

// useEffect(() => {
//   dispatch(fetchState());
// }, [dispatch]);

if(industryy.length<1) {
  dispatch(fetchIndustry());
}

if(statee.length<1) {
  dispatch(fetchState());
}

  const handleSubmit = (values) => {
    const user = JSON.parse(localStorage.getItem('user')).user;
    const formattedValues = {
      user: user.id,
      state: values.state,
      industry: values.industry === "other" ? customIndustry : values.industry,
      contracted_demand: values.contractedDemand,
      tariff_category: values.tariffCategory,
      voltage_level: values.voltageLevel === "other" ? customVoltage : values.voltageLevel,
      procurement_date: values.procurement.format('YYYY-MM-DD'), // Change format to YYYY-MM-DD for submission
      consumption_unit: values.consumption_unit,
      annual_electricity_consumption: values.annual_electricity_consumption, // Add annual consumption to formatted values
    };
    if (onSubmit) {
      onSubmit(formattedValues);
    }
    form.resetFields();
    setCustomVoltage(""); // Reset custom voltage field
    setIsCustomVoltage(false); // Reset custom voltage flag
    setCustomIndustry(""); // Reset custom industry field
    setIsCustomIndustry(false); // Reset custom industry flag
  };

  useEffect(() => {
    dispatch(fetchState())
      .then(response => {
        // console.log(response.payload);
        
        setIsState(response.payload);
        //console.log(isState);
      })
      .catch(error => {
        console.error("Error fetching states:", error);
      });
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchIndustry())
  //     .then(response => {    
  //     //  setIsIndustry(response.payload);
  //       //console.log(isState);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching industry:", error);
  //     });
  // }, [dispatch]);
  

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

  const handleIndustryChange = (value) => {
    if (value === "other") {
      setIsCustomIndustry(true);
    } else {
      setIsCustomIndustry(false);
      setCustomIndustry(""); // Reset custom industry if "Other" is not selected
    }
  };

  return (
    <Modal
      title="Fill in the details"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "State",
                "State where the consumption unit is located or operates."
              )}
              name="state"
              rules={[{ required: true, message: "Please select your state!" }]}
            >
              
              <Select placeholder="Select your state" showSearch>
                {statee && statee.map((state, index) => (
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
                "Consumption Unit (Site name)",
                "Name of the consumption unit where the electricity is being consumed."
              )}
              name="consumption_unit"
              rules={[
                {
                 
                  required: true,
                  message: "Please enter the consumption unit name!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Enter consumption unit name"
              />
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
                optionFilterProp="items"
                onChange={handleIndustryChange}
                filterOption={(input, option) =>
                  option.items.toLowerCase().includes(input.toLowerCase())
                }
              >
                {industryy.map((industry, index) => (
                  <Select.Option key={index} value={industry}>
                    {industry}
                  </Select.Option>
                ))}
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {isCustomIndustry && (
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Custom Industry",
                  'Enter the custom industry if "Other" was selected.'
                )}
                name="customIndustry"
                rules={[{ required: true, message: "Please enter a custom industry!" }]}
              >
                <Input
                  type="text"
                  placeholder="Enter custom industry"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Tariff Category",
                "Select the tariff category for your consumption unit (refer to your electricity bill)."
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
                "Select the voltage level of the electricity being supplied to your consumption unit."
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
                  "Custom Voltage (kV)",
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
                  type="number"
                  placeholder="Enter custom voltage"
                  value={customVoltage}
                  onChange={(e) => setCustomVoltage(e.target.value)}
                />
              </Form.Item>
            </Col>
          )}


          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Contracted Demand (in MW)",
                "Contracted demand / Sanctioned load as per your electricity bill"
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

          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Annual Electricity Consumption (in MWh)",
                "Enter the annual electricity consumption in megawatt-hours."
              )}
              name="annual_electricity_consumption"
              rules={[{ required: true, message: "Please enter the annual electricity consumption!" }]}
            >
              <Input
                type="number"
                placeholder="Enter annual electricity consumption in MWh"
              />
            </Form.Item>
          </Col>

            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Expected Procurement Date",
                  "Select the date from which you need RE power."
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
                  format="DD/MM/YYYY" // Set the display format to DD/MM/YYYY
                  disabledDate={(current) => {
                    // Disable today and all past dates
                    return current && current <= new Date();
                  }}
                />
              </Form.Item>
            </Col>
         
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