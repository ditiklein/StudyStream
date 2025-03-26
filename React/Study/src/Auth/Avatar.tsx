import React from 'react';
import { Avatar, styled } from '@mui/material';

const GradientAvatar = styled(Avatar)(({ theme }) => ({
  background: 'linear-gradient(to right, #ed4b9e, #8e2de2, #4a00e0)', // Added pink gradient
  color: 'white',
  backgroundSize: '200% 100%', // Enable smooth gradient transition
  animation: 'gradientShift 3s ease infinite',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  }
}));

export const NameAvatar = ({ name }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('').toUpperCase();
    return initials;
  };

  return <GradientAvatar>{getInitials(name)}</GradientAvatar>;
};
