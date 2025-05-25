import { Modal, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AudioModalProps {
  open: boolean;
  onClose: () => void;
  audioUrl: string | null;
}

const AudioModal: React.FC<AudioModalProps> = ({ open, onClose, audioUrl }) => {
  console.log("audioUrl", audioUrl);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: '90%',
          minWidth: 350,
          textAlign: 'center',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* תמונה */}
        <Box sx={{ mb: 3, mt: 1 }}>
          <img
            src="/e.png"
            alt="Audio Icon"
            style={{
              maxWidth: '150px',
              height: 'auto',
              borderRadius: '8px'
            }}
          />
        </Box>

        {/* נגן אודיו */}
        {audioUrl && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <audio
              controls
              autoPlay
              style={{ width: '100%' }}
            >
              <source src={audioUrl} type="audio/wav" />
              הדפדפן שלך לא תומך בהשמעת אודיו.
            </audio>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AudioModal;