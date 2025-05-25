import { useState, useEffect } from 'react';
import {   
  Box,   
  Typography,   
  List,   
  ListItem,   
  ListItemText,
  ListItemIcon,
  Divider,
  InputBase,
  Paper,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AudioFileIcon from '@mui/icons-material/AudioFile';

interface SidebarProps {
  recordings: any[];
  onSelectRecording: (recording: any) => void;
  selectedRecording: any | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  recordings, 
  onSelectRecording,
  selectedRecording 
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState<any[]>(recordings);

  useEffect(() => {
    if (recordings) {
      const filtered = searchText 
        ? recordings.filter(item => 
            removeFileExtension(item.lessonName)
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
        : recordings;
      
      setFilteredRecordings(filtered);
    }
  }, [recordings, searchText]);

  const removeFileExtension = (filename: string): string => {
    return filename.split('.').slice(0, -1).join('.');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 3, 
        width: '100%',
        textAlign: 'center'
      }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1
          }}
        >
          ההקלטות שלי
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          בחר הקלטה לתמלול
        </Typography>

        <Paper
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
            mb: 2
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="חיפוש הקלטות..."
            value={searchText}
            onChange={handleSearch}
          />
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      <Divider sx={{ width: '90%', mb: 2 }} />

      <Box sx={{
        width: '100%',
        flexGrow: 1,
        overflow: 'auto',
        px: 2
      }}>
        {filteredRecordings.length > 0 ? (
          <List sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}>
            {filteredRecordings.map((recording) => (
              <ListItem
                key={recording.id}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  padding: '8px 12px',
                  ...(selectedRecording?.id === recording.id ? {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                  } : {
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: 'primary.light',
                    }
                  }),
                }}
                onClick={() => onSelectRecording(recording)}
              >
                <ListItemIcon sx={{ 
                  minWidth: 36,
                  color: selectedRecording?.id === recording.id ? 'white' : 'primary.main'
                }}>
                  <AudioFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={removeFileExtension(recording.urlName)}
                  primaryTypographyProps={{
                    fontWeight: 'medium',
                    fontSize: '0.95rem',
                    color: selectedRecording?.id === recording.id ? 'white' : 'text.primary',
                    noWrap: true
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%' 
          }}>
            <Typography variant="body2" color="text.secondary">
              לא נמצאו הקלטות
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;