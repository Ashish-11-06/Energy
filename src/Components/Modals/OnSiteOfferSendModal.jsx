import React, { useCallback, useEffect, useState } from "react";
import { Modal, Button, Row, Col, Input, message } from "antd";
import roofTop from "../../Redux/api/roofTop";
import { error } from "pdf-lib";

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
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const buildPayload = (status) => ({
        id: formValues?.id,
        sent_from: fromConsumer ? "Consumer" : "Generator",
        offered_capacity: formValues?.offered_capacity
            ? parseInt(formValues.offered_capacity, 10)
            : null,
        price: formValues?.price ? parseInt(formValues.price, 10) : null,
        status,
    });
    

    const handleNegotiate = async () => {
        try {
            await roofTop.sendOnSiteOffer(buildPayload(undefined));
            message.success("Negotiation request sent");
            setRefreshData((prev) => !prev);
            onClose();
        } catch (error) {
            message.error(error.response.data.error || "Failed to send negotiation request");
            console.error("Negotiation request failed:", error);
        }
    };

    const handleAccept = async () => {
        try {
            await roofTop.sendOnSiteOffer(buildPayload("Accepted"));
            message.success("Offer accepted");
            setRefreshData((prev) => !prev);
            onClose();
        } catch {
            message.error("Failed to accept offer");
        }
    };

    const handleReject = async () => {
        try {
            await roofTop.sendOnSiteOffer(buildPayload("Rejected"));
            message.success("Offer rejected");
            setRefreshData((prev) => !prev);
            onClose();
        } catch {
            message.error("Failed to reject offer");
        }
    };

    return (
        <Modal
            title="Negotiate or Accept Offer"
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button
                    key="reject"
                    style={{
                        backgroundColor: "#ff6666",
                        borderColor: "#ff6666",
                        color: "#fff",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.setProperty("background-color", "#ff4d4d", "important");
                        e.currentTarget.style.setProperty("border-color", "#ff4d4d", "important");
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.setProperty("background-color", "#ff6666", "important");
                        e.currentTarget.style.setProperty("border-color", "#ff6666", "important");
                    }}
                    onClick={handleReject}
                >
                    Reject
                </Button>,
                <Button key="negotiate" onClick={handleNegotiate}>
                    Negotiate
                </Button>,
                <Button
                    key="accept"
                    type="primary"
                    style={{ background: "#669800" }}
                    onClick={handleAccept}
                >
                    Accept
                </Button>,
            ]}
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
                    Contracted Demand:
                </Col>
                <Col span={12}>{formValues?.contracted_demand}</Col>

                <Col span={12} style={{ fontWeight: 600 }}>
                    Roof Area:
                </Col>
                <Col span={12}>{formValues?.roof_area} square meters</Col>

                {/* Editable fields */}
                <Col span={12} style={{ fontWeight: 600 }}>
                    Rooftop Capacity Offered (kWp):
                </Col>
                <Col span={12}>
                    <Input
                        value={formValues?.offered_capacity}
                        onChange={(e) => handleInputChange("offered_capacity", e.target.value)}
                    />
                </Col>

                {formValues?.mode_of_development === "CAPEX" ? (
                    <>
                        <Col span={12} style={{ fontWeight: 600 }}>
                            CAPEX Price (INR lakhs/kWp):
                        </Col>
                        <Col span={12}>
                            <Input
                                value={formValues?.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
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
                                value={formValues?.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                            />
                        </Col>
                    </>
                ) : null}
            </Row>
        </Modal>
    );
};

export default OnSiteOfferSendModal;
