import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./VideoPlayer";
import PDFViewer from "./PDFViewer";
import { FaBook, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';


function ContentView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file } = location.state || {};
  // console.log(file,"file")

  if (!file) {
     // Redirect to home if no file is selected
    return (
      <div className="min-h-screen  flex items-center justify-center p-4" style={{ backgroundColor: "#b2ebf2" }}>
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-6 animate-bounce" style={{ color: "#d97706" }}>
          Welcome to Our Educational Platform
        </h1>
        <p className="mb-6 text-lg" style={{ color: "#1228A4" }}>
          Empowering you with knowledge and skills for a brighter future.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 rounded-xl shadow-sm" style={{ backgroundColor: "#b2ebf2" }}>
            <FaBook className="text-3xl mb-2 mx-auto" style={{ color: "#d97706" }} />
            <h3 className="text-xl font-semibold" style={{ color: "#1228A4" }}>Quality Resources</h3>
            <p style={{ color: "#1228A4" }}>Access a wide range of learning materials.</p>
          </div>
          <div className="p-4 rounded-xl shadow-sm" style={{ backgroundColor: "#b2ebf2" }}>
            <FaChalkboardTeacher className="text-3xl mb-2 mx-auto" style={{ color: "#d97706" }} />
            <h3 className="text-xl font-semibold" style={{ color: "#1228A4" }}>Expert Tutors</h3>
            <p style={{ color: "#1228A4" }}>Learn from industry professionals.</p>
          </div>
          <div className="p-4 rounded-xl shadow-sm" style={{ backgroundColor: "#b2ebf2" }}>
            <FaGraduationCap className="text-3xl mb-2 mx-auto" style={{ color: "#d97706" }} />
            <h3 className="text-xl font-semibold" style={{ color: "#1228A4" }}>Test</h3>
            <p style={{ color: "#1228A4" }}>Practice and assess your knowledge.</p>
          </div>
        </div>
        <button onClick={()=> navigate("/all-course")} className="py-2 px-6 rounded-full shadow-md transition duration-300" style={{ backgroundColor: "#d97706", color: "white" }}>
          Get Started
        </button>
      </div>
    </div>);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
      >
        Go Back
      </button>
      <div className="bg-white rounded-lg shadow p-6">
        {file?.type === 'video' ? (
          <VideoPlayer url={file?.url} />
        ) : (
          <PDFViewer url={file?.url} />
        )}
      </div>
    </div>
  );
}

export default ContentView;
