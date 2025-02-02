import React, { useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer/Footer";
import ViewCourse from "@/views/admin/courses/ViewCourse";
import { routes } from "./../../routes";
import QuestionList from "@/views/admin/questions/QuestionList";
import QuestionDetail from "@/views/admin/questions/QuestionDetail";
import { useSelector } from "react-redux";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
    const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
    const { questions } = useSelector((state) => state.auth);

  // const { userInfo } = useSelector((state) => state.auth);
  const questionData = {
    status: "success",
    data: 
  [
      {
          "_id": "664c67e6248a761a4728c052",
          "name": "DICTION/PHONETICS",
          "school": "6603e6e06e7e286c38da1ea1",
          "term": 1,
          "class": "KG 1",
          "type": "video",
          "isPublish": true,
          "content": [
              {
                  "week": "1",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Course Objective",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/KG%201%20TERMS%20%26%20OBJECTIVE.mp4",
                          "_id": "664c67e6248a761a4728c054"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 1A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 1.mp4",
                          "_id": "664c6879248a761a4728c0c5"
                      },
                      {
                          "number": "Lesson 3",
                          "title": "Diction/Phonetics Lesson 1B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 1B.mp4",
                          "_id": "664c6879248a761a4728c0c6"
                      }
                  ],
                  "questions": [],
                  "_id": "664c67e6248a761a4728c053"
              },
              {
                  "week": "2",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 2A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 2A.mp4",
                          "_id": "664c6ef6248a761a4728c26f"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 2B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 2B.mp4",
                          "_id": "664c6ef6248a761a4728c270"
                      }
                  ],
                  "questions": [],
                  "_id": "664c6ef6248a761a4728c26e"
              },
              {
                  "week": "3",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 3A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 3A.mp4",
                          "_id": "664c7118248a761a4728c294"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 3B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 3B.mp4",
                          "_id": "664c7118248a761a4728c295"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7118248a761a4728c293"
              },
              {
                  "week": "4",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 4A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 4A.mp4",
                          "_id": "664c7341248a761a4728c2ec"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 4B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 4B.mp4",
                          "_id": "664c7341248a761a4728c2ed"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7341248a761a4728c2eb"
              },
              {
                  "week": "5",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 5A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 5A.mp4",
                          "_id": "664c7341248a761a4728c2ef"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 5B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 5B.mp4",
                          "_id": "664c7341248a761a4728c2f0"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7341248a761a4728c2ee"
              },
              {
                  "week": "6",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 6A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 6A.mp4",
                          "_id": "664c7576248a761a4728c457"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 6B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 6B.mp4",
                          "_id": "664c7576248a761a4728c458"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7576248a761a4728c456"
              },
              {
                  "week": "7",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 7A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 7A.mp4",
                          "_id": "664c7576248a761a4728c45a"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 7B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 7B.mp4",
                          "_id": "664c7576248a761a4728c45b"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7576248a761a4728c459"
              },
              {
                  "week": "8",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 8A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 8A.mp4",
                          "_id": "664c77a0248a761a4728c4ed"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 8B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 8B.mp4",
                          "_id": "664c77a0248a761a4728c4ee"
                      }
                  ],
                  "questions": [],
                  "_id": "664c77a0248a761a4728c4ec"
              },
              {
                  "week": "9",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 9A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 9A.mp4",
                          "_id": "664c77a0248a761a4728c4f0"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 9B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 9B.mp4",
                          "_id": "664c77a0248a761a4728c4f1"
                      }
                  ],
                  "questions": [],
                  "_id": "664c77a0248a761a4728c4ef"
              },
              {
                  "week": "10",
                  "lessons": [
                      {
                          "number": "Lesson 1",
                          "title": "Diction/Phonetics Lesson 10A",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 10A.mp4",
                          "_id": "664c7906248a761a4728c588"
                      },
                      {
                          "number": "Lesson 2",
                          "title": "Diction/Phonetics Lesson 10B",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/LESSON 10B.mp4",
                          "_id": "664c7906248a761a4728c589"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7906248a761a4728c587"
              },
              {
                  "week": "11",
                  "lessons": [
                      {
                          "number": "Lesson Q/A",
                          "title": "Question and Answers",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/KG 1 FIRST TERM.mp4",
                          "_id": "664c7906248a761a4728c58b"
                      }
                  ],
                  "questions": [],
                  "_id": "664c7906248a761a4728c58a"
              }
          ]
      },
      {
          "_id": "6789fc5a463f534434226e38",
          "name": "test",
          "school": "6603e6e06e7e286c38da1ea1",
          "term": 1,
          "class": "KG 1",
          "isPublish": true,
          "content": [
              {
                  "week": " surd",
                  "lessons": [
                      {
                          "number": "1",
                          "title": "surd",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/Vite-React.mp4",
                          "_id": "6789fc5a463f534434226e3a"
                      }
                  ],
                  "questions": [
                      {
                          "text": "what is surd",
                          "options": [
                              "math equation",
                              "math topic",
                              "math expression",
                              "values in square root"
                          ],
                          "correctOption": 4,
                          "_id": "6789fc5a463f534434226e3b"
                      },
                      {
                          "text": "what is algorithm",
                          "options": [
                              "algorithm",
                              "test 1",
                              "test2",
                              "algorithm 2"
                          ],
                          "correctOption": 1,
                          "_id": "678ba30b84ff57117d0d5968"
                      }
                  ],
                  "_id": "6789fc5a463f534434226e39"
              },
              {
                  "week": " algo",
                  "lessons": [
                      {
                          "number": "2",
                          "title": "trigonometry",
                          "content": "https://trenova.nyc3.digitaloceanspaces.com/NSE%20Election%20Notification%20%28Id%20-%20113382%29.pdf",
                          "_id": "6789fc5a463f534434226e3d"
                      }
                  ],
                  "questions": [
                      {
                          "text": "define cosine as an angle",
                          "options": [
                              "108",
                              "106",
                              "155",
                              "180"
                          ],
                          "correctOption": 4,
                          "_id": "6789fc5a463f534434226e3e"
                      },
                      {
                          "text": "sine wave is a sign of what inverter",
                          "options": [
                              "pulse",
                              "squre",
                              "cos",
                              "sine"
                          ],
                          "correctOption": 2,
                          "_id": "678ba30b84ff57117d0d596c"
                      },
                      {
                          "text": "https://trenova.nyc3.digitaloceanspaces.com/test1.mp4",
                          "options": [
                              "its a video",
                              "its not a video",
                              "its a text file",
                              "its nota text file"
                          ],
                          "correctOption": 1,
                          "_id": "678ba30b84ff57117d0d596d"
                      }
                  ],
                  "_id": "6789fc5a463f534434226e3c"
              }
          ]
      }
  ]
  };
  
  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={handleClose} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[255px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"LearnNova"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="mx-auto mb-auto h-full min-h-[74vh] p-2 pt-5 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route path="/viewcoursedetails/:id" element={<ViewCourse />} />
                {/* <Route path="/questions" element={<QuestionList questions={questionData.data} />} /> */}
          <Route path="/question/:questionId" element={<QuestionDetail questions={questions} />} />
        
                <Route
                  path="/"
                  element={<Navigate to="/all-course" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
