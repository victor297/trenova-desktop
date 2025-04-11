import { useState, useEffect } from 'react';
import { FiVideo, FiFile, FiTrash2, FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Downloads() {
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const loadDownloadedFiles = async () => {
    const files = await window.electron.invoke('getDownloadedFiles');
    setDownloadedFiles(files);
  };

  useEffect(() => {
    loadDownloadedFiles();
  }, []);

  const handleDeleteFile = async (filePath) => {
    const success = await window.electron.invoke('deleteFile', filePath);
    if (success) {
      loadDownloadedFiles();
    }
  };

  const handleDeleteAllFiles = async () => {
    const success = await window.electron.invoke('deleteAllFiles');
    if (success) {
      loadDownloadedFiles();
    }
  };

  const handleContentSelect = async (file) => {
    const tempPath = await window.electron.invoke('getFile', file.path);
    if (tempPath) {
      navigate('/view', { state: { file: { ...file, url: tempPath } } });
    }
  };

  const filteredFiles = downloadedFiles?.filter(file =>
    file?.lesson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file?.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Downloaded Content</h1>
        {downloadedFiles?.length > 0 && (
          <button
            onClick={handleDeleteAllFiles}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete All
          </button>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search downloads..."
          className="w-full p-3 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow">
          {filteredFiles.length > 0 ? (
            <div className="divide-y">
              {filteredFiles.map((file, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-grow">
                    {file.type === 'video' ? (
                      <FiVideo className="h-5 w-5 text-blue-500 mr-3" />
                    ) : (
                      <FiFile className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <h3 className="font-medium">{file.lesson}</h3>
                      <p className="text-sm text-gray-500">
                        {file.class} - Term {file.term} - {file.week}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleContentSelect(file)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <FiPlay className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.path)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No matching downloads found' : 'No downloaded files yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Downloads;
