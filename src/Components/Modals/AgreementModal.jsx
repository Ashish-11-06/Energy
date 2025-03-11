import React from 'react';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { Modal, Button } from 'antd';

// Reusable AgreementContent Component
const AgreementContent = ({ dynamicData }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', lineHeight: 1.5 }}>
      <h3 style={{ margin: 0 }}>Terms Sheet (Terms)</h3>
      <p style={{ margin: '5px 0' }}>for Renewable Power Plant between</p>
      <p style={{ margin: '5px 0' }}> {dynamicData.generatorName} and {dynamicData.consumerName},</p>
      <p style={{ margin: '5px 0' }}>under Open Access Captive Mechanism</p>
      <p style={{ margin: '5px 0' }}>in &lt;Consumer State&gt;</p>
      <p style={{ margin: '5px 0' }}>(the “Proposed Transaction”)</p>

      <hr style={{ width: '50px', margin: '10px auto', border: '1px solid black' }} />

      <p style={{ margin: '10px 0' }}>
        <span style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>XXX</span> MW Solar,
        <span style={{ fontWeight: 'bold' }}>XXX MW Wind</span> and
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>XXX MWh ESS</span> capacity
      </p>
    </div>

    {/* ................................................ */}

    {/* <h1>Term Sheet Agreement</h1>
    <p><strong>Generator Name:</strong> {dynamicData.generatorName}</p>
    <p><strong>Consumer Name:</strong> {dynamicData.consumerName}</p>
    <p><strong>Project Site:</strong> {dynamicData.projectSite}</p>
    <p><strong>Capacity:</strong> {dynamicData.capacity} MW</p>
    <p><strong>Tariff:</strong> {dynamicData.tariff} INR/kWh</p>
    <p><strong>Contract Period:</strong> {dynamicData.contractPeriod} years</p>
    <p><strong>Lock-in Period:</strong> {dynamicData.lockInPeriod} years</p> */}


    <p className='page-break'>XXX,</p>
    <p>Insert details of its registered office <br /> ("Captive User")</p>

    <div style={{ textAlign: 'right' }}>
      Date: {new Date().toLocaleDateString()}
    </div>

    <h3><strong>Indicative Heads of Terms for Open Access Captive Solar Project in {dynamicData.projectSite}</strong></h3>

    <p>Dear {dynamicData.userName || 'user'} </p>

    <p>Please find enclosed outline terms for the open access captive renewable project <div></div>
      ("Project") situated at [_], &lt;Generator State&gt;, India ("Project Site").</p>

    <strong><p>1. Content of these heads of terms</p></strong>

    <p>1.1. The outline terms for the Proposed Transaction are set out in the Annexures and cover:</p>
    <div style={{ marginLeft: '25px' }}>
      <p>a) the term sheet for the power consumption agreement is set out in Part 1 of the Annex;</p>
      <p>b) the term sheet for the equity commitment is set out in Part 2 of the Annex; and</p>
      <p>c) the shareholding arrangements are set out in Part 3 of the Annex.</p>
      <p>The Proposed Transaction remains subject to satisfactory due diligence by &lt;Generator&gt;, and to the agreement and signature by all relevant Captive User(s) of all legally binding agreements (the "Transaction Documents").</p>
    </div>

    
    <p>1.2. These heads of terms in the annexes ("Terms") are not exhaustive nor are they intended to be legally binding between &lt;Generator&gt; and the Captive User(s).¹ The Transaction Documents will contain more detailed terms and conditions on the rights, obligations and responsibilities of the parties, along with customary representations and warranties and indemnities.</p>

    <p class="section-title"><strong>2. Exclusivity</strong></p>
    <p >2.1. The definitions in this Paragraph 2.1 apply in this Paragraph 2:</p>
    <div style={{ marginLeft: '25px' }}>
    <p><b>Exclusivity Period:</b> The period commencing on the date of execution of the Terms, and ending at the earlier of: (a) the execution of the last of the Transaction Documents; or (b) on the date falling 150 days after the date of execution of the.</p>
    <p>Terms; or (c) other such date to be agreed between &lt;Generator&gt; and the Captive User(s) in writing:</p>
    <p><strong>Restricted Activity:</strong> Negotiations in relation to power procurement activities through open access, captive or through power exchange. This does not include any existing transactions for which contracts have been executed prior to the execution of the Terms;</p>
    <p><strong>Third Party:</strong> Any person other than &lt;Generator&gt; (or any of their respective officers, employees, agents or advisers);</p>
    <p><strong>Third Party Negotiations:</strong> Any discussions or negotiations between a Third Party and the Captive User(s) or the Captive User's group, or any of its respective officers, employees, agents or advisers, relating to or otherwise concerning a Restricted Activity.</p>

    </div>
    {/* ================================================================================================================================================ */}

    <p className='page-break'><strong>2.2.</strong> The Captive User(s) agrees that for the duration of the Exclusivity Period, it will discuss and negotiate the Proposed Transaction with &lt;Generator&gt; on an exclusive basis. The Captive User(s) undertakes that for the duration of the Exclusivity Period, it will not (and will procure that no member of its group, nor any of their respective officers, employees, agents or advisers), directly or indirectly continue, enter into, re-start, solicit, initiate, respond to any inquiries, consider or participate in any Third Party Negotiations, in any manner whatsoever.</p>
    <p>2.3. On executing the Terms, the Captive User(s) will immediately terminate, or procure the termination of, any Third Party Negotiations taking place.</p>
    <p> <b>3. Undertakings</b></p>
    <div style={{marginLeft: '25px'}}>
    <p>3.1. Based on the Captive User's exclusivity undertakings (as set out in paragraph 2 above), &lt;Generator&gt; is committing costs and time to develop the Project at the Project Site through the feasibility stage. During the Exclusivity Period, &lt;Generator&gt; will use its reasonable endeavours to proceed with and develop the Project at the Project Site.</p>
    <p>3.2. For the purposes of operating the Project, an application for connectivity to the grid is required to be submitted to the DISCOM (Grid Application). The Parties agree that &lt;Generator&gt; will make such an application, and the Captive User(s) will provide necessary co-operation to <strong>&lt;Generator&gt;</strong> in procuring and maintaining the open access approval. </p>
    <p>3.3. The Captive User(s) undertakes to execute a consent letter addressed to the DISCOM (and any other documents as &lt;Generator&gt;may require) in the form required by &lt;Generator&gt;  </p>
    <p>3.4. In connection with the Grid Application, &lt;Generator&gt; shall be solely responsible for all fees and costs of such Grid Application.</p>
    <p>3.5. &lt;Generator&gt; shall, at appropriate intervals, keep the Captive User(s) and the EXG Global reasonably informed of the status of the development of the Project, status of other Captive User(s) and any other information reasonably required for the purposes of the Project.</p>
    <p>3.6. The Captive User(s) agrees to provide &lt;Generator&gt; such information as &lt;Generator&gt; may request related to the Proposed Transaction, including but not limited to any information to enable &lt;Generator&gt; to carry out due diligence on the Captive User(s) and/or its group. The Captive User(s) shall respond to any request by &lt;Generator&gt; under this paragraph as soon as reasonably practicable.</p>
    <p>3.7. The parties undertake to use their best endeavours to negotiate the Transaction Documents in good faith based on the Terms.    </p>
    <p>3.8. The parties undertake to use their best endeavours to conclude and enter into the Transaction Documents (and all ancillary documents) prior to the expiry of the Exclusivity Period.</p>
   </div>
    <p><strong>4. Termination</strong></p>

    <p><strong>4.1.</strong>
      <p></p>Neither party may terminate the Terms prior to the expiry of the Exclusivity
      Period, provided however, &lt;Generator&gt; may terminate this arrangement in
      the following circumstances, by giving a reasonable notice to the Captive
      User(s):
      <br />
      a) where the parameters make the investment non-viable for &lt;Generator&gt;,
      as determined solely by &lt;Generator&gt;;
      <br />
      b) where the Captive User(s) fails to comply with its obligations under the
      Terms, including, without limitation, its obligations in respect of
      exclusivity, confidentiality, assisting &lt;Generator&gt; with the Grid
      Application, and obligation to negotiate and conclude the Transaction
      Documents in good faith; and
      <br />
      where the Captive User(s) fails to pass &lt;Generator&gt;’s due diligence relating to compliance and business ethics, as determined solely by &lt;Generator&gt;.
    </p>

    <p><strong>4.2.</strong>The termination by &lt;Generator&gt; of the Terms, in accordance with paragraph 4.1 above, shall be without any liability for &lt;Generator&gt; , &lt;Consumer&gt; and EXG Global. </p>

    <p><strong>5. Confidentiality</strong></p>
    <p><strong>5.1. </strong>The Terms and all negotiations and information shared between the parties with respect to the Proposed Transaction are confidential and terms of the confidentiality undertaking entered into by the Parties shall apply.</p>
    {/* <p><strong>5</strong>Confidentiality</p>
    <p><strong>5</strong>Confidentiality</p>
    <p><strong>5</strong>Confidentiality</p> */}
    {/* next page.... */}

    <p><strong>6. Costs</strong></p>
    <p><strong>6.1. </strong>Each party shall pay its own costs incurred in connection with the Terms, the Transaction Documents and any documents contemplated by them, whether or not the Proposed Transaction proceeds.     </p>

    <p><strong>7. Governing law</strong></p>
    <p><strong>7.1 </strong>The Terms shall be governed by and construed in accordance with the law of India. Any claims or disputes arising out of or in connection with the Terms, will be referred to and finally resolved by arbitration in accordance with the (Indian) Arbitration and Conciliation Act, 1996. Each Party will appoint an arbitrator. The two arbitrators so appointed will appoint the third arbitrator. </p>
   
    <div>
      <h3>3.3.</h3>
      <p>The Captive User(s) undertakes to execute a consent letter addressed to the DISCOM (and any other documents as &lt;Generator&gt; may require) in the form required by &lt;Generator&gt;.</p>

      <h3>3.4.</h3>
      <p>In connection with the Grid Application, &lt;Generator&gt; shall be solely responsible for all fees and costs of such Grid Application.</p>

      <h3>3.5.</h3>
      <p>&lt;Generator&gt; shall, at appropriate intervals, keep the Captive User(s) and the EXG Global reasonably informed of the status of the development of the Project, status of other Captive User(s) and any other information reasonably required for the purposes of the Project.</p>

      <h3>3.6.</h3>
      <p>The Captive User(s) agrees to provide &lt;Generator&gt; such information as &lt;Generator&gt; may request related to the Proposed Transaction, including but not limited to any information to enable &lt;Generator&gt; to carry out due diligence on the Captive User(s) and/or its group. The Captive User(s) shall respond to any request by &lt;Generator&gt; under this paragraph as soon as reasonably practicable.</p>

      <h3>3.7.</h3>
      <p>The parties undertake to use their best endeavours to negotiate the Transaction Documents in good faith based on the Terms.</p>

      <h3>3.8.</h3>
      <p>The parties undertake to use their best endeavours to conclude and enter into the Transaction Documents (and all ancillary documents) prior to the expiry of the Exclusivity Period.</p>

      <h2>4. Termination</h2>

      <h3>4.1.</h3>
      <p>Neither party may terminate the Terms prior to the expiry of the Exclusivity Period, provided however, &lt;Generator&gt; may terminate this arrangement in the following circumstances, by giving a reasonable notice to the Captive User(s):</p>

      <ol type="a">
        <li>where the parameters make the investment non-viable for &lt;Generator&gt;, as determined solely by &lt;Generator&gt;;</li>
        <li>where the Captive User(s) fails to comply with its obligations under the Terms, including, without limitation, its obligations in respect of exclusivity, confidentiality, assisting &lt;Generator&gt; with the Grid Application, and obligation to negotiate and conclude the Transaction Documents in good faith; and</li>
        <li>where the Captive User(s) fails to pass &lt;Generator&gt;'s due diligence relating to compliance and business ethics, as determined solely by &lt;Generator&gt;.</li>
      </ol>
    </div>

    <h3>4.2.</h3>
    <p>The termination by &lt;Generator&gt; of the Terms, in accordance with paragraph 4.1 above, shall be without any liability for &lt;Generator&gt;, &lt;Consumer&gt; and EXG Global.</p>

    <h2>5. Confidentiality</h2>
    <h3>5.1.</h3>
    <p>The Terms and all negotiations and information shared between the parties with respect to the Proposed Transaction are confidential and terms of the confidentiality undertaking entered into by the Parties shall apply.</p>

    <h2>6. Costs</h2>
    <h3>6.1.</h3>
    <p>Each party shall pay its own costs incurred in connection with the Terms, the Transaction Documents and any documents contemplated by them, whether or not the Proposed Transaction proceeds.</p>

    <h2>7. Governing law</h2>
    <h3>7.1.</h3>
    <p>The Terms shall be governed by and construed in accordance with the law of India. Any claims or disputes arising out of or in connection with the Terms, will be referred to and finally resolved by arbitration in accordance with the (Indian) Arbitration and Conciliation Act, 1996. Each Party will appoint an arbitrator. The two arbitrators so appointed will appoint the third arbitrator.</p>

    <p>Please sign and return the enclosed copy of the Terms to confirm your agreement.</p>

    <p>Yours faithfully.</p>

    {/* <br><br><br> */}<div></div>

    <p>For and on behalf of [&lt;Generator&gt;]</p>

    {/* <br><br><br> */}<div></div>

    <p>For and on behalf of [Captive User]</p>

    {/* <br><br><br> */}<div></div>

    <p>For and on behalf of [EXG Global]</p>

    {/* next page..... */}

    <div>
      <h2>Part 1: Heads of Terms of Power Purchase Agreement (PPA)</h2>

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
            <td style={{ border: '1px solid black', padding: '8px' }}>1.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>Parties</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              a) SPV (Generator); and<br />
              b) Captive User.<br />
              Each Captive User will have its own PPA with the Generator.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>2.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>Pre-Construction Period</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              From the signing date and during the Pre-Construction Period:<br />
              (i) the Captive User will:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;a. secure board approvals and all other internal approvals with respect to the Proposed Transaction; <b>and</b><br />
              &nbsp;&nbsp;&nbsp;&nbsp;b. enter into the share subscription agreement and shareholders’ agreement ("<b>Equity Documents</b>") and infuse the required investment as per the Equity Documents;<br />
              (ii) The Generator shall:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;a. secure board approvals and all other internal approvals with respect to the Proposed Transaction;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;b. execute engineering, procurement and construction contracts for construction of the Project;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;c. achieve financial closure for financing the Project;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;d. obtain the land for developing the Project;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;e. obtain all approvals required by law for the purpose of developing the Project and supplying power under the Proposed Transaction.<br />
              Inform EXG Global and Captive User of the status of different approvals.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>3.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>Construction Period</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              During the Construction Period the Parties shall do the following:
              the Generator shall:
              <br />

              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp;   (a)inform the Captive User and EXG Global of the indicative programme of works in respect of the Project, identifying the timing of the on-site works, energisation of the Injection Point and the anticipated Commercial Operations Date and shall update on any material changes to the programme;

              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp;  (b)enter into/ submit such documents as may be required (including appropriate wheeling and banking agreements, grid tie-up arrangements or connectivity and open access approval in respect of the Project); and
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp;   (c) construct the Project and energise the Injection Point.

              <div></div>  The Captive User shall:
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp; (a) to the extent not already done, take steps to install (at its own cost) and commission in accordance with any relevant requirements an appropriate meter and such other infrastructure required by the Captive User for off-taking power from the Project; and
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp; (b) provide such assistance as is required in respect of the application and entering into of the wheeling and banking agreements; and
              <div></div>  &nbsp;&nbsp;&nbsp;&nbsp; (c) enter into such undertakings, provide such evidence and documents as may be require to enable the Project to obtain connectivity and open access and status of Group Captive Project

            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>4.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Commissioning
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>

              <p>
                Subject to the Captive Users complying with their obligations under the PPAs and Equity Documents, the Generator will use its best efforts to construct the Project and commence supply of power from the Project within <strong>&lt;COD&gt;</strong> (Anticipated COD).
              </p>
              <p>
                Where the commencement of Power Supply is delayed for whatever reason, the Generator shall use its best endeavours to obtain an extension of the connection approval. The Anticipated COD shall be deemed extended due to delays in procuring government approvals, or any other delay which is not attributable or beyond the reasonable control of the Generator.
              </p>
              <p>
                In case of non-commencement of power supply by the Anticipated COD, on account of reasons solely attributable to the Generator, the Generator will endeavour to provide power equivalent to contract capacity at the same tariff from other sources (i.e., IEX, other generators etc).
              </p>
              <p>
                The Captive User will be entitled to terminate the PPA if the Project does not commence its power supply by the date falling 6 months after the Anticipated COD for reasons solely attributable to the Generator. The consequences of such termination, including the compensation, if any, shall be dealt with in the Shareholders Agreement/PPA.
              </p> </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>5.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Contract Period & Lock-In
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The contract period and lock-in period should be mutually agreed and reflected in the PPA.
              </p>
              <p>
                <strong>&lt;Term of PPA&gt;</strong> years from the date of commencement of supply of the power in case long-term open access has been procured [as set out in the Wheeling Agreement]. The minimum Lock-in period binding the Parties is <strong>&lt;Lock in period&gt;</strong> years from the date of commencement of supply of power.
              </p>
              <p>
                Either Party may terminate the PPA by providing one year (12 months) notice period to the other party after completion of <strong>&lt;Lock in period&gt; -1</strong> years from the date of commencement of supply of power such that the Lock-in period of <strong>&lt;Lock in period&gt;</strong> years is maintained by either Party. Any such termination of PPA will also result in termination of the Equity Documents vis-à-vis such Captive User, to exit its role as a Shareholder.
              </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>6.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Contracted Capacity and Contracted Electrical Output
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                A group captive capacity of <strong>XXX MW</strong> Solar capacity, <strong>XXX MW</strong> of Wind Capacity, and <strong>XXX MWh</strong> of ESS shall be allocated in the Project to the Captive User (“Contracted Capacity”).
              </p>
              <p>
                The Captive User shall offtake its proportion of the energy generated by the Project in each Financial Year (Aggregate Contracted Electrical Output). In each month, the Captive User shall, unless instructed otherwise by the Generator, offtake its proportion of the energy generated by the Project in that month (Monthly Contracted Electrical Output).
              </p>
              <p>
                The Generator has the right to instruct and bill different Monthly Contracted Electrical Outputs for a Captive User in a month where:
              </p>
              <ul>
                <li>The Captive Users have agreed with the Generator that different proportions apply between themselves for that month; and</li>
                <li>It is required to ensure the Aggregate Contracted Electrical Output is achieved.</li>
              </ul>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>6.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Reference Annual Energy Generation
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The Contracted Capacity is expected to generate a minimum <strong>&lt;Minimum generation obligation&gt;</strong> on generation. Further details will be detailed out in the PPA.
              </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>8.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Forecast, Maintenance, outages and availability


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The Generator shall provide the Captive User(s) with monthly output forecasts, maintenance planning and forced outage data.   </p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>9.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Imbalance


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                The Generator will assume imbalance risks and costs related to the generation.
              </p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>10.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Injection Point and With Drawl Point and Voltage




            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                <p>
                  <strong>Injection Point:</strong> The Injection Point of the power will be at the Project’s Meter on the Project Switchyard and at <strong>&lt;Generator State&gt;</strong> for Solar, <strong>&lt;Generator State&gt;</strong> for Wind, and <strong>&lt;Generator State&gt;</strong> for ESS.
                </p>
                <p>
                  <strong>Withdrawal Point:</strong> The Withdrawal Point of power for Captive User shall be at their respective ABT Meter.
                </p>
              </p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>11.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Metering and Monitoring System

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                <p>
                  <strong>Metering:</strong> Metering will be done at the Injection Point (Project switchyard) & substation at <strong>&lt;Voltage level of Generation&gt;</strong> kV level.
                </p>
                <p>
                  <strong>Billing:</strong> Billing will be as per Project plant switchyard ABT meter.
                </p>        </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>12.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Tariffs


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                Bill for Monthly Contracted Electrical Output from the Project will be <strong>Tariff finalized INR /kWh</strong> till completion of the Project.
              </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>13.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Taxes / Duties and Similar

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>
                All the charges & losses related to Open Access, Wheeling, Transmission, Banking of Power, Transmission line, Surcharges and any other charges levied beyond the Injection point shall be borne by the Captive Users in the proportion of their power consumption and shall be payable by the Captive User directly to the relevant governmental authority or shall be billed by the Generator as part of the monthly bill.  </p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>14.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Billing and Payment

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>Any additional charges, taxes, cess, duty etc. levied by any regulatory / statutory authorities from time to time shall be in addition to the Tariff and shall be payable by the Captive User directly or shall be billed by the Generator as part of the monthly bill.</p>
            </td>
          </tr>



          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>15.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Metering and Monitoring System

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>The Generator shall not have any responsibility to reconcile a Customer’s energy bills, with the generation from the Project.</p>
              <p>Bills will be raised on monthly basis and payable within 30 days (“Due Date”), beyond which late payment surcharge will be payable by the Captive User. In case of failure to make full payment with 15 days beyond the Due Date, the Generator may invoke the payment security.</p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>16.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Captive User Payment Security


            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>The Captive User shall, before the agreed date for commencement of power supply by the Generator, shall issue an automatically revolving unconditional Bank Guarantee (BG) or an auto reinstating confirmed Letter of Credit (LC) of value for an amount equivalent to &lt;Payment Security days&gt; days of Expected Revenue. The said BG/ LC shall be valid for an initial period of 5 years extendable further in blocks of 5 years cumulating 25 years in total. BG/LC shall be in a form approved by the Generator and with a qualifying bank.</p>
              <p>The circumstances in which the BG can be called will be set out in the PPA.</p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>17.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Events of Default

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>For the Captive User these will include: exiting during the Lock-In Period, failure to pay, failure to take its Annual Contracted Electrical Output, failure to maintain payment security, assignment, insolvency, in case the Project loses captive status on account of reasons attributable to the captive Consumer.</p>
              <p>In case of termination of the PPA the SSHA will automatically terminate.</p>
              <p>The Generator may terminate the PPA in case of Captive User event of default. The price payable on such termination needs to be considered against (i) the fact that the defaulting Captive User may be obliged to transfer its shares (ii) the fact that the event may also result in the Captive Project failing to obtain its Captive Status in that year and hence a loss to other Captive Users.</p>
              <p>Further, consequences of termination of Equity Documents will be applicable.</p>
              <p>The Generator shall be in default where it is finally determined by a competent authority, that the Project has not in any Financial Year complied with the Group Captive Rules due to reasons solely attributable to the Generator. In such a scenario the PPA shall not be terminable but the Generator shall be liable for payment of cross subsidy surcharge, and any other applicable charges.</p>
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>18.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Change in Law
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>The Captive User and the Generator shall attempt to reflect any Change of
                Law within the PPA so that the balance of responsibilities, obligations and
                value is maintained.</p>
              <p>Change in Law will be more specifically defined in the PPA but shall broadly
                include change in taxes, cess, duties, levies, charges, circular, office
                memorandum, any law or interpretation thereof applicable on the date of
                signing the PPA, which directly or indirectly impacts the Project or cost of
                generation or supply of electricity from the Project.</p>
              <p>There shall be no termination right as a consequence of a Change in Law.
                The principle for relief on account of Change in Law will be to put the Parties
                in the same financial position as they would have been, had such change in
                law not taken place.</p>
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>19.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Operation of the Project

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              The Generator shall operate and maintain the Project to the standards expected of a reasonable and prudent operator.
            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>20.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Force Majeure

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <p>"Force Majeure Event" includes but is not limited to an event or circumstance that:</p>
              <ol>
                <li>(a) is caused by an event or circumstance beyond the reasonable control of the Party whose performance is affected (the "Affected Party"); and</li>
                <li>(b) could not have been avoided or corrected through the exercise of reasonable diligence Non-availability of open access or its requirement for consumption in electricity or a dip in demand for electricity by captive user will not be treated as a Force Majeure Event.</li>
              </ol>
              <p>In case of Force Majeure event, the Affected Party shall notify said situation, its cause and possible duration, in writing to the other Party. The Affected Party shall continue to perform its obligations pursuant to the fullest extent possible and shall seek alternative methods of performance for compliance with its obligations. A Force Majeure event will not exempt the Parties from any payment obligations.</p>
              <p>The Generator shall be entitled to relief for a Force Majeure event affecting its obligations in respect of the Project.</p>
              <p>Prolonged Force Majeure shall not give rise to any termination event.<sup>4</sup></p>

            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>21.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>


              Assignment or transfer



            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Assignment or transfer
              Not permitted without the other party’s consent (not to be unreasonably withheld or delayed). Provisions regarding when it is reasonable or unreasonable to be included. the Generator has the right to transfer its rights under the PPA by way of security to any bank or financial institution providing it with financing.


            </td>
          </tr>


          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>22.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              Direct Agreement

            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              There will be an obligation on the Captive User to enter into a standard form of Direct Agreement with funding institutions if required.
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>23.</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
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
      Confidential Document......................................................................................................................
    </div>

  </div>
);

const AgreementModal = ({ visible, onClose }) => {
  const dynamicData = {
    generatorName: 'Solar Power Inc.',
    consumerName: 'Green Energy Corp.',
    projectSite: 'Tamil Nadu, India',
    capacity: '100',
    tariff: '4.5',
    contractPeriod: '25',
    lockInPeriod: '5',
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
