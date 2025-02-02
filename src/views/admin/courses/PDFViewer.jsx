import React from 'react';

const PDFViewer = ({ url }) => {
  return (
    <iframe src={url} width="600" height="800" title="PDF Viewer"></iframe>
  );
};

export default PDFViewer;
