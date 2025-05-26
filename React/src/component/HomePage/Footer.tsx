import { Box, Button, Typography, Container, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #3f51b5 0%, #7e57c2 100%)',
  padding: theme.spacing(6, 2),
  color: 'white',
  direction: 'rtl',
}));

const RoundedButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1, 3),
  fontWeight: 'bold',
  textTransform: 'none',
  
    backgroundColor: '#ec407a',
    '&:hover': {
      backgroundColor: '#d81b60',
    },
  }),
);

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

const Footer = () => {
  return (
    <GradientBox>
      <Container maxWidth="lg">
        <Grid container justifyContent="space-between" alignItems="center" spacing={4}>
          {/* כאן החלפתי בין צד שמאל לצד ימין */}
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} alignItems="center">
              <Box>
                <SocialIconButton aria-label="facebook">
                  <FacebookIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="instagram">
                  <InstagramIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="linkedin">
                  <LinkedInIcon />
                </SocialIconButton>
              </Box>
              
              <RoundedButton 
                variant="contained" 
                sx={{ 
                  backgroundColor: 'white', 
                  color: '#7e57c2',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  ml: 3 // שיניתי מ-mr ל-ml
                }}
              >
                צור קשר
              </RoundedButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-end"> {/* שיניתי מ-flex-end ל-flex-start */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                התחל ללמוד עוד היום
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                גלה את הקורסים המובילים שלנו ופתח את הפוטנציאל שלך
              </Typography>
              <RoundedButton variant="contained" size="large" href="/register"
              
>
                הצטרף עכשיו
              </RoundedButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </GradientBox>
  );
};

export default Footer;