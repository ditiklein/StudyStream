import { Box, Container, Typography, Button, Grid } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ImageCarousel from "./Imagecorsol";
import { Link } from 'react-router-dom';

function Hero() {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* קרוסלת תמונות כרקע */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <ImageCarousel />
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* טקסט ממורכז */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.2rem", md: "3rem" },
                fontWeight: 800,
                mb: 3,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                lineHeight: 1.2,
              }}
            >
              נהל את חומרי הלימוד שלך בצורה חכמה
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.2rem" },
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              המערכת המתקדמת לניהול קבצי לימוד, שיעורים והקלטות עבור מורים ומרצים. ארגן, גלה תובנות ושתף בקלות את כל החומרים שלך במקום אחד.
            </Typography>

            <Button
              variant="contained"
              component={Link}
              to="/register"
              endIcon={<RocketLaunchIcon />}
              sx={{
                bgcolor: "#f72585",
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontWeight: 700,
                borderRadius: "50px",
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                boxShadow: "0 4px 15px rgba(247, 37, 133, 0.3)",
                transition: "all 0.3s ease, background-color 0.5s ease", // Added longer transition for background-color
                "&:hover": {
                  bgcolor: "#1976D2", // Changed to blue on hover
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              הצטרף עכשיו
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Hero;
