function CourseDetails({ courses, onContentSelect, onDownload, downloads }) {
  const { courseId, weekId } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c._id === courseId);
  const week = course?.content.find(w => w._id === weekId);

  if (!course || !week) {
      return <div className="p-4 text-red-500">Course or Week not found!</div>;
  }

  return (
      <div className="p-6 min-h-screen bg-gray-100">
          <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded">Back</button>
          <h1 className="text-3xl font-bold">{course.name} - {week.week}</h1>
          <div className="mt-4 space-y-4">
              {week.lessons.map(lesson => {
                  const download = downloads[lesson.content];
                  const isVideo = !lesson.content.toLowerCase().endsWith('.pdf');
                  return (
                      <div key={lesson._id} className="flex items-center justify-between">
                          <div className="flex items-center">
                              {isVideo ? <FiVideo className="h-5 w-5 mr-2" /> : <FiFile className="h-5 w-5 mr-2" />}
                              <span className="cursor-pointer hover:text-blue-500" onClick={() => onContentSelect({ url: lesson.content, type: isVideo ? 'mp4' : 'pdf' })}>{lesson.title}</span>
                          </div>
                          <button onClick={() => onDownload(lesson)} className="p-1 hover:bg-gray-100 rounded">
                              <FiDownloadCloud className="h-5 w-5" />
                          </button>
                      </div>
                  );
              })}
          </div>
      </div>
  );
}
export default CourseDetails