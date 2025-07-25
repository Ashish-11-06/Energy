/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { Modal, Button } from 'antd';

// Reusable AgreementContent Component
const AgreementContent = ({ dynamicData }) => (
  // console.log('dynamicData', dynamicData),
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', lineHeight: 1.5 }}>
      <h3 style={{ margin: 0 }}>Terms Sheet (Terms)</h3>
      <p style={{ margin: '5px 0' }}>for Renewable Power Plant between</p>
      <p style={{ margin: '5px 0' }}> {dynamicData.generatorName} and {dynamicData.consumerName},</p>
      <p style={{ margin: '5px 0' }}>under Open Access Captive Mechanism</p>
      <p style={{ margin: '5px 0' }}>in {dynamicData.consumer_state}</p>
      <p style={{ margin: '5px 0' }}>(the “Proposed Transaction”)</p>

      <hr style={{ width: '50px', margin: '10px auto', border: '1px solid black' }} />

      <p style={{ margin: '10px 0' }}>
        <span style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>{dynamicData.solar}  MW Solar,</span>
        <span style={{ fontWeight: 'bold' }}> {dynamicData.wind} MW Wind</span> and {' '}
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}> {dynamicData.ess} MWh ESS</span> capacity
      </p>
    </div>

    {/* ................................................ */}
    {/* consumer details */}

    <p className='page-break'></p>
    <p> <br /> <b>{dynamicData.consumerName} (consumer)</b></p>

    <div style={{ textAlign: 'right' }}>
      Date: {new Date().toLocaleDateString('en-GB')}

    </div>

    <h3><strong>Indicative Heads of Terms for Open Access Captive Solar Project in {dynamicData.solarState}</strong></h3>

    <p><b>{`${dynamicData.generator} (Generator)` || 'Reciever,'} </b></p>

    <p>Please find enclosed outline terms for the open access captive renewable project <div></div>
      ("Project") situated at [ <b>{dynamicData.consumer_state}</b> ], India ("Project Site").</p>

    <strong><p>1. Content of these heads of terms</p></strong>

    <p style={{ marginLeft: '25px' }}><strong>1.1.</strong> The outline terms for the Proposed Transaction are set out in the Annexures and cover:</p>
    <div style={{ marginLeft: '25px' }}>
      <p>a) the term sheet for the power consumption agreement is set out in Part 1 of the Annex;</p>
      <p>b) the term sheet for the equity commitment is set out in Part 2 of the Annex; and</p>
      <p>c) the shareholding arrangements are set out in Part 3 of the Annex.</p>
      <p>The Proposed Transaction remains subject to satisfactory due diligence by <b>{dynamicData.generator}</b>, and to the agreement and signature by all relevant <b>{dynamicData.consumerName}(s)</b> of all legally binding agreements (the "Transaction Documents").</p>
    </div>


    <p style={{ marginLeft: '25px' }}><strong>1.2.</strong> These heads of terms in the annexes ("Terms") are not exhaustive nor are they intended to be legally binding between <b>{dynamicData.generator}</b> and the <b>{dynamicData.consumerName}(s)</b>.¹ The Transaction Documents will contain more detailed terms and conditions on the rights, obligations and responsibilities of the parties, along with customary representations and warranties and indemnities.</p>

    <p class="section-title"><strong>2. Exclusivity</strong></p>
    <p style={{ marginLeft: '25px' }}><strong>2.1.</strong>  The definitions in this Paragraph 2.1 apply in this Paragraph 2:</p>
    <div style={{ marginLeft: '25px' }}>
      <p><b>Exclusivity Period:</b> The period commencing on the date of execution of the Terms, and ending at the earlier of: (a) the execution of the last of the Transaction Documents; or (b) on the date falling 150 days after the date of execution of the.</p>
      <p>Terms; or (c) other such date to be agreed between ;<b>{dynamicData.generator}</b> and the <b><b>{dynamicData.consumerName}(s)</b></b> in writing:</p>
      <p><strong>Restricted Activity:</strong> Negotiations in relation to power procurement activities through open access, captive or through power exchange. This does not include any existing transactions for which contracts have been executed prior to the execution of the Terms;</p>
      <p><strong>Third Party:</strong> Any person other than <b>{dynamicData.generator}</b> (or any of their respective officers, employees, agents or advisers);</p>
      <p className='page-break'><strong>Third Party Negotiations:</strong> Any discussions or negotiations between a Third Party and the <b>{dynamicData.consumerName}(s)</b> or the {dynamicData.consumerName}'s group, or any of its respective officers, employees, agents or advisers, relating to or otherwise concerning a Restricted Activity.</p>

    </div>
    {/* ================================================================================================================================================ */}

    <p style={{ marginLeft: '25px' }}><strong>2.2.</strong> The <b>{dynamicData.consumerName}(s)</b> agrees that for the duration of the Exclusivity Period, it will discuss and negotiate the Proposed Transaction with <b>{dynamicData.generator}</b> on an exclusive basis. The <b>{dynamicData.consumerName}(s)</b> undertakes that for the duration of the Exclusivity Period, it will not (and will procure that no member of its group, nor any of their respective officers, employees, agents or advisers), directly or indirectly continue, enter into, re-start, solicit, initiate, respond to any inquiries, consider or participate in any Third Party Negotiations, in any manner whatsoever.</p>
    <p style={{ marginLeft: '25px' }}><strong>2.3.</strong> On executing the Terms, the <b>{dynamicData.consumerName}(s)</b> will immediately terminate, or procure the termination of, any Third Party Negotiations taking place.</p>
    <p> <b>3. Undertakings</b></p>
    <div style={{ marginLeft: '25px' }}>
      <p><strong>3.1.</strong> Based on the {dynamicData.consumerName}'s exclusivity undertakings (as set out in paragraph 2 above), <b>{dynamicData.generator}</b> is committing costs and time to develop the Project at the Project Site through the feasibility stage. During the Exclusivity Period, <b>{dynamicData.generator}</b> will use its reasonable endeavours to proceed with and develop the Project at the Project Site.</p>
      <p><strong>3.2.</strong> For the purposes of operating the Project, an application for connectivity to the grid is required to be submitted to the DISCOM (Grid Application). The Parties agree that <b>{dynamicData.generator}</b> will make such an application, and the <b>{dynamicData.consumerName}(s)</b> will provide necessary co-operation to <strong><b>{dynamicData.generator}</b></strong> in procuring and maintaining the open access approval. </p>
      <p><strong>3.3.</strong> The <b>{dynamicData.consumerName}(s)</b> undertakes to execute a consent letter addressed to the DISCOM (and any other documents as <b>{dynamicData.generator}</b>may require) in the form required by <b>{dynamicData.generator}</b>  </p>
      <p><strong>3.4.</strong> In connection with the Grid Application, <b>{dynamicData.generator}</b> shall be solely responsible for all fees and costs of such Grid Application.</p>
      <p><strong>3.5.</strong> <b>{dynamicData.generator}</b> shall, at appropriate intervals, keep the <b>{dynamicData.consumerName}(s)</b> and the EXG Global reasonably informed of the status of the development of the Project, status of other <b>{dynamicData.consumerName}(s)</b> and any other information reasonably required for the purposes of the Project.</p>
      <p><strong>3.6.</strong> The <b>{dynamicData.consumerName}(s)</b> agrees to provide <b>{dynamicData.generator}</b> such information as <b>{dynamicData.generator}</b> may request related to the Proposed Transaction, including but not limited to any information to enable Generator to carry out due diligence on the <b>{dynamicData.consumerName}(s)</b> and/or its group. The <b>{dynamicData.consumerName}(s)</b> shall respond to any request by Generator under this paragraph as soon as reasonably practicable.</p>
      <p><strong>3.7.</strong> The parties undertake to use their best endeavours to negotiate the Transaction Documents in good faith based on the Terms.    </p>
      <p><strong>3.8.</strong> The parties undertake to use their best endeavours to conclude and enter into the Transaction Documents (and all ancillary documents) prior to the expiry of the Exclusivity Period.</p>
    </div>
    <p className='page-break'><strong>4. Termination</strong></p>

    <div style={{ marginLeft: '25px' }}>
      <p>
        <p></p><strong>4.1. </strong>Neither party may terminate the Terms prior to the expiry of the Exclusivity
        Period, provided however, <b>{dynamicData.generator}</b> may terminate this arrangement in
        the following circumstances, by giving a reasonable notice to the Captive
        User(s):
        <br />
        a) where the parameters make the investment non-viable for <b>{dynamicData.generator}</b>,
        as determined solely by <b>{dynamicData.generator}</b>;
        <br />
        b) where the <b>{dynamicData.consumerName}(s)</b> fails to comply with its obligations under the
        Terms, including, without limitation, its obligations in respect of
        exclusivity, confidentiality, assisting <b>{dynamicData.generator}</b> with the Grid
        Application, and obligation to negotiate and conclude the Transaction
        Documents in good faith; and
        <br />
        where the <b>{dynamicData.consumerName}(s)</b> fails to pass <b>{dynamicData.generator}</b>’s due diligence relating to compliance and business ethics, as determined solely by <b>{dynamicData.generator}</b>.
      </p>

      <p><strong>4.2. </strong>The termination by <b>{dynamicData.generator}</b> of the Terms, in accordance with paragraph 4.1 above, shall be without any liability for <b>{dynamicData.generator}</b> , Consumer and EXG Global. </p>
    </div>
    <div  >
      <p><strong>5. Confidentiality</strong></p>
      <p style={{ marginLeft: '25px' }}><strong>5.1. </strong>The Terms and all negotiations and information shared between the parties with respect to the Proposed Transaction are confidential and terms of the confidentiality undertaking entered into by the Parties shall apply.</p>
    </div>
    <p><strong>6. Costs</strong></p>
    <div style={{ marginLeft: '25px' }}>
      <p><strong>6.1. </strong>Each party shall pay its own costs incurred in connection with the Terms, the Transaction Documents and any documents contemplated by them, whether or not the Proposed Transaction proceeds.     </p>
    </div>
    <p><strong>7. Governing law</strong></p>
    <div style={{ marginLeft: '25px' }}>
      <p><strong>7.1 </strong>The Terms shall be governed by and construed in accordance with the law of India. Any claims or disputes arising out of or in connection with the Terms, will be referred to and finally resolved by arbitration in accordance with the (Indian) Arbitration and Conciliation Act, 1996. Each Party will appoint an arbitrator. The two arbitrators so appointed will appoint the third arbitrator. </p>
    </div>
    <br />
    <p>Yours faithfully.</p>

    <div></div>

    <p>For and on behalf of <b>{dynamicData.generator}</b></p>

    <div></div>
    <br />
    <p>For and on behalf of <b> {dynamicData.consumerName}</b></p>
    <br />
    <div></div>

    <p >For and on behalf of [EXG Global]</p>

    <div className='page-break'>
      <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>Part 1: Heads of Terms of Power Purchase Agreement (PPA)</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>No.</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Particulars</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>1.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>Parties</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              a) SPV <b>{dynamicData.generator}</b>; and<br />
              b) {dynamicData.consumerName}.<br />
              Each {dynamicData.consumerName} will have its own PPA with the <b>{dynamicData.generator}</b>.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>2.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>Pre-Construction Period</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              From the signing date and during the Pre-Construction Period:<br />
              (i) the {dynamicData.consumerName} will:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;a. secure board approvals and all other internal approvals with respect to the Proposed Transaction; <b>and</b><br />
              &nbsp;&nbsp;&nbsp;&nbsp;b. enter into the share subscription agreement and shareholders’ agreement ("<b>Equity Documents</b>") and infuse the required investment as per the Equity Documents;<br />
              (ii) The Generator shall:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;a. secure board approvals and all other internal approvals with respect to the Proposed Transaction;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;b. execute engineering, procurement and construction contracts for construction of the Project;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;c. achieve financial closure for financing the Project;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;d. obtain the land for developing the Project;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;e. obtain all approvals required by law for the purpose of developing the Project and supplying power under the Proposed Transaction.<br />
              Inform EXG Global and {dynamicData.consumerName} of the status of different approvals.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>3.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>Construction Period</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              During the Construction Period the Parties shall do the following:
              the Generator shall:
              <br />

              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp;   (a)inform the <b>{dynamicData.consumerName} </b> and EXG Global of the indicative programme of works in respect of the Project, identifying the timing of the on-site works, energisation of the Injection Point and the anticipated Commercial Operations Date and shall update on any material changes to the programme;

              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp;  (b)enter into/ submit such documents as may be required (including appropriate wheeling and banking agreements, grid tie-up arrangements or connectivity and open access approval in respect of the Project); and
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp;   (c) construct the Project and energise the Injection Point.

              <div></div>  The <b>{dynamicData.consumerName} </b> shall:
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp; (a) to the extent not already done, take steps to install (at its own cost) and commission in accordance with any relevant requirements an appropriate meter and such other infrastructure required by the {dynamicData.consumerName} for off-taking power from the Project; and
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp; (b) provide such assistance as is required in respect of the application and entering into of the wheeling and banking agreements; and
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp; (c) enter into such undertakings, provide such evidence and documents as may be require to enable the Project to obtain connectivity and open access and status of Group Captive Project

            </td>
          </tr>
          <tr >
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>4.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>
              Commissioning
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>

              <p>
                Subject to the <b>{dynamicData.consumerName} </b> complying with their obligations under the PPAs and Equity Documents, the Generator will use its best efforts to construct the Project and commence supply of power from the Project within <strong>COD</strong> (Anticipated COD).
              </p>
              <p>
                Where the commencement of Power Supply is delayed for whatever reason, the Generator shall use its best endeavours to obtain an extension of the connection approval. The Anticipated COD shall be deemed extended due to delays in procuring government approvals, or any other delay which is not attributable or beyond the reasonable control of the Generator.
              </p>
              <p >
                In case of non-commencement of power supply by the Anticipated COD, on account of reasons solely attributable to the Generator, the Generator will endeavour to provide power equivalent to contract capacity at the same tariff from other sources (i.e., IEX, other generators etc).
              </p>
              <p>
                The <b>{dynamicData.consumerName} </b> will be entitled to terminate the PPA if the Project does not commence its power supply by the date falling 6 months after the Anticipated COD for reasons solely attributable to the Generator. The consequences of such termination, including the compensation, if any, shall be dealt with in the Shareholders Agreement/PPA.
              </p> </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>5.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>
              Contract Period & Lock-In
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The contract period and lock-in period should be mutually agreed and reflected in the PPA.
              </p>
              <p>
                <strong>{dynamicData.term_of_ppa}</strong> years from the date of commencement of supply of the power in case long-term open access has been procured [as set out in the Wheeling Agreement]. The minimum Lock-in period binding the Parties is <strong>{dynamicData.lock_in_period}</strong> years from the date of commencement of supply of power.
              </p>
              <p>
                Either Party may terminate the PPA by providing one year (12 months) notice period to the other party after completion of <strong>{dynamicData.lock_in_period} -1</strong> years from the date of commencement of supply of power such that the Lock-in period of <strong>{dynamicData.lock_in_period}</strong> years is maintained by either Party. Any such termination of PPA will also result in termination of the Equity Documents vis-à-vis such {dynamicData.consumerName}, to exit its role as a Shareholder.
              </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>6.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>
              Contracted Capacity and Contracted Electrical Output
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                A group captive capacity of <strong>{dynamicData.solar} MW</strong> Solar capacity, <strong>{dynamicData.wind} MW</strong> of Wind Capacity, and <strong>{dynamicData.ess} MWh</strong> of ESS shall be allocated in the
                <p>Project to the <b>{dynamicData.consumerName} </b> (“Contracted Capacity”).</p>
              </p>
              <p>
                The <b>{dynamicData.consumerName} </b> shall offtake its proportion of the energy generated by the Project in each Financial Year (Aggregate Contracted Electrical Output). In each month, the {dynamicData.consumerName} shall, unless instructed otherwise by the Generator, offtake its proportion of the energy generated by the Project in that month (Monthly Contracted Electrical Output).
              </p>
              <p>
                The Generator has the right to instruct and bill different Monthly Contracted Electrical Outputs for a <b>{dynamicData.consumerName} </b> in a month where:
              </p>
              <ul>
                <li>The <b>{dynamicData.consumerName} </b> have agreed with the Generator that different proportions apply between themselves for that month; and</li>
                <li>It is required to ensure the Aggregate Contracted Electrical Output is achieved.</li>
              </ul>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>7.</td>
            <td style={{
              border: '1px solid black',
              padding: '8px',
              textAlign: 'left',
              verticalAlign: 'top' // Align text to the top 
            }}>
              Reference Annual Energy Generation
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The Contracted Capacity is expected to generate a minimum <strong>{dynamicData.minimum_generation_obligation}</strong> on generation. Further details will be detailed out in the PPA.
              </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>8.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Forecast, Maintenance, outages and availability


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The Generator shall provide the <b>{dynamicData.consumerName}(s)</b> with monthly output forecasts, maintenance planning and forced outage data.   </p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>9.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Imbalance


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The Generator will assume imbalance risks and costs related to the generation.
              </p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>10.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Injection Point and With Drawl Point and Voltage




            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                <p>
                  <strong>Injection Point:</strong> The Injection Point of the power will be at the Project’s Meter on the Project Switchyard and at <strong>Generator State</strong> for Solar, <strong>Generator State</strong> for Wind, and <strong>Generator State</strong> for ESS.
                </p>
                <p>
                  <strong>Withdrawal Point:</strong> The Withdrawal Point of power for {dynamicData.consumerName} shall be at their respective ABT Meter.
                </p>
              </p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>11.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Metering and Monitoring System

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                <p>
                  <strong>Metering:</strong> Metering will be done at the Injection Point (Project switchyard) & substation at <strong>{dynamicData.voltage_level_of_generation}</strong> kV level.
                </p>
                <p>
                  <strong>Billing:</strong> Billing will be as per Project plant switchyard ABT meter.
                </p>        </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>12.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Tariffs
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                Bill for Monthly Contracted Electrical Output from the Project will be <strong>{parseFloat(dynamicData.tariff_finalized).toFixed(2)}
                  {' '}INR/kWh</strong> till completion of the Project.
              </p>
            </td>
          </tr>


          <tr >
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>13.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Industry Charges

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p >
                All the charges & losses related to Open Access, Wheeling, Transmission, Banking of Power, Transmission line, Surcharges and any other charges levied beyond the Injection point shall be borne by the {dynamicData.consumerName} in the proportion of their power consumption and shall be payable by the {dynamicData.consumerName} directly to the relevant governmental authority or shall be billed by the
                <p > Generator as part of the monthly bill.</p>  </p>
            </td>
          </tr>

          <p ></p>
          <tr >
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>14.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Taxes / Duties and Similar

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>Any additional charges, taxes, cess, duty etc. levied by any regulatory / statutory authorities from time to time shall be in addition to the Tariff and shall be payable by the {dynamicData.consumerName} directly or shall be billed by the Generator as part of the monthly bill.</p>
            </td>
          </tr>



          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>15.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Billing and Payment

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>The Generator shall not have any responsibility to reconcile a Customer’s energy bills, with the generation from the Project.</p>
              <p>Bills will be raised on monthly basis and payable within 30 days ("<strong>Due Date</strong>"), beyond which late payment surcharge will be payable by the {dynamicData.consumerName}. In case of failure to make full payment with 15 days beyond the Due Date, the Generator may invoke the payment security.</p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>16.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              {dynamicData.consumerName} Payment Security


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>The {dynamicData.consumerName} shall, before the agreed date for commencement of power supply by the Generator, shall issue an automatically revolving unconditional Bank Guarantee (<strong>BG</strong>) or an auto reinstating confirmed Letter of Credit (<strong>LC</strong>) of value for an amount equivalent to {dynamicData.payment_security_day} days of Expected Revenue. The said BG/ LC shall be valid for an initial period of 5 years extendable further in blocks of 5 years cumulating 25 years in total. BG/LC shall be in a form approved by the Generator and with a qualifying bank.</p>
              <p>The circumstances in which the BG can be called will be set out in the PPA.</p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>17.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Events of Default

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>For the {dynamicData.consumerName} these will include: exiting during the Lock-In Period, failure to pay, failure to take its Annual Contracted Electrical Output, failure to maintain payment security, assignment, insolvency,
                <p style={{ marginTop: '30px' }}>in case the Project loses captive status on account of reasons attributable to the captive Consumer.</p></p>
              <br />
              <p>In case of termination of the PPA the SSHA will automatically terminate.</p>
              <p>The Generator may terminate the PPA in case of {dynamicData.consumerName} event of default. The price payable on such termination needs to be considered against (i) the fact that the defaulting {dynamicData.consumerName} may be obliged to transfer its shares (ii) the fact that the event may also result in the Captive Project failing to obtain its Captive Status in that year and hence a loss to other {dynamicData.consumerName}.</p>
              <p>Further, consequences of termination of Equity Documents will be applicable.</p>
              <p>The Generator shall be in default where it is finally determined by a competent authority, that the Project has not in any Financial Year complied with the Group Captive Rules due to reasons solely attributable to the Generator. In such a scenario the PPA shall not be terminable but the Generator shall be liable for payment of cross subsidy surcharge, and any other applicable charges.</p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>18.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Change in Law
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>The {dynamicData.consumerName} and the Generator shall attempt to reflect any Change of
                Law within the PPA so that the balance of responsibilities, obligations and
                value is maintained.</p>
              <p>Change in Law will be more specifically defined in the PPA but shall broadly
                include change in taxes, cess, duties, levies, charges, circular, office
                memorandum, any law or interpretation thereof applicable on the
                date of
                signing the PPA, which directly or indirectly impacts the Project or cost of
                generation or supply of electricity from the Project.</p>
              <p>There shall be no termination right as a consequence of a Change in Law.
                The principle for relief on account of Change in Law will be to put the Parties
                in the same financial position as they would have been, had such change in
                law not taken place.</p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>19.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Operation of the Project

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              The Generator shall operate and maintain the Project to the standards expected of a reasonable and prudent operator.
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>20.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Force Majeure

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>"<strong>Force Majeure Event</strong>" includes but is not limited to an event or circumstance that:</p>
              <ol>
                <li>(a) is caused by an event or circumstance beyond the reasonable control of the Party whose performance is affected (the "<strong>Affected Party</strong>"); and</li>
                <li>(b) could not have been avoided or corrected through the exercise of reasonable diligence Non-availability of open access or its requirement for consumption in electricity or a dip in demand for electricity by {dynamicData.consumerName} will not be treated as a Force Majeure Event.</li>
              </ol>
              <p>In case of Force Majeure event, the Affected Party shall notify said situation, its cause and possible duration, in writing to the other Party. The Affected Party shall continue to perform its obligations pursuant to the fullest extent possible and shall seek alternative methods of performance for compliance with its obligations. A Force Majeure event will not exempt the Parties from any payment obligations.</p>
              <p className='page-break' style={{ marginTop: '40px' }}>The Generator shall be entitled to relief for a Force Majeure event affecting its obligations in respect of the Project.</p>
              <p>Prolonged Force Majeure shall not give rise to any termination event.<sup>4</sup></p>

            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>21.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>


              Assignment or transfer



            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Assignment or transfer
              Not permitted without the other party’s consent (not to be unreasonably withheld or delayed). Provisions regarding when it is reasonable or unreasonable to be included. the Generator has the right to transfer its rights under the PPA by way of security to any bank or financial institution providing it with financing.


            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>22.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Direct Agreement

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              There will be an obligation on the {dynamicData.consumerName} to enter into a standard form of Direct Agreement with funding institutions if required.
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>23.</td>
            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
              Governing Law and Jurisdiction

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>Governing law shall be under the Laws of India.</p>
              <p><strong>Dispute Resolution:</strong> Any dispute between the parties will be resolved in accordance with the laws of the Republic of India, in the following hierarchical manner:</p>
              <ol>
                <li>All matters (including technical matters) escalated to senior representatives of the Parties.</li>
                <li>Expert determination for technical disputes. Unless specified otherwise the Expert's decision shall be [binding / non-binding].</li>
                <li>Arbitration. The award passed by the arbitral tribunal will be binding.</li>
              </ol>
            </td>
          </tr>


        </tbody>
      </table>

      <br />
      <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '400px' }}>Part 2: Equity Investment to be done by way of Equity Subscription</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>No.</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Particulars</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Details</th>
          </tr>
        </thead>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Parties</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            a)  Special purpose limited liability company to be incorporated by <br />
            <span style={{ marginLeft: '20px' }}> <b>{dynamicData.generator}</b> (Generator); </span><br />
            b) <b>{dynamicData.generator}</b>; and<br />
            c) {dynamicData.consumerName}.<br />
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Funding Overview</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>

            <br />    <p><b>{dynamicData.generator}</b>  will subscribe to up to 74% of the equity share capital of the Generator, and the <b>{dynamicData.consumerName}(s)</b> will subscribe to at least 26%of the equity share capital of the Generator, in proportions to be more particularly set out in the Transaction Documents.
            </p>
            <p>In the event of multiple {dynamicData.consumerName}, their inter-se equity shareholding proportion will be determined in accordance with the applicable regulations on the basis of their energy needs. </p>
            <p><b>{dynamicData.generator}</b> will fund, or procure (in part or full) the debt component of the funding requirement by way of a secured term loan or such other debt instruments as it may solely determine.  To the extent hedging is required for any foreign exchange exposure then <b>{dynamicData.generator}</b> will procure such hedging. If {'<Generator>'} provides funding then it will be on arm’s length basis and as commercially agreed.</p>
            <p>The debt funding will be secured and the security will include, but not limited to, security on Project assets, receivables and any credit support as may be required from the <b>{dynamicData.consumerName}(s)</b>.</p>
          </td>
        </tr>

        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
            Obligation to fund cost overruns
          </td>

          <td style={{ border: '1px solid black', padding: '8px' }}>
            The Parties agree that, as the Project progresses, there could be a change in the capital expenditure required for developing the Project, which may result in the contingency amount being used, and therefore requiring an increase in the Project budget.  The Parties agree to finance the Generator as shareholders for such cost overrun through shareholder loan or in such
            <p>other manner as may be reasonably required without the need for any
              <p> further capital infusion by the <b>{dynamicData.consumerName}(s)</b>.</p></p>
            <br />
          </td>
        </tr>

        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Funding process</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            <p>Upon incorporation, <b>{dynamicData.generator}</b> will subscribe to equity shares of the Generator to fund the equity component of the development costs of the Project.</p>
            <p>Thereafter, in the first instance, <b>{dynamicData.generator}</b> (if required) and the <b>{dynamicData.consumerName}(s)</b> will fund the Generator (which funding amount will not be less than 50% of the equity commitment) through subscription of equity shares. </p>
            <p>Thereafter, the Generator will make calls on its shareholders pro rata to their shareholding to subscribe to additional equity shares, and [draw down requests under the term loan agreement executed with <b>{dynamicData.generator}</b> in line with the needs of the Project, and in such proportions so that the required gearing ratio is met.</p>

            <p>The funding process will be detailed further in the Transaction Documents. </p><br />
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Subscription price</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            The detailed conditions shall be set out in the Transaction Documents, but shall demonstrate that the Project is shovel ready. The conditions will also include fulfilment of all compliances required under applicable law.              <br />
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Conditions to initial  subscription</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            The detailed conditions shall be set out in the Transaction Documents, but shall demonstrate that the Project is shovel ready. The conditions will also include fulfilment of all compliances required under applicable law              b) <b>{dynamicData.generator}</b>; and<br />
            <br />
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Conditions for subsequent subscriptions</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            For the remainder of the equity commitment, a notice from the <b>{dynamicData.generator}</b> to [the relevant shareholder] requesting additional subscription for shares.  Such notice to subscribe must be served on each of the relevant shareholder and the amount requested must be pro-rata to their overall shareholding. Upon receipt of such a capital call notice, each relevant shareholder will be under an obligation to fund the <b>{dynamicData.generator}</b> through subscribing to additional equity shares. Suitable evidence of the funding requirement will be provided by the Generator.
            The conditions will also include fulfilment of all compliances required under applicable law
            <br />
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Failure to achieve COD by the Long Stop Date</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            This shall be suitably addressed in PPA
            <br />
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}></td>
          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>Dispute Resolution Mechanisms</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            Any dispute between the parties will be resolved in accordance with the laws of the Republic of India, in the following hierarchical manner:
            Escalation to [SVPs] of the parties.
            If the dispute is on whether amounts have been properly incurred, then the matter will be referred   to a project manager. The opinion of the project manager will be binding.
            Arbitration. The award passed by the arbitral tribunal will be binding.

            <br />
          </td>
        </tr>
        <tbody>

        </tbody>
      </table>

      Confidential Document......................................................................................................................
    </div>

  </div>
);

