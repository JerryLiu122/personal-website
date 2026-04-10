import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicProjectsApi, type Project } from "../api/projectsApi";

function PublicProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchPublicProjectsApi();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Projects</h1>
                    <p className="mt-4 text-gray-600">
                        Public projects page. Only published projects appear here.
                    </p>
                </div>

                <button
                    onClick={loadProjects}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                >
                    Refresh
                </button>
            </div>

            {loading && <p className="mt-8">Loading projects...</p>}
            {error && <p className="mt-8 text-red-600">{error}</p>}

            {!loading && !error && projects.length === 0 && (
                <p className="mt-8 text-gray-600">No published projects found.</p>
            )}

            <div className="mt-8 grid gap-6">
                {projects.map((project) => (
                    <article
                        key={project.id}
                        className="rounded-2xl border border-gray-200 p-6 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold">{project.title}</h2>
                                <p className="mt-2 text-gray-600">{project.summary}</p>
                            </div>

                            {project.featured && (
                                <span className="rounded-full bg-black px-3 py-1 text-sm text-white">
                                    Featured
                                </span>
                            )}
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-gray-500">
                            <p>
                                <span className="font-medium text-gray-700">Slug:</span>{" "}
                                {project.slug}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Tech Stack:</span>{" "}
                                {project.techStack || "Not provided"}
                            </p>
                        </div>

                        <div className="mt-5 flex gap-3">
                            <Link
                                to={`/projects/${project.slug}`}
                                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                View Details
                            </Link>

                            {project.projectUrl && (
                                <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Live Demo
                                </a>
                            )}

                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    GitHub
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default PublicProjectsPage;