import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HelpSupportFooter: React.FC = () => {
  return (
    <Box textAlign="center" mt={8}>
      <Paper
        sx={{
          display: 'inline-block',
          px: 4,
          py: 2,
          borderRadius: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
            borderRadius: '8px 8px 0 0'
          }
        }}
      >
        <Typography variant="h6" fontWeight="500" sx={{ mt: 1 }}>
          🌟 זקוק לעזרה נוספת? אנחנו כאן בשבילך 24/7 🌟
        </Typography>
      </Paper>
    </Box>
  );
};

export default HelpSupportFooter;