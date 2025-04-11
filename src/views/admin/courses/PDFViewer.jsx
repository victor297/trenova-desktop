// import React from 'react';

// const PDFViewer = ({ url }) => {
//   return (
//     <iframe src={url} width="600" height="800" title="PDF Viewer"></iframe>
//   );
// };

// export default PDFViewer;

// import React from 'react';

// const PDFViewer = ({ url }) => {
//   return (
//     <iframe
//     src={`/pdf-viewer?file=${encodeURIComponent(url)}#toolbar=0&navpanes=0&scrollbar=0`}
//     width="600"
//       height="800"
//       title="PDF Viewer"
//       style={{ border: 'none' }}
//     ></iframe>
//   );
// };

// export default PDFViewer;

import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { getDocument } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js';

// Set the worker source using the latest syntax
getDocument.GlobalWorkerOptions = {
  workerSrc: pdfjsWorker,
};

const PDFViewer = ({ url }) => {
  // console.log(url,"hii")
  return (
    <div style={{ height: 'auto', width: 'auto', border: '1px solid #ccc' }}>
      <Worker workerUrl={pdfjsWorker}>
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
};

export default PDFViewer;

// import React from 'react';
// import { Worker, Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// const PDFViewer = ({ url }) => {
//   // Initialize the default layout plugin without a download button
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//     toolbarPlugin: {
//       downloadPlugin: {
//         enableDownload: false, // Disable download button
//       },
//     },
//   });

//   return (
//     <div style={{ height: '800px', width: '600px', border: '1px solid #ddd' }}>
//       {/* Use a local PDF.js worker for Electron compatibility */}
//       <Worker workerUrl={`./pdf.worker.min.js`}>
//         <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
//       </Worker>
//     </div>
//   );
// };

// export default PDFViewer;
