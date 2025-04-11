import { useNavigate } from "react-router-dom";

function CourseListNav({ courses, onContentSelect, onDownload, downloads }) {
    const navigate = useNavigate();
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Courses</h1>
            {courses.map(course => (
                <div key={course._id} className="mb-6">
                    <h2 className="text-2xl font-semibold">{course.name}</h2>
                    {course.content.map(week => (
                        <h3 
                            key={week._id} 
                            className="cursor-pointer text-lg text-blue-500 mt-2"
                            onClick={() => navigate(`/course/${course._id}/week/${week._id}`)}
                        >
                            {week.week}
                        </h3>
                    ))}
                </div>
            ))}
        </div>
    );
}
export default CourseListNav