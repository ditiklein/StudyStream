import axios from 'axios';
import  { useState } from 'react';

const KeyPointsExtractor = () => {
  const [file, setFile] = useState(null);
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
    setKeyPoints('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError("נא לבחור קובץ טקסט.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://localhost:7147/api/extract-keypoints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // חשוב להגדיר את סוג התוכן
        },
      });

      setKeyPoints(response.data.keyPoints); // axios מחזיר את הנתונים ב-response.data
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>חילוץ נקודות חשובות מהטקסט</h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'מעבד...' : 'העלה ועבד'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {keyPoints && (
        <div>
          <h3>נקודות חשובות:</h3>
          <pre>{keyPoints}</pre>
        </div>
      )}
    </div>
  );
};

export default KeyPointsExtractor;


