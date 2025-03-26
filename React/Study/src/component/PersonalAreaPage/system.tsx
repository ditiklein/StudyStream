import { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios, { AxiosProgressEvent } from "axios";
import { UploadBox, UploadButton } from "./UploadBox";
import FileDialog from "./FileDialog";
import { useDispatch, useSelector } from "react-redux";
import { addFile } from "../FileAndFolderStore/FilesSlice";
import { AppDispatch, Rootstore } from "../FileAndFolderStore/FileStore";
import User from "../../Modles/User";
import { handleConfirmation } from "../Confirmation";

interface Id {
  parentId: number | null;
}

export const FileUploadSystem: React.FC<Id> = ({ parentId }) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      setIsDialogOpen(true);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setIsDialogOpen(true);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    if (uploadProgress > 0 && uploadProgress < 100) {
      setUploadProgress(0);
    }
  };


  return (
    <Box>
      <UploadBox
        isDragActive={isDragActive}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          גרור קבצים לכאן להעלאה מהירה
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          או
        </Typography>
        <UploadButton variant="contained" onClick={handleUploadClick}>
          בחר קבצים מהמחשב
        </UploadButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          multiple
        />
      </UploadBox>

      <FileDialog
        open={isDialogOpen}
        files={selectedFiles}
        onClose={handleDialogClose}
        onConfirm={(files, shouldUpload) =>
          handleConfirmation(
            files,
            shouldUpload,
            parentId,
            dispatch,
            setUploadProgress,
            setIsDialogOpen,
            setSelectedFiles
          )
        }
        
        uploadProgress={uploadProgress}
      />
    </Box>
  );
};

