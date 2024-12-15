import {
  MoreVertical,
  LayoutDashboard,
  ChevronLast,
  ChevronFirst,
  Home,
  FileText,
  Briefcase,
  Mic,
  Clipboard,
  List,
  Vote,
  Settings,
} from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { NavLink, useParams, useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function TeacherSidebar({ children }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const { courseId } = useParams(); // Get courseId from the URL
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profile_picture: "",
  });
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the user information from the API
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/teacher/${authState.id}`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <aside className="">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Sidebar header with logo and expand/collapse button */}
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* Hide logo when sidebar is collapsed */}

          <img
            src="/logo.png"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="Logo"
          />

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar content */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 mb-8">
            <SidebarItem
              to={`/course/${courseId}/dashboard/teacher`}
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/lectures/teacher`}
              icon={<FileText size={20} />}
              text="Lectures"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/project/teacher`}
              icon={<Briefcase size={20} />}
              text="Projects"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/viva/teacher`}
              icon={<Mic size={20} />}
              text="Viva"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/assignments/teacher`}
              icon={<Clipboard size={20} />}
              text="Assignments"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/polls/teacher`}
              icon={<Vote size={20} />}
              text="Polls"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/quizzes/teacher`}
              icon={<List size={20} />}
              text="Quizzes"
              activeClassName="bg-blue-700"
            />
            <SidebarItem
              to={`/course/${courseId}/coursesettings/teacher`}
              icon={<Settings size={20} />}
              text="Settings"
              activeClassName="bg-blue-700"
              // alert={true}
            />
          </ul>
        </SidebarContext.Provider>

        {/* Sidebar footer with user info */}
        {/* Hide user info when sidebar is collapsed */}

        <div className="border-t flex items-center p-3 mt-10 ">
          <img
            src={`http://localhost:9090/profile_pictures/${userInfo.profile_picture}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{userInfo.name}</h4>
              <span className="text-xs text-gray-600">{userInfo.email}</span>
            </div>
            {/* <MoreVertical size={20} /> */}
          </div>
        </div>
      </nav>
    </aside>
  );
}

// SidebarItem component with icon and text
export function SidebarItem({ to, text, icon, alert }) {
  const { expanded } = useContext(SidebarContext);
  const [active, setActive] = useState(false);

  return (
    <li
      className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-gray-600"
          }
      `}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center w-full ${
            isActive ? setActive(true) : setActive(false)
          }`
        }
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-35 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
      </NavLink>

      {/* Tooltip for collapsed sidebar */}
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
