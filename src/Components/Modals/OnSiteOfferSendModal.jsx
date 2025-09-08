import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Input, message, Tooltip } from "antd";
import roofTop from "../../Redux/api/roofTop";

const OnSiteOfferSendModal = ({
  visible,
  onClose,
  selectedOffer,
  setRefreshData,
  fromConsumer,
}) => {
  const [formValues, setFormValues] = useState({});


  useEffect(() => {
    if (selectedOffer) {
      setFormValues(selectedOffer); // initialize with selectedOffer
    }
  }, [selectedOffer]);

  const handleInputChange = (field, value) => {
    let parsedValue = value;

    if (field === "price") {
      parsedValue = value ? parseFloat(value) : null; // ✅ allow floats
    }
    if (field === "offered_capacity") {
      parsedValue = value ? parseInt(value, 10) : null; // keep integer
    }

    setFormValues((prev) => ({ ...prev, [field]: parsedValue }));
  };

  const buildPayload = (status) => ({
    id: formValues?.id,
    sent_from: fromConsumer ? "Consumer" : "Generator",
    offered_capacity: formValues?.offered_capacity
      ? parseInt(formValues.offered_capacity, 10)
      : null,
    price:
      formValues?.price !== null && formValues?.price !== undefined
        ? parseFloat(formValues.price).toFixed(2)
        : null,
    status,
  });

  const handleNegotiate = async () => {
    try {
      await roofTop.sendOnSiteOffer(buildPayload(undefined));
      message.success("Negotiation request sent");
      setRefreshData((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Negotiation request failed:", error);
      message.error(
        error.response?.data?.error || "Failed to send negotiation request"
      );
    }
  };

  const handleAccept = async () => {
  try {
    const res = await roofTop.sendOnSiteOffer(buildPayload("Accepted"));

    if (res?.status === 200 || res?.status === 201) {
      message.success("Offer accepted");
      setRefreshData((prev) => !prev);
      onClose();
      return; // ✅ stop execution, avoid going into error
    }

    // only show error if explicitly failed
    message.error("Failed to accept offer");
  } catch (error) {
    console.error("Accept offer error:", error);
    message.error(error?.response?.data?.error || "Failed to accept offer");
  }
};


  
const handleReject = async () => {
  try {
    const res = await roofTop.sendOnSiteOffer(buildPayload("Rejected"));

    if (res?.status === 200 || res?.status === 201) {
      message.success("Offer rejected");
      setRefreshData((prev) => !prev);
      onClose();
      return; // ✅ stop execution
    }

    message.error("Failed to reject offer");
  } catch (error) {
    console.error("Reject offer error:", error);
    message.error(error?.response?.data?.error || "Failed to reject offer");
  }
};

  // ----- Conditions -----
  const count = selectedOffer?.count;
  const status = selectedOffer?.status;
  let showButtons = false;
  let acceptRejectButtons = false;
  let note = null;
  const isPriceInvalid =
    formValues?.price === null ||
    formValues?.price === 0 ||
    formValues?.price < 0;

  if (fromConsumer) {
    if (count === 1 || count === 3) {
      note = "Awaiting response from generator";
    } else if (status === "Accepted" || status === "Rejected") {
      note = `The offer is ${status.toLowerCase()}`;
    } else if (count === 2 || count === 4) {
      showButtons = true;
    }
  } else {
    if (count === 1 || count === 3) {
      showButtons = true;
    } else if (status === "Accepted" || status === "Rejected") {
      note = `The offer is ${status.toLowerCase()}`;
    } else {
      note = "Awaiting response from consumer";
    }
  }

  return (
    <Modal
      title="Negotiate or Accept Offer"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        showButtons
          ? [
              <Button
                key="reject"
                style={{
                  backgroundColor: "#ff6666",
                  borderColor: "#ff6666",
                  color: "#fff",
                }}
                disabled={isPriceInvalid} // disable if invalid
                onClick={handleReject}
              >
                Reject
              </Button>,
              <Tooltip
                key="negotiate"
                title={
                  count === 3 || count === 4
                    ? "This is your last chance to negotiate"
                    : ""
                }
              >
                <Button onClick={handleNegotiate}>Negotiate</Button>
              </Tooltip>,
              <Button
                key="accept"
                type="primary"
                style={{ background: "#669800" }}
                disabled={isPriceInvalid} // disable if invalid
                onClick={handleAccept}
              >
                Accept
              </Button>,
            ]
          : null
      }
    >
      <Row gutter={[16, 12]}>
        <Col span={12} style={{ fontWeight: 600 }}>
          Consumer ID:
        </Col>
        <Col span={12}>{formValues?.consumer}</Col>

        <Col span={12} style={{ fontWeight: 600 }}>
          Credit Rating:
        </Col>
        <Col span={12}>{formValues?.credit_rating}</Col>

        <Col span={12} style={{ fontWeight: 600 }}>
          State:
        </Col>
        <Col span={12}>{formValues?.state}</Col>

        <Col span={12} style={{ fontWeight: 600 }}>
          Industry:
        </Col>
        <Col span={12}>{formValues?.industry}</Col>

        <Col span={12} style={{ fontWeight: 600 }}>
          Contracted Demand (MW):
        </Col>
        <Col span={12}>{formValues?.contracted_demand}</Col>

        <Col span={12} style={{ fontWeight: 600 }}>
          Roof Area (square meters):
        </Col>
        <Col span={12}>{formValues?.roof_area} </Col>

        {/* Editable fields */}
        <Col span={12} style={{ fontWeight: 600 }}>
          Rooftop Capacity Offered (kWp):
        </Col>
        <Col span={12}>
          <Input
            value={formValues?.offered_capacity}
            onChange={(e) =>
              handleInputChange("offered_capacity", e.target.value)
            }
            disabled={!showButtons}
          />
        </Col>

        {formValues?.mode_of_development === "CAPEX" ? (
          <>
            <Col span={12} style={{ fontWeight: 600 }}>
              CAPEX Price (INR lakhs/kWp):
            </Col>
            <Col span={12}>
              <Input
                type="number"
                step="0.01"
                required
                value={formValues?.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                disabled={!showButtons}
              />
            </Col>
          </>
        ) : formValues?.mode_of_development === "RESCO" ? (
          <>
            <Col span={12} style={{ fontWeight: 600 }}>
              RESCO Price (INR/kWh):
            </Col>
            <Col span={12}>
              <Input
                type="number"
                step="0.01"
                required
                value={formValues?.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                disabled={!showButtons}
              />
            </Col>
          </>
        ) : null}

        {isPriceInvalid && showButtons && (
          <p style={{ color: "red", marginTop: "4px" }}>
            Please enter a valid price (must be greater than 0).
          </p>
        )}
      </Row>
      {!showButtons && note && (
        <p
          style={{
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            margin: "20px 0",
            color: "#888",
          }}
        >
          {note}
        </p>
      )}
    </Modal>
  );
};

export default OnSiteOfferSendModal;