const AgreementModal = ({ visible, onClose, data }) => {
  // console.log(data);
  const consumer = data?.consumer;
  const consumer_state = data?.consumer_state;
  const generator = data?.generator;
  const ess = data?.ess ? parseFloat(data.ess).toFixed(2) : "0.00";
  const wind = data?.wind ? parseFloat(data.wind).toFixed(2) : '0.00';
  const solar = data?.solar ? parseFloat(data.solar).toFixed(2) : '0.00';
  const generator_state = data?.generator_state;
  const lock_in_period = data?.lock_in_period;
  const minimum_generation_obligation = data?.minimum_generation_obligation;
  const payment_security_day = data?.payment_security_day;
  const tariff_finalized = data?.offer_tariff
  const term_of_ppa = data?.term_of_ppa;
  const voltage_level_of_generation = data?.voltage_level_of_generation;


  let generator_state_obj;
  try {
    // Check if generator_state is valid JSON
    generator_state_obj = JSON.parse(generator_state.replace(/'/g, '"'));
  } catch (error) {
    // If not JSON, treat it as a plain string
    //  console.warn("generator_state is not valid JSON, treating it as a plain string:", generator_state);
    generator_state_obj = { default: generator_state };
  }

  const solarState = Object.entries(generator_state_obj)
    .find(([key]) => key.toLowerCase().includes("solar"))?.[1] || generator_state;

  const dynamicData = {
    generatorName: generator,
    project: generator_state,
    solarState: solarState,
    projectSite: generator_state,
    // capacity: '100',
    tariff: tariff_finalized,
    // contractPeriod: '25',
    consumerName: consumer,
    consumer_state: consumer_state,
    generator: generator,
    generator_state: generator_state,
    lockInPeriod: lock_in_period,
    minimum_generation_obligation: minimum_generation_obligation,
    payment_security_day: payment_security_day,
    tariff_finalized: tariff_finalized,
    term_of_ppa: term_of_ppa,
    voltage_level_of_generation: voltage_level_of_generation,
    ess: ess,
    wind: wind,
    solar: solar
  };


  // Generate PDF from the component
  const generatePdf = () => {
    const contentHtml = ReactDOMServer.renderToStaticMarkup(<AgreementContent dynamicData={dynamicData} />);

    // Create a temporary div, append the content, then generate the PDF
    const element = document.createElement('div');
    element.innerHTML = contentHtml;

    html2pdf()
      .set({
        margin: 15,
        filename: 'TermSheet.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // Ensure text is not rendered as an image
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'css', before: '.page-break' }, // Add page breaks
      })
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setDrawColor(0, 0, 0); // Set border color
          pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10); // Add border
          pdf.setFontSize(10);
          pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10); // Add page number
        }
      })
      .save();
  };


  return (
    <Modal
      title="Term Sheet Agreement"
      open={visible}
      width={900}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Close</Button>,
        <Button key="generate" type="primary" onClick={generatePdf}>Generate PDF</Button>,
      ]}
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <AgreementContent dynamicData={dynamicData} />
      </div>
    </Modal>
  );
};

export default AgreementModal;
