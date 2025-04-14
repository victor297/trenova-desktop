import React, { useState,useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'

import { useGetCourseDetailsQuery } from "../../../redux/api/CoursesApiSlice";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import PDFViewer from "./PDFViewer";
import { 
  FiDownloadCloud, 
  FiPause, 
  FiPlay, 
  FiFile, 
  FiVideo, 
  FiX, 
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi'
import { removeSlashes, roundUpToDecimal } from "@/utils/helper"

const ViewCourse = () => {
  const params = useParams();
  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetCourseDetailsQuery(params.id);
const course = courseData?.data
  const [selectedContent, setSelectedContent] = useState(null)
  const [downloads, setDownloads] = useState({})
  const [isBatchDownloading, setIsBatchDownloading] = useState(false)
  const [expandedWeeks, setExpandedWeeks] = useState({})
const navigate = useNavigate()

  useEffect(() => {
    const handleDownloadProgress = ({ url, progress, status, paused }) => {
      setDownloads(prev => ({
        ...prev,
        [url]: { ...prev[url], progress, status, paused }
      }))
    }

    window.electron.on('downloadProgress', handleDownloadProgress)
    return () => {
      window.electron.removeAllListeners('downloadProgress')
    }
  }, [])


  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }))
  } 
  const handleContentSelect = async (content) => {
    setSelectedContent(null) // Reset current content
    // console.log(content,"content")
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
      const fileType = content.toLowerCase().endsWith('.pdf') ? 'pdf' : 'video'
      
      setDownloads(prev => ({
        ...prev,
        [content]: { progress: 0, status: 'downloading', paused: false }
      }))
// console.log(lesson.title,"lesson.title")
      const response = await window.electron.invoke('startDownload', {
        url: content,
        metadata: {
          ...metadata,
          lesson: removeSlashes(lesson.title),
          type: fileType
        }
      })
      // console.log(response,"response.response")

      if (response.status === 'completed' || response.status === 'exists') {
        setDownloads(prev => ({
          ...prev,
          [content]: { progress: 100, status: response.status, path: response.path }
        }))
      }
    } catch (error) {
      console.error('Download error:', error)
      setDownloads(prev => ({
        ...prev,
        [lesson.content]: { progress: 0, status: 'error' }
      }))
    }
  }
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
  const handleBatchDownload = async (course) => {
    setIsBatchDownloading(true)
    try {
      const downloadPromises = []  // Store all promises
  
      for (const week of course.content) {
        for (const lesson of week.lessons) {
          if (downloads[lesson.content]?.status !== 'completed') {
            const downloadPromise = handleDownload(lesson, {
              class: course.class,
              term: course.term,
              week: week.week
            })
            downloadPromises.push(downloadPromise) // Collect all download promises
          }
        }
      }
  
      await Promise.all(downloadPromises) // Wait for all downloads to complete
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
  const togglePauseResume = async (url) => {
    const download = downloads[url]
    if (download?.status === 'downloading') {
      if (download.paused) {
        await window.electron.invoke('resumeDownload', url)
      } else {
        await window.electron.invoke('pauseDownload', url)
      }
    }
  }

  if (!course) {
    return <div>Course not found</div>
  }

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return toast.error(isError);
  }
  // console.log("courseData", course);
  return (
    <div className="container mx-auto px-4">
    <div className=" gap-8">
      <div>
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600">
            <FiArrowLeft className="mr-2" />
            Back to Courses
          </Link>
        </div>
        
        <div className="bg-gold rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{course.name}</h1>
          <p className="text-gray-800 mb-4">
            Class: {course.class} | Term: {course.term}
          </p>
          <button
            onClick={()=>handleBatchDownload(course)}
            disabled={isBatchDownloading}
            className="w-full px-4 py-2 bg-blue text-white rounded hover:bg-teal-600 disabled:bg-gray-400"
          >
            {isBatchDownloading ? 'Downloading All...' : 'Download All Content'}
            </button>
            {isBatchDownloading && (
              <button
                onClick={handleCancelAllDownloads}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel All Downloads
              </button>
            )}
        </div>

        <div className="bg-white rounded-lg shadow divide-y">
          {course.content.map(week => (
            <div key={week._id}>
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleWeek(week._id)}
              >
                 <h3 
                      className="text-lg font-medium cursor-pointer flex justify-between"
                      onClick={() => setExpandedWeek(expandedWeek === week._id ? null : week._id)}
                    >
                       {week.week} 
                </h3>

                <div className="flex gap-6">

                <button  className="bg-blue text-white py-1 px-4 rounded-lg"   onClick={() => handleWeeklyDownload(course, week.week)}> Download  Topic</button>
                {expandedWeeks[week._id] ? (
                  <div className="flex justify-center items-center">close
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                ) : (
                    
                  <div className="flex justify-center items-center">Expand
                  <FiChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                </div>
              </div>
              
              {expandedWeeks[week._id] && (
                <div className="p-4 pt-0">
                  <div className="space-y-4">
                    {week.lessons.map(lesson => {
                      const download = downloads[lesson.content]
                      const isVideo = !lesson.content.toLowerCase().endsWith('.pdf')

                      return (
                        <div key={lesson._id} className="flex items-center justify-between pl-4">
                          <div 
                            className="flex items-center cursor-pointer hover:text-blue-500"
                            onClick={() => handleContentSelect({
                              url: lesson.content,
                              type: isVideo ? 'video' : 'pdf'
                            })}
                          >
                            {isVideo ? (
                              <FiVideo className="h-5 w-5 mr-2" />
                            ) : (
                              <FiFile className="h-5 w-5 mr-2" />
                            )}
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex gap-6">
                            <button     onClick={() => handleContentSelect({
                              url: lesson.content,
                              type: isVideo ? 'video' : 'pdf'
                            })} className="py-1 px-4 bg-gold text-white rounded-lg"> View</button>
                          <div className="flex items-center space-x-2">
                            {download?.progress > 0 && download?.progress < 100 && (
                              <div className="flex items-center">

                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-teal-600 h-2.5 rounded-full" 
                                  style={{ width: `${download.progress}%` }}
                                  ></div>
                                  </div>
                                <div>{roundUpToDecimal(download.progress) }</div>
                              </div>
                            )}

                            {download?.status === 'downloading' && (
                              <>
                                <button
                                  onClick={() => togglePauseResume(lesson.content)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  {download.paused ? (
                                    <FiPlay className="h-5 w-5" />
                                  ) : (
                                    <FiPause className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleCancelDownload(lesson.content)}
                                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                                >
                                  <FiX className="h-5 w-5" />
                                </button>
                              </>
                            )}

                            {(!download || download.status === 'error' || download.status === 'cancelled') && (
                              <button
                                onClick={() => handleDownload(lesson, {
                                  class: course.class,
                                  term: course.term,
                                  week: week.week
                                })}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiDownloadCloud className="h-5 w-5" />
                              </button>
                            )}
                          </div>
</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* <div className="bg-white rounded-lg shadow p-6">
        {selectedContent ? (
          selectedContent.type === 'video' ? (
            <VideoPlayer url={selectedContent.url} />
          ) : (
            <PDFViewer url={selectedContent.url} />
          )
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select content to view
          </div>
        )}
      </div> */}
    </div>
  </div>
  );
};

export default ViewCourse;
