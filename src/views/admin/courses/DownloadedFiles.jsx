import { FiVideo, FiFile, FiTrash2 } from 'react-icons/fi'

function DownloadedFiles({ files, onSelect, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Downloaded Files</h2>
        <div className="space-y-2">
          {files.map((file, index) => {
            const isVideo = file.type === 'mp4'
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div 
                  className="flex items-center cursor-pointer flex-grow"
                  onClick={() => onSelect({
                    isLocal: true,
                    path: file.path,
                    type: file.type
                  })}
                >
                  {isVideo ? (
                    <FiVideo className="h-5 w-5 mr-2" />
                  ) : (
                    <FiFile className="h-5 w-5 mr-2" />
                  )}
                  <div>
                    <p className="font-medium">{file.lesson}</p>
                    <p className="text-sm text-gray-500">
                      Week {file.week} - {file.class}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(file.path)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            )
          })}
          {files.length === 0 && (
            <p className="text-gray-500 text-center py-4">No downloaded files yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DownloadedFiles