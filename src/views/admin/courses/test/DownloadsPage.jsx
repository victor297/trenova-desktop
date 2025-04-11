function DownloadsPage({ files, onSelect, onDelete }) {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Downloaded Files</h1>
            {files.length === 0 ? (
                <p>No downloaded files.</p>
            ) : (
                files.map(file => (
                    <div key={file.url} className="flex items-center justify-between border p-2 rounded mb-2">
                        <span className="cursor-pointer hover:text-blue-500" onClick={() => onSelect(file)}>{file.name}</span>
                        <button onClick={() => onDelete(file)} className="p-1 hover:bg-red-200 rounded">
                            <FiTrash className="h-5 w-5 text-red-500" />
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
export default DownloadsPage