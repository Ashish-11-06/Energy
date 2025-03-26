/* eslint-disable no-unused-vars */
import { Modal, Button } from 'antd';
import React from 'react';

const SubscriptionDueModal = ({ open, onCancel, onConfirm, onOk, time_remaining }) => {
  const subscription = JSON.parse(localStorage.getItem("subscriptionPlanValidity"));
  const subscription_type = subscription?.subscription_type;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={time_remaining !== 'Expiring' ? onOk : undefined} // Disable onOk when Expiring
      footer={
        time_remaining === 'Expiring' ? (
          <Button onClick={onCancel}>Cancel</Button> // Only show Cancel button
        ) : (
          <>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={onOk}>OK</Button> {/* Show both buttons for Expired */}
          </>
        )
      }
    >
      {time_remaining === 'Expiring' ? (
        <>
          <p style={{ fontSize: '18px' }}>Subscription Expiring!!</p>
          <p style={{ color: 'black' }}>
            Your EXT {subscription_type} Plan subscription is expiring soon. Renew now to maintain access to EXT features.
          </p>
        </>
      ) : time_remaining === 'Expired' ? (
        <>
          <p style={{ color: 'red' }}>Subscription Expired!!</p>
          <p>Your EXT {subscription_type} Plan subscription has expired. Please subscribe to continue accessing EXT features.</p>
        </>
      ) : null}
    </Modal>
  );
};

export default SubscriptionDueModal;
