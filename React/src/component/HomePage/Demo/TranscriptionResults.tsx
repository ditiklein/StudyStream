import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';

interface TranscriptionResult {
  text: string;
}

interface TranscriptionResultsProps {
  transcriptionResult: TranscriptionResult;
  keyPoints: string | null;
  summary: string | null;
  fileName: string;
  onNewTranscription: () => void;
}

const formatKeyPoints = (keyPoints: string | null): string[] => {
  if (!keyPoints) return [];
  
  return keyPoints
    .split('\n')
    .map(point => point.trim())
    .filter(point => point.length > 0);
};

const ACCORDION_STYLES = {
  mb: 2,
  '& .MuiAccordionSummary-root': {
    bgcolor: 'primary.main',
    color: 'white',
  }
};

export const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({
  transcriptionResult,
  keyPoints,
  summary,
  fileName,
  onNewTranscription
}) => {
  const theme = useTheme();
  const primaryBlue = theme.palette.primary.main;
  const keyPointsList = formatKeyPoints(keyPoints);
  
  const getAccordionDetailsStyles = (primaryColor: string) => ({
    bgcolor: `${primaryColor}10`,
    borderTop: 'none',
    pt: 2,
    pb: 2
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          תמלול של: {fileName}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onNewTranscription}
        >
          תמלול חדש
        </Button>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h3" gutterBottom>
          תוצאות התמלול
        </Typography>
        
        {summary && (
          <Accordion sx={ACCORDION_STYLES}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography variant="h6">סיכום</Typography>
            </AccordionSummary>
            <AccordionDetails sx={getAccordionDetailsStyles(primaryBlue)}>
              <Typography color={primaryBlue} sx={{ fontWeight: 500 }}>
                {summary}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
        
        {keyPoints && (
          <Accordion sx={ACCORDION_STYLES}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography variant="h6">נקודות מפתח</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ ...getAccordionDetailsStyles(primaryBlue), pt: 0 }}>
              <List>
                {keyPointsList.map((point, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <CircleIcon sx={{ fontSize: 8, color: primaryBlue }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography color={primaryBlue} sx={{ fontWeight: 500 }}>
                          {point}
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
        
        <Accordion sx={ACCORDION_STYLES}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h6">תמלול מלא</Typography>
          </AccordionSummary>
          <AccordionDetails sx={getAccordionDetailsStyles(primaryBlue)}>
            <Typography 
              sx={{ 
                whiteSpace: 'pre-wrap',
                color: primaryBlue,
                fontWeight: 500 
              }}
            >
              {transcriptionResult.text}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};