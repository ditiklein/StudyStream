import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// הגדרת טיפוסים
interface SearchAndHighlightProps {
  transcript: string;
}

const SearchAndHighlight: React.FC<SearchAndHighlightProps> = ({ transcript }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [highlightedTranscript, setHighlightedTranscript] = useState<React.ReactNode>('');
  const [matchCount, setMatchCount] = useState<number>(0);

  // פונקציה לטיפול בשינוי בשדה החיפוש
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  // פונקציה לאיפוס החיפוש
  const resetSearch = (): void => {
    setSearchText('');
  };

  // פונקציה להדגשת המילים בטקסט
  const highlightText = (text: string, searchValue: string): React.ReactNode => {
    if (!searchValue || searchValue === '') {
      return text;
    }

    try {
      // ספירת התוצאות
      const regex = new RegExp(searchValue, 'gi');
      const matches = text.match(regex);
      const matchesCount = matches ? matches.length : 0;
      setMatchCount(matchesCount);

      // פיצול הטקסט לחלקים והדגשת התוצאות
      const parts = text.split(new RegExp(`(${searchValue})`, 'gi'));
      
      return parts.map((part, index) => {
        if (part.toLowerCase() === searchValue.toLowerCase()) {
          return (
            <Typography 
              component="span" 
              key={index} 
              sx={{ 
                bgcolor: 'secondary.light', 
                color: 'secondary.contrastText',
                px: 0.5,
                borderRadius: '2px',
                fontWeight: 'medium'
              }}
            >
              {part}
            </Typography>
          );
        }
        return part;
      });
    } catch (error) {
      console.error('Error highlighting text:', error);
      return text;
    }
  };

  // עדכון התמלול המודגש בכל פעם שמשתנה החיפוש או התמלול
  useEffect(() => {
    if (transcript) {
      setHighlightedTranscript(highlightText(transcript, searchText));
    } else {
      setHighlightedTranscript('');
      setMatchCount(0);
    }
  }, [searchText, transcript]);

  return (
    <>
      {/* שדה חיפוש */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="חפש בתמלול..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <Tooltip title="נקה חיפוש">
                  <IconButton
                    edge="end"
                    onClick={resetSearch}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          }}
          sx={{ bgcolor: 'background.paper' }}
        />
        
        {/* הצגת מספר התוצאות */}
        {searchText && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            נמצאו {matchCount} תוצאות
          </Typography>
        )}
      </Box>

      {/* התמלול עם הדגשות */}
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, direction: 'rtl' }}>
        {searchText ? highlightedTranscript : transcript}
      </Typography>
    </>
  );
};

export default SearchAndHighlight;