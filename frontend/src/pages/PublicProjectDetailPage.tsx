import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublicProjectBySlugApi, type Project } from "../api/projectsApi";

function PublicProjectDetailPage() {
    const { slug } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            if (!slug) {
                setError("Project slug is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await fetchPublicProjectBySlugApi(slug);
                setProject(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [slug]);

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <Link
                to="/projects"
                className="inline-flex rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
                Back to Projects
            </Link>

            {loading && <p className="mt-8">Loading project...</p>}
            {error && <p className="mt-8 text-red-600">{error}</p>}

            {!loading && !error && project && (
                <article className="mt-8 rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold">{project.title}</h1>
                            <p className="mt-4 text-lg text-gray-600">{project.summary}</p>
                        </div>

                        {project.featured && (
                            <span className="rounded-full bg-black px-3 py-1 text-sm text-white">
                                Featured
                            </span>
                        )}
                    </div>

                    <div className="mt-8 grid gap-4 text-sm text-gray-600">
                        <p>
                            <span className="font-semibold text-gray-900">Slug:</span>{" "}
                            {project.slug}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Tech Stack:</span>{" "}
                            {project.techStack || "Not provided"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Status:</span>{" "}
                            {project.status}
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold">Description</h2>
                        <p className="mt-4 whitespace-pre-line text-gray-700">
                            {project.description || "No detailed description provided yet."}
                        </p>
                    </div>

                    {(project.projectUrl || project.githubUrl) && (
                        <div className="mt-8 flex gap-3">
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
                    )}
                </article>
            )}
        </div>
    );
}

export default PublicProjectDetailPage;