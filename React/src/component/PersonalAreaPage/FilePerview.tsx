import { List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  return (
    <List sx={{ width: '100%' }}>
      {files.map((file, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton edge="end" aria-label="מחיקה" onClick={() => onRemove(index)}>
              {/* <CloseIcon /> */} 
            </IconButton>
          }
        >
          <ListItemIcon>
          </ListItemIcon>
          <ListItemText
            primary={file.name}
            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default FilePreview;
