import { useState, useEffect } from 'react'
import { courseData } from "@/assets/img/data"
import PDFViewer from "./PDFViewer"
import VideoPlayer from "./VideoPlayer"
import CourseList from "./CourseList"
import DownloadedFiles from "./DownloadedFiles"
import { removeSlashes } from "@/utils/helper"

function CoursePage() {
  const [selectedContent, setSelectedContent] = useState(null)
  const [downloads, setDownloads] = useState({})
  const [downloadedFiles, setDownloadedFiles] = useState([])
  const [showDownloaded, setShowDownloaded] = useState(false)
  const [isBatchDownloading, setIsBatchDownloading] = useState(false)

  const handleContentSelect = async (content) => {
    setSelectedContent(null) // Reset current content
    if (content.isLocal) {
      const tempPath = await window.electron.invoke('getFile', content.path)
      if (tempPath) {
        // setSelectedContent({ ...content, url: tempPath })
        navigate('/view', { state: { file: { ...content, url: tempPath } } });

      }
    } else {
      
      // setSelectedContent(content)
      navigate('/view', { state: { file:content } });

    }
  }

  const handleDownload = async (lesson, metadata) => {
    try {
      const { content } = lesson
      const fileType = content.toLowerCase().endsWith('.pdf') ? 'pdf' : 'mp4'
      
      setDownloads(prev => ({
        ...prev,
        [content]: { progress: 0, status: 'downloading', paused: false }
      }))

      const response = await window.electron.invoke('startDownload', {
        url: content,
        metadata: {
          ...metadata,
          lesson: removeSlashes(lesson.title),
          type: fileType
        }
      })

      if (response.status === 'completed' || response.status === 'exists') {
        setDownloads(prev => ({
          ...prev,
          [content]: { progress: 100, status: response.status, path: response.path }
        }))
        loadDownloadedFiles()
      }
    } catch (error) {
      console.error('Download error:', error)
      setDownloads(prev => ({
        ...prev,
        [lesson.content]: { progress: 0, status: 'error' }
      }))
    }
  }

  const handleWeeklyDownload = async (course, selectedWeek) => {
    try {
      for (const week of course.content) {
        if (week.week === selectedWeek) {
          for (const lesson of week.lessons) {
            if (downloads[lesson.content]?.status !== 'completed') {
              await handleDownload(lesson, {
                class: course.class,
                term: course.term,
                week: selectedWeek,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in weekly download:', error);
    }
  };
  
  // const handleWeeklyDownload = async (course, selectedWeek) => {
  //   try {
  //     const downloadPromises = [];
      
  //     for (const week of course.content) {
  //       if (week.week === selectedWeek) {
  //         for (const lesson of week.lessons) {
  //           if (downloads[lesson.content]?.status !== 'completed') {
  //             const downloadPromise = handleDownload(lesson, {
  //               class: course.class,
  //               term: course.term,
  //               week: selectedWeek,
  //             });
  //             downloadPromises.push(downloadPromise);
  //           }
  //         }
  //       }
  //     }
  
  //     await Promise.all(downloadPromises);
  //   } catch (error) {
  //     console.error('Error in weekly download:', error);
  //   }
  // };
  
  // const handleBatchDownload = async (course) => {
  //   setIsBatchDownloading(true)
  //   try {
  //     const downloadPromises = []  // Store all promises
  
  //     for (const week of course.content) {
  //       for (const lesson of week.lessons) {
  //         if (downloads[lesson.content]?.status !== 'completed') {
  //           const downloadPromise = handleDownload(lesson, {
  //             class: course.class,
  //             term: course.term,
  //             week: week.week
  //           })
  //           downloadPromises.push(downloadPromise) // Collect all download promises
  //         }
  //       }
  //     }
  
  //     await Promise.all(downloadPromises) // Wait for all downloads to complete
  //   } finally {
  //     setIsBatchDownloading(false)
  //   }
  // }
  
  const handleBatchDownload = async (course) => {
    setIsBatchDownloading(true)
    try {
      for (const week of course.content) {
        for (const lesson of week.lessons) {
          if (downloads[lesson.content]?.status !== 'completed') {
            await handleDownload(lesson, {
              class: course.class,
              term: course.term,
              week: week.week
            })
          }
        }
      }
    } finally {
      setIsBatchDownloading(false)
    }
  }

  const handleCancelDownload = async (url) => {
    const success = await window.electron.invoke('cancelDownload', url)
    if (success) {
      setDownloads(prev => ({
        ...prev,
        [url]: { progress: 0, status: 'cancelled' }
      }))
    }
  }

  const handleCancelAllDownloads = async () => {
    if (isBatchDownloading) {
      const success = await window.electron.invoke('cancelAllDownloads')
      if (success) {
        setIsBatchDownloading(false)
        setDownloads(prev => {
          const newDownloads = { ...prev }
          Object.keys(newDownloads).forEach(url => {
            if (newDownloads[url].status === 'downloading') {
              newDownloads[url] = { progress: 0, status: 'cancelled' }
            }
          })
          return newDownloads
        })
      }
    }
  }

  const handleDeleteFile = async (filePath) => {
    const success = await window.electron.invoke('deleteFile', filePath)
    if (success) {
      loadDownloadedFiles()
    }
  }

  const handleDeleteAllFiles = async () => {
    const success = await window.electron.invoke('deleteAllFiles')
    if (success) {
      loadDownloadedFiles()
    }
  }

  const loadDownloadedFiles = async () => {
    const files = await window.electron.invoke('getDownloadedFiles')
    setDownloadedFiles(files)
  }

  useEffect(() => {
    const handleDownloadProgress = ({ url, progress, status, paused }) => {
      setDownloads(prev => ({
        ...prev,
        [url]: { ...prev[url], progress, status, paused }
      }))
    }

    window.electron.on('downloadProgress', handleDownloadProgress)
    loadDownloadedFiles()

    return () => {
      window.electron.removeAllListeners('downloadProgress')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Portal</h1>
          <div className="space-x-4">
            {isBatchDownloading && (
              <button
                onClick={handleCancelAllDownloads}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel All Downloads
              </button>
            )}
            {showDownloaded && (
              <button
                onClick={handleDeleteAllFiles}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete All Downloads
              </button>
            )}
            <button
              onClick={() => setShowDownloaded(!showDownloaded)}
              className="px-4 py-2 bg-blue-500 text-teal-600 rounded hover:bg-blue-600"
            >
              {showDownloaded ? 'Show Courses' : 'Show Downloaded'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {showDownloaded ? (
              <DownloadedFiles
                files={downloadedFiles}
                onSelect={handleContentSelect}
                onDelete={handleDeleteFile}
              />
            ) : (
              <CourseList 
                courses={courseData.data}
                onContentSelect={handleContentSelect}
                  onDownload={handleDownload}
                  onWeeklyDownload={handleWeeklyDownload} 
                onBatchDownload={handleBatchDownload}
                onCancelDownload={handleCancelDownload}
                downloads={downloads}
                isBatchDownloading={isBatchDownloading}
              />
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            {selectedContent && (
              selectedContent.type === 'mp4' ? (
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