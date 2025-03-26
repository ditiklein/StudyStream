import { useState } from 'react';
import {   
  Box,   
  Typography,   
  List,   
  ListItem,   
  ListItemText   
} from '@mui/material';

// הגדרת ממשקים לטיפוסי הפרופס
interface Recording {
  id: number;
  lessonName: string;
}

interface SidebarProps {
  recordings: Recording[];
  onSelectLesson?: (lesson: Recording) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ recordings, onSelectLesson }) => {
  const [selectedItem, setSelectedItem] = useState<Recording | null>(recordings[0] || null);

  const handleItemClick = (item: Recording) => {
    setSelectedItem(item);
    if (onSelectLesson) {
      onSelectLesson(item);
    }
  };

  const removeFileExtension = (filename: string): string => {
    return filename.split('.').slice(0, -1).join('.'); // מסיר את הסיומת מהקובץ
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: 4,
      bgcolor: 'white'
    }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          color: 'text.primary',
          textAlign: 'center'
        }}
      >
        ההקלטות שלי
      </Typography>

      <Box sx={{
        width: '90%',
        maxWidth: '350px'
      }}>
        <List sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {recordings.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                ...(selectedItem === item ? {
                  backgroundColor: '#FF0080',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                } : {
                  border: '1px solid',
                  borderColor: 'grey.300',
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    borderColor: 'primary.light',
                    boxShadow: 1
                  }
                }),
              }}
              onClick={() => handleItemClick(item)}
            >
              <ListItemText
                primary={removeFileExtension(item.lessonName)} 
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  color: selectedItem === item ? 'white' : 'text.primary'
                }}
                secondaryTypographyProps={{
                  color: selectedItem === item ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
