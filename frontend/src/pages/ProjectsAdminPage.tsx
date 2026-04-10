import { useEffect, useState } from "react";
import {
    buildBasicAuthHeader,
    createProjectApi,
    deleteProjectApi,
    fetchProjectsApi,
    updateProjectApi,
    type Project,
    type ProjectForm,
} from "../api/projectsApi";

const initialForm: ProjectForm = {
    title: "",
    slug: "",
    summary: "",
    description: "",
    techStack: "",
    projectUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    displayOrder: 0,
    status: "DRAFT",
};

function ProjectsAdminPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<ProjectForm>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const getAuthHeader = () => buildBasicAuthHeader(adminUsername, adminPassword);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchProjectsApi();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: number, title: string) => {
        const confirmed = window.confirm(`Delete project "${title}"?`);
        if (!confirmed) return;

        try {
            const authHeader = getAuthHeader();
            await deleteProjectApi(id, authHeader);

            setProjects((prev) => prev.filter((project) => project.id !== id));

            if (editingId === id) {
                setEditingId(null);
                setForm(initialForm);
                setSubmitError("");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Unknown error");
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setSubmitError("");
        setForm({
            title: project.title,
            slug: project.slug,
            summary: project.summary || "",
            description: project.description || "",
            techStack: project.techStack || "",
            projectUrl: project.projectUrl || "",
            githubUrl: project.githubUrl || "",
            imageUrl: project.imageUrl || "",
            featured: project.featured,
            displayOrder: project.displayOrder,
            status: project.status,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
        setSubmitError("");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        if (name === "displayOrder") {
            setForm((prev) => ({ ...prev, [name]: Number(value) }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");

        try {
            const authHeader = getAuthHeader();
            const isEditing = editingId !== null;

            const payload: ProjectForm = {
                ...form,
                slug: form.slug.trim().toLowerCase(),
            };

            const data = isEditing
                ? await updateProjectApi(editingId, payload, authHeader)
                : await createProjectApi(payload, authHeader);

            if (isEditing) {
                setProjects((prev) =>
                    prev.map((project) => (project.id === editingId ? data : project))
                );
            } else {
                setProjects((prev) => [...prev, data]);
            }

            setForm(initialForm);
            setEditingId(null);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-4xl font-bold">Project Admin</h1>
            <p className="mt-3 text-lg text-gray-600">Manage your projects</p>

            <div className="mt-10 rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                        {editingId ? "Edit Project" : "Add Project"}
                    </h2>

                    {editingId && (
                        <button
                            onClick={handleCancelEdit}
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                    <div className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="text-lg font-medium">Admin Authentication</h3>

                        <input
                            type="text"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            placeholder="Admin username"
                            className="rounded-lg border px-4 py-3"
                        />

                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Admin password"
                            className="rounded-lg border px-4 py-3"
                        />
                    </div>

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        placeholder="Slug"
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="summary"
                        value={form.summary}
                        onChange={handleChange}
                        placeholder="Summary"
                        className="rounded-lg border px-4 py-3"
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={4}
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="techStack"
                        value={form.techStack}
                        onChange={handleChange}
                        placeholder="Tech Stack"
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="projectUrl"
                        value={form.projectUrl}
                        onChange={handleChange}
                        placeholder="Project URL"
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="githubUrl"
                        value={form.githubUrl}
                        onChange={handleChange}
                        placeholder="GitHub URL"
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        name="displayOrder"
                        type="number"
                        value={form.displayOrder}
                        onChange={handleChange}
                        placeholder="Display Order"
                        className="rounded-lg border px-4 py-3"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="rounded-lg border px-4 py-3"
                    >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                    </select>

                    <label className="flex items-center gap-2">
                        <input
                            name="featured"
                            type="checkbox"
                            checked={form.featured}
                            onChange={handleChange}
                        />
                        Featured
                    </label>

                    {submitError && <p className="text-red-600">{submitError}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
                    >
                        {submitting
                            ? editingId
                                ? "Updating..."
                                : "Creating..."
                            : editingId
                                ? "Update Project"
                                : "Add Project"}
                    </button>
                </form>
            </div>

            <div className="mt-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Projects</h2>
                    <button
                        onClick={fetchProjects}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Refresh
                    </button>
                </div>

                {loading && <p className="mt-4">Loading projects...</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}

                {!loading && !error && projects.length === 0 && (
                    <p className="mt-4 text-gray-600">No projects found.</p>
                )}

                <div className="mt-6 grid gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-xl border border-gray-200 p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <span className="rounded bg-gray-100 px-3 py-1 text-sm">
                                    {project.status}
                                </span>
                            </div>

                            <p className="mt-2 text-gray-600">{project.summary}</p>

                            <p className="mt-3 text-sm text-gray-500">
                                <span className="font-medium">Slug:</span> {project.slug}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                <span className="font-medium">Tech Stack:</span>{" "}
                                {project.techStack}
                            </p>

                            <div className="mt-4 flex gap-3">
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

                                <button
                                    onClick={() => handleEdit(project)}
                                    className="rounded-lg border border-blue-300 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(project.id, project.title)}
                                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectsAdminPage;