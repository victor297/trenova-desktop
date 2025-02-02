import { useState } from 'react'
import { 
  FiDownloadCloud,
  FiPause,
  FiPlay,
  FiFile,
  FiVideo
} from 'react-icons/fi'

function CourseList({ courses, onContentSelect, onDownload, onBatchDownload, downloads }) {
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [expandedWeek, setExpandedWeek] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownload = (lesson, metadata) => {
    onDownload(lesson, metadata)
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="divide-y">
        {filteredCourses.map(course => (
          <div key={course._id} className="p-4">
            <div className="flex justify-between items-center">
              <h2 
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
              >
                {course.name}
              </h2>
              <button
                onClick={() => onBatchDownload(course)}
                className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
              >
                Download All
              </button>
            </div>

            {expandedCourse === course._id && (
              <div className="mt-4 space-y-4">
                {course.content.map(week => (
                  <div key={week._id} className="ml-4">
                    <h3 
                      className="text-lg font-medium cursor-pointer"
                      onClick={() => setExpandedWeek(expandedWeek === week._id ? null : week._id)}
                    >
                      Week {week.week}
                    </h3>

                    {expandedWeek === week._id && (
                      <div className="mt-2 space-y-2">
                        {week.lessons.map(lesson => {
                          const download = downloads[lesson.content]
                          const isVideo = !lesson.content.toLowerCase().endsWith('.pdf')

                          return (
                            <div key={lesson._id} className="ml-8 flex items-center justify-between">
                              <div className="flex items-center">
                                {isVideo ? (
                                  <FiVideo className="h-5 w-5 mr-2" />
                                ) : (
                                  <FiFile className="h-5 w-5 mr-2" />
                                )}
                                <span 
                                  className="cursor-pointer hover:text-blue-500"
                                  onClick={() => onContentSelect({
                                    url: lesson.content,
                                    type: isVideo ? 'video' : 'pdf'
                                  })}
                                >
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                {download?.progress > 0 && download?.progress < 100 && (
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-brand-300 h-2.5 rounded-full" 
                                      style={{ width: `${download.progress}%` }}
                                    >{download.progress}</div>
                                  </div>
                                )}

                                {download?.status === 'downloading' && (
                                  <button
                                    onClick={() => togglePauseResume(lesson.content)}
                                    className="p-1 bg-gray-500 rounded "
                                  >
                                    {download.paused ? (
                                      <FiPlay className="h-5 w-5" color="blue" />
                                    ) : (
                                      <FiPause className="h-5 w-5" color="red" />
                                    )}
                                  </button>
                                )}

                                {(!download || download.status === 'error') && (
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
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseList