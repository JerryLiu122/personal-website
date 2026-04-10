import { Link, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectsAdminPage from "./pages/ProjectsAdminPage";
import PublicProjectDetailPage from "./pages/PublicProjectDetailPage";
import PublicProjectsPage from "./pages/PublicProjectsPage";
import ResumePage from "./pages/ResumePage";

function App() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <header className="border-b border-gray-200">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-bold">
                        Zhongyuan Liu
                    </Link>

                    <nav className="flex gap-6 text-sm font-medium">
                        <Link to="/" className="hover:text-gray-600">
                            Home
                        </Link>
                        <Link to="/about" className="hover:text-gray-600">
                            About
                        </Link>
                        <Link to="/projects" className="hover:text-gray-600">
                            Projects
                        </Link>
                        <Link to="/resume" className="hover:text-gray-600">
                            Resume
                        </Link>
                        <Link to="/contact" className="hover:text-gray-600">
                            Contact
                        </Link>
                        <Link to="/admin/projects" className="hover:text-gray-600">
                            Admin
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/projects" element={<PublicProjectsPage />} />
                    <Route path="/projects/:slug" element={<PublicProjectDetailPage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin/projects" element={<ProjectsAdminPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;