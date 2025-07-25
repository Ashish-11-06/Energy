/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
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
  Collapse,
  message,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment"; // Ensure moment is imported
const { Panel } = Collapse;
import { useDispatch, useSelector } from "react-redux";
import { fetchState, fetchDistricts } from "../../../Redux/Slices/Consumer/stateSlice";
import { fetchIndustry } from "../../../Redux/Slices/Consumer/industrySlice";
import { updateRequirements } from "../../../Redux/Slices/Consumer/consumerRequirementSlice";
import { decryptData } from "../../../Utils/cryptoHelper";
const { Option } = Select;

const RequirementForm = ({ open, onCancel, onSubmit, data, isEdit, fromRooftop, handleCancelModal }) => {
  const [form] = Form.useForm();
  const [customVoltage, setCustomVoltage] = useState("");
  const [isCustomVoltage, setIsCustomVoltage] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const [isCustomIndustry, setIsCustomIndustry] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(""); // State to track selected industry
  const [subIndustries, setSubIndustries] = useState([]);
  const [customSubIndustry, setCustomSubIndustry] = useState("");
  const [isCustomSubIndustry, setIsCustomSubIndustry] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocation] = useState('');
  const dispatch = useDispatch();
  const industryy = useSelector((state) => state.industry.industry);
  const statee = useSelector((state) => state.states.states);
  const isFetching = useRef(false);
  const [stateName, setStateName] = useState(""); // State to track selected state
  // console.log(data);
  // console.log('isEdit',isEdit);
  // console.log('fromrooftop',fromRooftop);
  useEffect(() => {
    if (data) {
      // console.log('data', data);
      const locationValue = data.location
        ? data.location
        : {
          latitude: data.latitude || '',
          longitude: data.longitude || '',
        };
      form.setFieldsValue({
        id: data?.id,
        state: data.state,
        consumption_unit: data.consumption_unit,
        industry: data.industry,
        contractedDemand: data.contracted_demand,
        tariffCategory: data.tariff_category,
        voltageLevel: data.voltage_level,
        annual_electricity_consumption: data.annual_electricity_consumption,
        procurement: data.procurement_date
          ? dayjs(data.procurement_date, "YYYY-MM-DD") // Ensure it is a valid dayjs object
          : null,
        roof_area: data.roof_area,
        solar_rooftop_capacity: data.solar_rooftop_capacity,
        location: locationValue
      });
      // console.log(data);
      setSelectedIndustry(data.industry);
      setSubIndustries(industryy[data.industry] || []);
    } else {
      form.resetFields(); // Reset fields if no data is provided
    }
  }, [data, form, industryy]);
  // console.log('state name',stateName);

  useEffect(() => {
    if (industryy.length < 1) {
      dispatch(fetchIndustry());
    }
    if (statee?.length < 1) {
      dispatch(fetchState());
    }
  }, [dispatch]);

  const validateLocation = () => {
    const district = form.getFieldValue("location");
    const lat = form.getFieldValue("latitude");
    const long = form.getFieldValue("longitude");

    if (district || (lat && long)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Please select either a district or both latitude and longitude.")
    );
  };

  useEffect(() => {
    const res = dispatch(fetchState());
  }, [dispatch]);

  const fetchDistrict = async (stateName) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const response = await dispatch(fetchDistricts(stateName));
      // console.log('response', response);

      setDistricts(response?.payload);
    } catch (error) {
      // console.error("Failed to fetch districts", error);
    } finally {
      isFetching.current = false;
    }
  };

  // console.log('districts',districts);

  useEffect(() => {
    if (data) {
      // console.log('data', data);

      const hasValidLocation = data.location;

      let locationValue = null;
      let latitude = '';
      let longitude = '';

      if (hasValidLocation) {
        locationValue = data.location;
      } else {
        latitude = data.latitude || '';
        longitude = data.longitude || '';
      }

      form.setFieldsValue({
        id: data?.id,
        state: data.state,
        consumption_unit: data.consumption_unit,
        industry: data.industry,
        contractedDemand: data.contracted_demand,
        tariffCategory: data.tariff_category,
        voltageLevel: data.voltage_level,
        sub_industry: data.sub_industry,
        annual_electricity_consumption: data.annual_electricity_consumption,
        procurement: data.procurement_date
          ? dayjs(data.procurement_date, "YYYY-MM-DD")
          : null,
        roof_area: data.roof_area,
        solar_rooftop_capacity: data.solar_rooftop_capacity,
        location: locationValue,
        latitude: latitude,
        longitude: longitude,
      });

      setSelectedIndustry(data.industry);
      setSubIndustries(industryy[data.industry] || []);
    } else {
      form.resetFields(); // Reset if no data
    }
  }, [data, form, industryy]);

  const handleIndustryChange = (value) => {
    setSelectedIndustry(value); // Update selected industry
    setSubIndustries(industryy[value] || []); // Fetch corresponding sub-industries
    form.setFieldsValue({ sub_industry: undefined }); // Reset sub-industry field
    if (value === "other") {
      setIsCustomIndustry(true);
    } else {
      setIsCustomIndustry(false);
      setCustomIndustry("");
    }
  };

  useEffect(() => {
    if (isEdit && data?.state) {
      fetchDistrict(data.state);
    }
  }, [isEdit, data?.state]);


  const handleSubIndustryChange = (value) => {
    if (value === "otherSub") {
      setIsCustomSubIndustry(true);
    } else {
      setIsCustomSubIndustry(false);
      setCustomSubIndustry("");
    }
  };

  const handleSubmit = (values) => {
    // console.log('values', values);

    const user = decryptData(localStorage.getItem("user")).user;

    const formattedValues = {
      id: data?.id,
      user: user.id,
      state: values.state,
      industry: values.industry === "other" ? customIndustry : values.industry,
      contracted_demand: values.contractedDemand,
      tariff_category: values.tariffCategory,
      voltage_level:
        values.voltageLevel === "other" ? customVoltage : values.voltageLevel,
      procurement_date: values.procurement.format("YYYY-MM-DD"),
      sub_industry:
        values.sub_industry === "otherSub"
          ? customSubIndustry
          : values.sub_industry,
      consumption_unit: values.consumption_unit,
      annual_electricity_consumption: values.annual_electricity_consumption,
      roof_area: values.roof_area,
      solar_rooftop_capacity: values.solar_rooftop_capacity,
    };

    // ✅ Robust check for valid location
    const hasValidLocation =
      values.location
    // values.location.latitude &&
    // values.location.longitude;

    // console.log('has validation',hasValidLocation);
    if (hasValidLocation) {
      formattedValues.location = values.location;
    } else {
      formattedValues.latitude = values.latitude || '';
      formattedValues.longitude = values.longitude || '';
    }

    // console.log('formattedValues', formattedValues);
    if (!fromRooftop) {
      onSubmit(formattedValues);
    } else {

      const res = dispatch(updateRequirements({ updatedData: formattedValues }));
      handleCancelModal();
      // console.log('res', res);

      if (res) {
        message.success('Requirement updated successfully!');
      }

    }

    form.resetFields();
    setCustomVoltage("");
    setIsCustomVoltage(false);
    setCustomIndustry("");
    setIsCustomIndustry(false);
    setCustomSubIndustry("");
    setIsCustomSubIndustry(false);
    setLocation('');
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
      setCustomVoltage("");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel(); // Close the modal
  };

  return (
    <Modal
      title="Fill in the details"
      open={open}
      onCancel={handleCancel}
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
              <Select
                placeholder="Select your state"
                showSearch
                disabled={isEdit} // Disable only in edit mode
                onChange={(value) => {
                  setLocation('');
                  setStateName(value);  // if needed
                  fetchDistrict(value);      // fetch districts when state changes
                  form.setFieldsValue({ location: undefined });
                }}

              >
                {(Array.isArray(statee) ? statee : []).map((state, index) => (
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
                disabled={isEdit} // Disable only in edit mode
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
                optionFilterProp="children"
                onChange={handleIndustryChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {/* Sorting industry keys alphabetically */}
                {Object.keys(industryy)
                  .sort((a, b) => a.localeCompare(b)) // Sorting alphabetically
                  .map((industry, index) => (
                    <Select.Option key={index} value={industry}>
                      {industry}
                    </Select.Option>
                  ))}
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {selectedIndustry && selectedIndustry !== "other" && (
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Sub Industry",
                  "Select a sub-industry from the chosen industry."
                )}
                name="sub_industry"
                rules={[
                  {
                    required: true,
                    message: "Please select your sub-industry!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a sub-industry"
                  showSearch
                  optionFilterProp="children"
                  onChange={handleSubIndustryChange} // Ensure this handler is used
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {/* Sorting subIndustries array alphabetically */}
                  {[...subIndustries]
                    .sort((a, b) => a.localeCompare(b)) // Sorting alphabetically
                    .map((sub_industry, index) => (
                      <Select.Option key={index} value={sub_industry}>
                        {sub_industry}
                      </Select.Option>
                    ))}

                  {/* Correct "Other" option outside the map loop */}
                  <Select.Option value="otherSub">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          {isCustomSubIndustry && (
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Custom Sub Industry",
                  'Enter the custom sub-industry if "Other" was selected.'
                )}
                name="customSubIndustry"
                rules={[
                  {
                    required: true,
                    message: "Please enter a custom sub-industry!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter custom sub-industry"
                  value={customSubIndustry}
                  onChange={(e) => setCustomSubIndustry(e.target.value)}
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
                <Select.Option value="11">11 kV</Select.Option>
                <Select.Option value="33">33 kV</Select.Option>
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
                {
                  validator: (_, value) => {
                    if (value === undefined || value === "") {
                      return Promise.reject(
                        new Error("Please enter the contracted demand!")
                      );
                    }
                    if (value <= 0) {
                      return Promise.reject(
                        new Error("Contracted demand must be greater than 0!")
                      );
                    }
                    // Regex to check max 2 decimal places
                    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                      return Promise.reject(
                        new Error(
                          "Contracted demand can have up to 2 decimal places!"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                min={0.01}
                step={0.01}
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
              rules={[
                {
                  required: true,
                  message: "Please enter the annual electricity consumption!",
                },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject(
                        new Error(
                          "Annual electricity consumption must be greater than 0!"
                        )
                      ),
                },
              ]}
            >
              <Input
                type="number"
                min={1}
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
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

        </Row>
        <Collapse defaultActiveKey={fromRooftop ? ['1'] : []}>
          <Panel header={<strong style={{ fontSize: '16px' }}>Rooftop Details</strong>} key="1">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={renderLabelWithTooltip(
                    "Roof Area available (including open space) in sq m",
                    "Enter the roof area available in square meter."
                  )}
                  name="roof_area"
                  rules={
                    fromRooftop
                      ? [
                        { required: true, message: "Please enter the roof area!" },
                        // { type: "number", min: 1, message: "Roof area must be greater than 0!" },
                      ]
                      : []
                  }
                >
                  <Input type="number" min={0} placeholder="Enter the roof area available in square meter." />
                </Form.Item>

              </Col>

              <Col span={12}>
                <Form.Item
                  label={renderLabelWithTooltip(
                    "Existing Solar Rooftop Capacity (kWp)",
                    "Enter the existing solar rooftop capacity."
                  )}
                  name="solar_rooftop_capacity"
                  rules={
                    fromRooftop
                      ? [
                        { required: true, message: "Please enter the rooftop capacity!" },
                        // {
                        //   validator: (_, value) =>
                        //     value > 0
                        //       ? Promise.resolve()
                        //       : Promise.reject(new Error("Capacity must be greater than 0!")),
                        // },
                      ]
                      : []
                  }
                >
                  <Input type="number" min={0} placeholder="Enter the existing solar rooftop capacity" />
                </Form.Item>

              </Col>

              <Col span={12}>
                <Form.Item
                  label={renderLabelWithTooltip(
                    "District of consumption unit",
                    "Select the district."
                  )}
                  name="location"
                  rules={
                    fromRooftop
                      ? [
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const lat = getFieldValue("latitude");
                            const lng = getFieldValue("longitude");

                            if (value || (lat && lng)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Please enter either a district or both coordinates.")
                            );
                          },
                        }),
                      ]
                      : []
                  }
                >
                  <Select
                    placeholder="Select District"
                    allowClear
                    onChange={(value) => setLocation(value)}
                  >
                    {(Array.isArray(districts) ? districts : []).map((district, index) => (
                      <Select.Option key={index} value={district}>
                        {district}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

              </Col>
              
           
              <div style={{ marginBottom: '10px', color: 'gray' }}>
                   (optional : You can add district or latitude and longitude.)
              </div>

              <Col span={24}>
                <Form.Item
                  // label="Coordinates (Lat & Long)"
                  label={renderLabelWithTooltip(
                    "Coordinates (Lat & Long)",
                    "Enter the coordinates of the location.(e.g. Latitude: 12.9716, Longitude: 77.5946)"
                  )}
                  // required
                  style={{ marginBottom: 0 }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Form.Item
                      name="latitude"
                      rules={
                        fromRooftop
                          ? [
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const location = getFieldValue("location");
                                const lng = getFieldValue("longitude");
                                if (location || (value && lng)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Please enter either district or both coordinates.")
                                );
                              },
                            }),
                          ]
                          : []
                      }
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input type="number" placeholder="Enter Latitude" step="any" />
                    </Form.Item>

                    <Form.Item
                      name="longitude"
                      rules={
                        fromRooftop
                          ? [
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const location = getFieldValue("location");
                                const lat = getFieldValue("latitude");
                                if (location || (lat && value)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Please enter either district or both coordinates.")
                                );
                              },
                            }),
                          ]
                          : []
                      }
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input type="number" placeholder="Enter Longitude" step="any" />
                    </Form.Item>

                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <p style={{ color: "GrayText" , marginTop:'10px' }}>(Note: All * fields are mandatory.)</p>
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

export default RequirementForm;
