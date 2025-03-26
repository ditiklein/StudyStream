import { CacheProvider, ThemeProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { createTheme, CssBaseline } from '@mui/material';








import { RouterProvider } from 'react-router-dom';
import { Router } from './router';

// RTL cache configuration
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [ rtlPlugin], // Add prefixer for better compatibility
});

// Custom theme with RTL support
const theme = createTheme({
  direction: 'rtl', // Set direction in theme
  palette: {
    primary: {
      main: '#4361ee',
      light: '#4cc9f0',
    },
    secondary: {
      main: '#f72585',
      dark: '#7209b7',
    },
    background: {
      default: '#f0f5ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#2b2d42',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2b2d42',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: 'white',
    },
    body1: {
      fontSize: '1.05rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});


  function App() {
    return (
      <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div dir="rtl">
          <RouterProvider router={Router} /> 
        </div>
      </ThemeProvider>
    </CacheProvider>

    );
  }
  
export default App;







// function App() {
//       return (
// <KeyPointsExtractor></KeyPointsExtractor>
//       );
//     }
    
//   export default App


//   function App() {
//     return (
//       <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <div dir="rtl">
//           <RouterProvider router={Router} /> 
//         </div>
//       </ThemeProvider>
//     </CacheProvider>

//     );
//   }
  
// export default App;







// // function App() {
// //       return (
// //         <FileUploader></FileUploader>
// //       );
// //     }
    
// //   export default App