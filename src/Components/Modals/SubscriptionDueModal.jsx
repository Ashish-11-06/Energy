/* eslint-disable no-unused-vars */
import { Modal } from 'antd';
import React from 'react'

const SubscriptionDueModal = ({open,onCancel,onConfirm}) => {
    const subscription = JSON.parse(
        localStorage.getItem("subscriptionPlanValidity")
      );
     console.log(subscription);
     const subscription_type=subscription?.subscription_type;
     
  return (
    <Modal open={open} onCancel={onCancel} onConfirm={onConfirm}>
        <p style={{color:'red'}}>Subscription Expired!!</p>
        Your EXT {subscription_type} Plan has expired. Please subscribe to continue accessing EXT features.    </Modal>
  )
}

export default SubscriptionDueModal
