import { useState, useEffect } from 'react'
import { courseData } from "@/assets/img/data"
import PDFViewer from "../PDFViewer"
import VideoPlayer from "../VideoPlayer"
import CourseList from "../CourseList"
import DownloadedFiles from "../DownloadedFiles"
import { removeSlashes } from "@/utils/helper"
import { Route, Router, Routes } from "react-router-dom"
import CourseDetails from "./CourseDetails"
import CourseListNav from "./CourseListNav"
import DownloadsPage from "./DownloadsPage"
import { FiDownloadCloud, FiFile, FiVideo, FiTrash } from 'react-icons/fi';


function CoursePageNav() {
  const [selectedContent, setSelectedContent] = useState(null)
  const [downloads, setDownloads] = useState({})
  const [downloadedFiles, setDownloadedFiles] = useState([])
  const [showDownloaded, setShowDownloaded] = useState(false)

  const handleContentSelect = async (content) => {
    setSelectedContent(null) // Reset current content
    if (content.isLocal) {
      const tempPath = await window.electron.invoke('getFile', content.path)
      setSelectedContent({ ...content, url: tempPath })
    } else {
      setSelectedContent(content)
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

      setDownloads(prev => ({
        ...prev,
        [content]: { progress: 100, status: response.status, path: response.path }
      }))

      loadDownloadedFiles()
    } catch (error) {
      console.error('Download error:', error)
      setDownloads(prev => ({
        ...prev,
        [lesson.content]: { progress: 0, status: 'error' }
      }))
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
    <Routes>
        <Route path="/" element={<CourseListNav courses={courseData.data} />} />
        <Route path="/course/:courseId/week/:weekId" element={<CourseDetails courses={courseData.data} onContentSelect={handleContentSelect} onDownload={handleDownload} downloads={downloads} />} />
        <Route path="/downloads" element={<DownloadsPage files={downloadedFiles} onSelect={handleContentSelect} onDelete={handleDeleteFile} />} />
    </Routes>
  )
}
  export default CoursePageNav