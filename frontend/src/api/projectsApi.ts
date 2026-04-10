const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiProject = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    techStack: string;
    projectUrl: string;
    githubUrl: string;
    imageUrl: string;
    featured: boolean;
    displayOrder: number;
    status: "DRAFT" | "PUBLISHED";
};

export type Project = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    techStack: string;
    techStackList: string[];
    projectUrl: string;
    githubUrl: string;
    imageUrl: string;
    featured: boolean;
    displayOrder: number;
    status: "DRAFT" | "PUBLISHED";
};

export type ProjectForm = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    techStack: string;
    projectUrl: string;
    githubUrl: string;
    imageUrl: string;
    featured: boolean;
    displayOrder: number;
    status: "DRAFT" | "PUBLISHED";
};

const mapApiProjectToProject = (project: ApiProject): Project => {
    const techStackList = project.techStack
        ? project.techStack
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    return {
        ...project,
        techStackList,
    };
};

export const buildBasicAuthHeader = (username: string, password: string) => {
    if (!username || !password) {
        throw new Error("Admin username and password are required");
    }

    return "Basic " + btoa(`${username}:${password}`);
};

export const fetchProjectsApi = async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE_URL}/api/projects`);

    if (!res.ok) {
        throw new Error("Failed to fetch projects");
    }

    const data: ApiProject[] = await res.json();
    return data.map(mapApiProjectToProject);
};

export const fetchPublicProjectsApi = async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE_URL}/api/public/projects`);

    if (!res.ok) {
        throw new Error("Failed to fetch public projects");
    }

    const data: ApiProject[] = await res.json();
    return data.map(mapApiProjectToProject);
};

export const fetchPublicProjectBySlugApi = async (slug: string): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/public/projects/${slug}`);

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Project not found");
        }
        throw new Error("Failed to fetch project");
    }

    const data: ApiProject = await res.json();
    return mapApiProjectToProject(data);
};

export const createProjectApi = async (
    payload: ProjectForm,
    authHeader: string
): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await res.json() : null;

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("Unauthorized: invalid admin credentials");
        }
        throw new Error(data?.message || "Failed to create project");
    }

    return mapApiProjectToProject(data as ApiProject);
};

export const updateProjectApi = async (
    id: number,
    payload: ProjectForm,
    authHeader: string
): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await res.json() : null;

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("Unauthorized: invalid admin credentials");
        }
        throw new Error(data?.message || "Failed to update project");
    }

    return mapApiProjectToProject(data as ApiProject);
};

export const deleteProjectApi = async (
    id: number,
    authHeader: string
): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: authHeader,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("Unauthorized: invalid admin credentials");
        }
        throw new Error("Failed to delete project");
    }
};