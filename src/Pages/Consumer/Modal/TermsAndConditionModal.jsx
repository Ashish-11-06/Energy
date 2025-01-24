import React,{useState} from "react";
import { Modal, Button,Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

const TermsAndConditionModal = ({ visible, onCancel }) => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleContinue = () => {
    if (isChecked) {
      navigate("/consumer/requirement");
    }
  };
  return (
    <Modal
      title="Terms and Conditions"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <h3>Introduction</h3>
        <p>
          <p>Terms of Use</p><br />
           <p>
            This eProcurement Portal is designed, developed and
          hosted by National Informatics Centre, Government of India in
          consultation with Organisation/Department. </p>
          <br />
          <p>
          Though all efforts have
          been made to ensure the accuracy and correctness of the content on
          this Portal, the same should not be construed as a statement of law or
          used for any legal purposes. NIC or Organisation/Department accepts no
          responsibility in relation to the accuracy, completeness, usefulness
          or otherwise, of the contents. Users are advised to verify/check any
          information with the relevant Government department(s) and/or other
          source(s), and to obtain any appropriate professional advice before
          acting on the information provided in the Portal.
          </p>
          <pre>
          Users are hereby
          </pre>

          informed not to use, display, upload, modify, publish, transmit,
          update, share or store any information that: belongs to another
          person; is harmful, threatening, abusive, harassing, blasphemous,
          objectionable, defamatory, vulgar, obscene, pornographic, pedophilic,
          libelous, invasive of another's privacy, hateful, or racially,
          ethnically or otherwise objectionable, disparaging, relating or
          encouraging money laundering or gambling, or otherwise unlawful in any
          manner whatever; harm minors in any way; infringes any patent,
          trademark, copyright or other proprietary rights; violates any law for
          the time being in force; discloses sensitive personal information of
          other person or to which the user does not have any right to; causes
          annoyance or inconvenience or deceives or misleads the addressee about
          the origin of such messages or communicates any information which is
          grossly offensive or menacing in nature; impersonate another person;
          contains software viruses or any other computer code, files or
          programs designed to interrupt, destroy or limit the functionality of
          any computer resource; threatens the unity, integrity, defence,
          security or sovereignty of India, friendly relations with foreign
          states, or public order or causes incitement to the commission of any
          cognizable offence or prevents investigation of any offence or is
          insulting any other nation. It is hereby informed that in case of non
          compliance with terms of use of the services and privacy policy
          provided in this portal, on bringing it to the notice to the system
          administrator through the eMail ID provided in the contact us link of
          this portal with authentic proof, the violated user will be blocked
          immediately and access rights of the users to the eProcurement System
          will be terminated without any notice after verifying the details. In
          no event will the Organisation/Department or NIC be liable for any
          expense, loss or damage including, without limitation, indirect or
          consequential loss or damage, or any expense, loss or damage
          whatsoever arising from use, or loss of use, of data,arising out of or
          in connection with the use of this Portal. These terms and conditions
          shall be governed by and construed in accordance with the Indian Laws.
          Any dispute arising under these terms and conditions shall be subject
          to the exclusive jurisdiction of the courts of India. Copyright Policy
          The contents published in this portal are primarily owned by the
          respective Government / Organisation/Department.Material featured on
          this Portal maybe reproduced free of charge after taking proper
          permission from the respective Organisation / Department. However, the
          material has to be reproduced accurately and not to be used in a
          derogatory manner or in a misleading context and as per the guidelines
          provided by the respective Government / Department. Wherever the
          material is being published or issued to others, the source must be
          prominently acknowledged. However, the permission to reproduce this
          material shall not extend to any material which is identified as being
          copyright of a third party. Authorisation to reproduce such material
          must be obtained from the departments/copyright holders concerned.
          Privacy Policy The Government eProcurement Portal and apps based on
          this Portal does not automatically capture any specific personal
          information from you without your consent, (like name, phone number or
          e-mail address), that allows us to identify you individually. If the
          eProcurement Portal requests you to provide personal information, for
          registration or other activities ,you will be informed for the
          particular purposes for which the information is gathered and adequate
          security measures will be taken to protect your personal information.
          We do not sell or share any personally identifiable information
          volunteered on the eProcurement Portal site to any third party
          (public/private). Any information provided to this Portal will be
          protected from loss, misuse, unauthorized access or disclosure,
          alteration, or destruction. We gather certain information about the
          User, such as Internet protocol (IP) addresses, domain name, browser
          type, operating system, the date and time of the visit and the pages
          visited. We make no attempt to link these addresses with the identity
          of individuals visiting our site unless an attempt to damage the site
          has been detected or the department wants such information for any
          specific queries. Hyper Linking Policy Links to external
          websites/portals At many places in this Portal, you shall find links
          to other websites/portals. These links have been placed after careful
          scrutiny. These links have been placed for users convenience.
          NIC/Organisation / Department are not responsible for the contents and
          reliability of the linked websites and does not necessarily endorse
          the views expressed in them. Mere presence of the link or its listing
          on this Portal should not be assumed as endorsement of any kind. We
          cannot guarantee that these links will work all the time and we have
          no control over availability of linked pages. Links to eProcurement
          Portal by other websites We do not object to you linking directly to
          the information that is hosted on this eProcurement Portal and no
          prior permission is required for the same. However, we would like you
          to inform us about any links provided to this Portal so that you can
          be informed of any changes or updating therein. Also, we do not permit
          our pages to be loaded into frames on your site. The pages belonging
          to this Portal must load into a newly opened browser window of the
          User. Disclaimer Welcome to Central Public Procurement Portal of
          Government of India. On this portal, you shall find information about
          various Tender Documents issued by the Government
          Departments,Directorates, Statutory Organisations, Local bodies,
          Undertakings / Boards in India. This Service is being provided by
          Department of Expenditure, Government of India in association with
          National Informatics Centre (NIC) to facilitate faster dissemination
          and easy access to information related to Tenders. However, the
          Tenders are owned, published and maintained by the concerned
          Government Departments. The Tender Publishing Authorities of various
          Departments are responsible for their accuracy,authenticity and
          validity. In case of doubt or query, users are requested to refer to
          the original tender notification document and contact the respective
          Department / Organisation. Raamkumar M Ragu | Climate & Energy Direct:
          +91 (80) 4070 4000 | Mobile: +91 800 820 2065 Email:
          raamkumar.mr@pwc.com PricewaterhouseCoopers Private limited 1st Floor,
          Tower ‘D’, Millennia,
          <br />
          <p style={{fontSize:'16px'}}>
           1 & 2 Murphy Road, Ulsoor , Bangalore 560 008 |
          India
          </p>
          
           http://www.pwc.com/in "The information transmitted, including
          any attachments, is intended only for the person or entity to which it
          is addressed and may contain confidential and/or privileged material.
          Any review, retransmission, dissemination or other use of, or taking
          of any action in reliance upon, this information by persons or
          entities other than the intended recipient is prohibited, and all
          liability arising therefrom is disclaimed. If you received this in
          error, please contact the sender and delete the material from any
          computer. Please note if the e-mail address include "TPR", the sender
          of this e-mail is a third party resource, and not an employee, who has
          been specifically authorized to correspond routine matters related to
          the project only. For any clarification with regard to any non-routine
          or engagement specific deliverables please contact the assigned
          project manager/ project partner."
        </p>
        <div>
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}  />
       <span style={{marginRight:'10px'}}> Accept terms and conditions</span>
      </label>
     
    </div>
    </div>
      <Tooltip title={!isChecked ? 'Please accept terms and condition' : ''}>
      <Button onClick={handleContinue} disabled={!isChecked} type="primary">
        Continue
      </Button>
      </Tooltip>
     
    </Modal>
  );

};

export default TermsAndConditionModal;
