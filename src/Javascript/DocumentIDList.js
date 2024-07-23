import React from 'react';
import axios from 'axios';

function DocumentIDList({ files, selectedFiles, setSelectedFiles, setFileContents }) {
  
  // Handling file selection on click on checkbox
  const handleCheckboxClick = (event, file) => {
    const isChecked = event.target.checked;

    // Update selected files state based on checkbox status
    if (isChecked) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles(selectedFiles.filter(selectedFile => selectedFile !== file));
    }

    // Call function to fetch file content if needed
    if (isChecked) {
      fetchFileContent(file);
    } else {
      removeFileContent(file);
    }
  };

  // Function to fetch file content
  const fetchFileContent = async (file) => {
    try {
      // Fetch file content using file name
      const response = await axios.get(`http://localhost:5000/api/files/${file}`);
      if (!response.statusText) {
        throw new Error('Failed to fetch file content');
      }
      const fileContent = response.data.content;
      setFileContents(prevState => ({
        ...prevState,
        [file]: fileContent,
      }));
    } catch (error) {
      // Error on loading file content
      console.error('Error fetching file content:', error);
    }
  };

  // Function to remove file content from state
  const removeFileContent = (file) => {
    setFileContents(prevState => {
      const newState = { ...prevState };
      delete newState[file];
      return newState;
    });
  };

  return (
    <div>
      <h2 className='title'>List of Files:</h2>
      <ul className='document-id-list'>
        {files.map((file, index) => (
          <li key={index} className='id-list-item'>
            <input
              type="checkbox"
              onChange={(event) => handleCheckboxClick(event, file)}
              checked={selectedFiles.includes(file)}
            />
            <label className='file-name'>{file}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentIDList;