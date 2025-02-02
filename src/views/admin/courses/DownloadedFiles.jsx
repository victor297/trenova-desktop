import { FiVideo, FiFile } from 'react-icons/fi'

function DownloadedFiles({ files, onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Downloaded Files</h2>
        <div className="space-y-2">
          {files.map((file, index) => {
            const isVideo = file.type === 'video'
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => onSelect({
                  isLocal: true,
                  path: file.path,
                  type: file.type
                })}
              >
                <div className="flex items-center">
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