import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../FileAndFolderStore/FileStore';
import { searchFiles, searchFolders } from '../../FileAndFolderStore/FilesSlice';

interface Breadcrumb {
  id: number | null;
  name: string;
}

export const useFileManager = () => {
  // State management
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [previousBreadcrumbs, setPreviousBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { id: null, name: 'הקבצים שלי' },
  ]);
  const [refreshKey, setRefreshKey] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  // Get user from session storage
  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Helper function to refresh components
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Modal handlers
  const handleNewFolder = () => setNewFolderOpen(true);
  const closeNewFolder = () => setNewFolderOpen(false);
  
  const handleRecordLesson = () => setRecordingModalOpen(true);
  const handleRecordingModalClose = () => {
    setRecordingModalOpen(false);
    triggerRefresh();
  };

  const handleRecycleBin = () => setRecycleBinOpen(true);
  const handleRecycleBinClose = () => setRecycleBinOpen(false);

  // File upload handler
  const handleUploadFile = () => {
    const el = document.getElementById("upload-box");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Navigation handlers
  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs(prev => prev.slice(0, index + 1));
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
    }
  };

  const handleFolderNavigate = (folderId: number, folderName: string) => {
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
    }
  };

  const handleFolderCreated = () => {
    triggerRefresh();
    closeNewFolder();
  };

  // Search functionality
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      if (isSearchActive) {
        setIsSearchActive(false);
        setBreadcrumbs(previousBreadcrumbs);
      }
      return;
    }

    if (!isSearchActive) {
      setPreviousBreadcrumbs([...breadcrumbs]);
      setIsSearchActive(true);
      
      const currentFolder = breadcrumbs[breadcrumbs.length - 1].name;
      
      setBreadcrumbs([
        { id: null, name: 'הקבצים שלי' },
        { id: null, name: `תוצאות החיפוש ב${currentFolder}` }
      ]);
    }
    
    const folderId = breadcrumbs[breadcrumbs.length - 1].id;
    
    // Dispatch search actions
    dispatch(searchFolders({
      userId: user?.id,
      currentFolderId: folderId, 
      query: query,
    }));
    
    dispatch(searchFiles({
      userId: user?.id,
      currentFolderId: folderId,
      query: query,
    }));
  };

  // Computed values
  const currentFolderId = isSearchActive 
    ? previousBreadcrumbs[previousBreadcrumbs.length - 1]?.id 
    : breadcrumbs[breadcrumbs.length - 1]?.id;

  return {
    // State
    newFolderOpen,
    recordingModalOpen,
    recycleBinOpen,
    searchQuery,
    isSearchActive,
    breadcrumbs,
    refreshKey,
    currentFolderId,
    
    // Handlers
    handleNewFolder,
    closeNewFolder,
    handleUploadFile,
    handleRecordLesson,
    handleRecordingModalClose,
    handleRecycleBin,
    handleRecycleBinClose,
    handleBreadcrumbClick,
    handleFolderNavigate,
    handleFolderCreated,
    handleSearchChange,
  };
};