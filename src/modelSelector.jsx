import React, { useState } from 'react';

const ModelSelector = ({ models, onModelSelect, onModelUpload }) => {
  const [uploadFile, setUploadFile] = useState(null);

  const handleUpload = () => {
    if (uploadFile) {
      onModelUpload(uploadFile);
    }
  };

  return (
    <div className="model-selector">
      <h3>Available Models</h3>
      <ul>
        {models.map((model) => (
          <li key={model.id}>
            <button onClick={() => onModelSelect(model.id)}>{model.id}</button>
          </li>
        ))}
      </ul>
      <h3>Upload Model</h3>
      <input type="file" accept=".glb" onChange={(e) => setUploadFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ModelSelector;
