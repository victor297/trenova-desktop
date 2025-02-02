import { useState, useEffect } from 'react'
import { courseData } from "@/assets/img/data"
import PDFViewer from "./PDFViewer"
import VideoPlayer from "./VideoPlayer"
import CourseList from "./CourseList"
import DownloadedFiles from "./DownloadedFiles"

function CoursePage() {
    const [selectedContent, setSelectedContent] = useState(null)
    const [downloads, setDownloads] = useState({})
    const [downloadedFiles, setDownloadedFiles] = useState([])
    const [showDownloaded, setShowDownloaded] = useState(false)
  
    const handleContentSelect = async (content) => {
      if (content.isLocal) {
        const tempPath = await window.electron.invoke('getFile', content.path)
        setSelectedContent({ ...content, url: `file://${tempPath}` })
      } else {
        setSelectedContent(content)
      }
    }
  
    const handleDownload = async (lesson, metadata) => {
      try {
        const { content } = lesson
        const fileType = content.toLowerCase().endsWith('.pdf') ? 'pdf' : 'video'
        
        const response = await window.electron.invoke('startDownload', {
          url: content,
          metadata: {
            ...metadata,
            lesson: lesson.title,
            type: fileType
          }
        })
  
        setDownloads(prev => ({
          ...prev,
          [content]: { progress: 0, status: response.status, path: response.path }
        }))
  
        // Refresh downloaded files list after successful download
        loadDownloadedFiles()
      } catch (error) {
        console.error('Download error:', error)
      }
    }
  
    const handleBatchDownload = async (course) => {
      for (const week of course.content) {
        for (const lesson of week.lessons) {
          await handleDownload(lesson, {
            class: course.class,
            term: course.term,
            week: week.week
          })
        }
      }
    }
  
    const loadDownloadedFiles = async () => {
      const files = await window.electron.invoke('getDownloadedFiles')
      setDownloadedFiles(files)
    }
  
    useEffect(() => {
      const handleDownloadProgress = ({ url, progress }) => {
        setDownloads(prev => ({
          ...prev,
          [url]: { ...prev[url], progress }
        }))
      }
  
      window.electron.on('downloadProgress', handleDownloadProgress)
      loadDownloadedFiles()
  
      return () => {
        window.electron.removeAllListeners('downloadProgress')
      }
    }, [])
  
    return (
      <div className="min-h-screen bg-gray-600">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Course Portal</h1>
            <button
              onClick={() => setShowDownloaded(!showDownloaded)}
              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
            >
              {showDownloaded ? 'Show Courses' : 'Show Downloaded'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {showDownloaded ? (
                <DownloadedFiles
                  files={downloadedFiles}
                  onSelect={handleContentSelect}
                />
              ) : (
                <CourseList 
                  courses={courseData.data}
                  onContentSelect={handleContentSelect}
                  onDownload={handleDownload}
                  onBatchDownload={handleBatchDownload}
                  downloads={downloads}
                />
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              {selectedContent && (
                selectedContent.type === 'video' ? (
                  <VideoPlayer url={selectedContent.url} />
                ) : (
                  <PDFViewer url={selectedContent.url} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default CoursePage