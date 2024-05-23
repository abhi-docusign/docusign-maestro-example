// HomeScreen.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeScreen() {
  // const [rName, setRName] = useState('');
  // const [rEmail, setREmail] = useState('');
  // const [dName, setDName] = useState('');
  // const [dEmail, setDEmail] = useState('');
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [workflowInstances, setWorkflowInstances] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedRow, setExpandedRow] = useState();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // If access token is empty, redirect to Auth page
      navigate('/');
    }
    handleButtonClick()
  }, [navigate]);

  const handleRowClick = (id, workflowId) => {
    if (id === expandedRow) { setExpandedRow(-1) }
    else {
      getWorkflowInstances(workflowId).then(
        () => setExpandedRow(id)
      );
    }
  };

  const logout = () => {
    localStorage.clear();
        navigate('/');
  };

  const handleButtonClick = async () => {
    try {
      const accountId = localStorage.getItem('accountId');

      const response = await axios.get(
        `https://demo.services.docusign.net/aow-manage/v1.0/management/accounts/${accountId}/workflowDefinitions`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status > 299) {
        localStorage.clear();
        navigate('/');
      }
      setWorkflows(response.data?.value);
    } catch (error) {
      setError('Failed');
    }
  };

  const handleInstanceCancel = async (instanceId) => {
    try {
      const accountId = localStorage.getItem('accountId');

      const response = await axios.post(
        `https://demo.services.docusign.net/aow-manage/v1.0/management/accounts/${accountId}/instances/${instanceId}/cancel`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status > 299) {
        localStorage.clear();
        navigate('/');
      }
      setWorkflows(response.data?.value);
    } catch (error) {
      setError('Failed');
    }
  };

  const getWorkflowInstances = async (workflowDefinitionId) => {
    try {
      const accountId = localStorage.getItem('accountId');

      const response = await axios.get(
        `https://demo.services.docusign.net/aow-manage/v1.0/management/accounts/${accountId}/workflowDefinitions/${workflowDefinitionId}/instances`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setWorkflowInstances(response.data);
      if (response.status > 299) {
        localStorage.clear();
        navigate('/');
      }
    } catch (error) {
      setError('Failed');
    }
  }

  // const handleRNameChange = (e) => {
  //   setRName(e.target.value);
  // };

  // const handleREmailChange = (e) => {
  //   setREmail(e.target.value);
  // };

  // const handleDNameChange = (e) => {
  //   setDName(e.target.value);
  // };

  // const handleDEmailChange = (e) => {
  //   setDEmail(e.target.value);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const accessToken = localStorage.getItem('accessToken');
  //     if (!accessToken) {
  //       throw new Error('Access token not found');
  //     }
  //     const response = await axios.post(
  //       'https://apps-d.docusign.com/api/maestro/v1/accounts/b222a7c5-00e6-47b2-b79d-7ba5ef64ec41/workflow_definitions/968ed21b-5bf1-4042-8e30-4d0b6c97cd9c/trigger?mtid=c452dbb1-e531-4049-a596-03c6554e4d53&mtsec=BtWZlO3BtMvO_BMPGdDAf0vbp23vQcxMNkwOHLWnFYk',
  //       {
  //         "instanceName": `${rName}_${dName}_MNDA_Workflow`,
  //         "participants": {},
  //         "payload": {
  //           "remail": `${rEmail}`,
  //           "rname": `${rName}`,
  //           "semail": `${dEmail}`,
  //           "sname": `${dName}`
  //         },
  //         "metadata": {}
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     if (response.status > 299) {
  //       localStorage.clear();
  //       navigate('/');
  //     }
  //     setSuccessMessage('MNDA Sent successfully!');
  //   } catch (error) {
  //     setError('Failed to trigger workflow');
  //   }
  //   setLoading(false);
  // };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ marginRight: 'auto' }}></span>
        <h1>Mutual NDA Sender</h1>
        <a style={{ marginLeft: 'auto' }} href="#" onClick={() => logout()}>logout</a>
      </div>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {/* <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="rName">Receiving Party Name:</label>
          <input
            type="text"
            id="rName"
            value={rName}
            onChange={handleRNameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rEmail">Receiving Party Email:</label>
          <input
            type="email"
            id="rEmail"
            value={rEmail}
            onChange={handleREmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dName">Disclosing Party Name:</label>
          <input
            type="text"
            id="dName"
            value={dName}
            onChange={handleDNameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dEmail">Disclosing Party Email:</label>
          <input
            type="email"
            id="dEmail"
            value={dEmail}
            onChange={handleDEmailChange}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Sending NDA...' : 'Send NDA'}
        </button>
      </form> */}
      <div>
        <button className="btn" onClick={handleButtonClick}>Refresh Workflow List</button>
        <h1>Workflows List</h1>
        <table className="workflow-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>ID</th>
              <th>Trigger URL</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow, index) => (
              <>
                <tr key={index}>
                  <td>
                    <button onClick={() => handleRowClick(index, workflow.id)} className="accordion-button">
                      {expandedRow === index ? `▲${index + 1}` : `▼${index + 1}`}
                    </button>
                  </td>
                  <td>{workflow.name}</td>
                  <td>{workflow.id}</td>
                  <td>
                    <a target="_blank" rel="noreferrer" href={workflow.triggerUrl}>
                      link
                    </a>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={4}>
                      <table className="workflow-instance-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Instance Name</th>
                            <th>Instance ID</th>
                            <th>Start Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workflowInstances.slice(-10).reverse().map((workflowInstance, index1) => (
                            <tr key={index1}>
                              <td>{index1 + 1}</td>
                              <td>{workflowInstance.instanceName}</td>
                              <td>{workflowInstance.dacId}</td>
                              <td>{(workflowInstance.startDate && new Date(workflowInstance.startDate).toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale)) || (<><i className="fa fa-warning"></i> Start Date Unavailable</>)}</td>
                              <td>{workflowInstance.instanceState}{workflowInstance.instanceState === "In Progress" && (<><br></br><a href='#' onClick={() => handleInstanceCancel(workflowInstance.dacId)}>Cancel</a></>)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeScreen;
