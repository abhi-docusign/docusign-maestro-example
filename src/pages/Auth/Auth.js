// Auth.js

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth() {
  const navigate = useNavigate();
  const [dsIK, setDsIK] = useState('');

  const handleDsIKChange = (e) => {
    setDsIK(e.target.value);
  };

  const getUserInfo = async (accessToken) => {
    return await axios.get(
      'https://account-d.docusign.com/oauth/userinfo',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        getUserInfo(accessToken).then(response => {
          console.log(response.data);
          localStorage.setItem('accountId', response.data.accounts[0].account_id)
          navigate('/home');
        }).catch(error => {
          console.error(error);
        })
      } else {
        navigate('/home');
      }
    } else {
      const hash = window.location.hash.substr(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        // Store the access token in local storage
        localStorage.setItem('accessToken', accessToken);
        getUserInfo(accessToken).then(response => {
          console.log(response.data);
          localStorage.setItem('accountId', response.data.accounts[0].account_id)
          navigate('/home');
        }).catch(error => {
          console.error(error);
        })
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!dsIK) {
      alert("Please add an Integration Key!")
    } else {
      // const integrationKey = '883c9c68-2480-41b2-bda9-7c99dcd44205';//process.env.DOCUSIGN_IK;
      const redirectUri = `${window.location.origin}`;
      const authUrl = `https://account-d.docusign.com/oauth/auth?response_type=token&client_id=${dsIK}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=signature%20impersonation%20aow_manage`;

      window.location.href = authUrl;
    }
  };

  return (
    <div className="container">
      <div>
        <h1>DocuSign Authentication</h1>
        <div className="form-group">
          <label htmlFor="dsIK">Docusign Integration Key:</label>
          <input
            type="text"
            id="dsIK"
            value={dsIK}
            onChange={handleDsIKChange}
            required
          />
        </div>
        <button className="btn" onClick={handleLogin}>Login with DocuSign</button>
      </div>
    </div>
  );
}

export default Auth;
