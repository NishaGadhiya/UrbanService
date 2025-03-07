// Logout.js

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';


const FullScreenContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f9f9f9',
});

const StyledButton = styled(Button)({
  marginTop: '24px',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  backgroundColor: '#3f51b5',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

export const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    localStorage.removeItem('sessionInfo');
    setLoading(false);
    navigate("/login");
  }

  return loading ? (<Loader />) : (
    <FullScreenContainer>
      <div style={{ textAlign: 'center' }}>
        <StyledButton variant="contained" onClick={handleLogout}>
          Logout
        </StyledButton>
      </div>
    </FullScreenContainer>
  );
};


