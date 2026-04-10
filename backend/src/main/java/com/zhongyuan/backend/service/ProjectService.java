package com.zhongyuan.backend.service;

import com.zhongyuan.backend.dto.CreateProjectRequest;
import com.zhongyuan.backend.dto.ProjectResponseDto;
import com.zhongyuan.backend.dto.UpdateProjectRequest;
import com.zhongyuan.backend.entity.Project;
import com.zhongyuan.backend.exception.DuplicateResourceException;
import com.zhongyuan.backend.exception.ResourceNotFoundException;
import com.zhongyuan.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private static final String STATUS_PUBLISHED = "PUBLISHED";

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponseDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ProjectResponseDto getProjectBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));
        return toDto(project);
    }

    public List<ProjectResponseDto> getPublishedProjects() {
        return projectRepository.findAllByStatusOrderByDisplayOrderAscIdDesc(STATUS_PUBLISHED)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ProjectResponseDto getPublishedProjectBySlug(String slug) {
        Project project = projectRepository.findBySlugAndStatus(slug, STATUS_PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Published project not found with slug: " + slug));
        return toDto(project);
    }

    public ProjectResponseDto createProject(CreateProjectRequest request) {
        if (projectRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Project slug already exists: " + request.getSlug());
        }

        Project project = new Project();
        applyCreateRequest(project, request);

        Project savedProject = projectRepository.save(project);
        return toDto(savedProject);
    }

    public ProjectResponseDto updateProject(Long id, UpdateProjectRequest request) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (!existingProject.getSlug().equals(request.getSlug())
                && projectRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Project slug already exists: " + request.getSlug());
        }

        applyUpdateRequest(existingProject, request);

        Project updatedProject = projectRepository.save(existingProject);
        return toDto(updatedProject);
    }

    public void deleteProject(Long id) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        projectRepository.delete(existingProject);
    }

    private void applyCreateRequest(Project project, CreateProjectRequest request) {
        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setSummary(request.getSummary());
        project.setDescription(request.getDescription());
        project.setTechStack(request.getTechStack());
        project.setProjectUrl(request.getProjectUrl());
        project.setGithubUrl(request.getGithubUrl());
        project.setImageUrl(request.getImageUrl());
        project.setFeatured(request.getFeatured());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setStatus(request.getStatus());
    }

    private void applyUpdateRequest(Project project, UpdateProjectRequest request) {
        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setSummary(request.getSummary());
        project.setDescription(request.getDescription());
        project.setTechStack(request.getTechStack());
        project.setProjectUrl(request.getProjectUrl());
        project.setGithubUrl(request.getGithubUrl());
        project.setImageUrl(request.getImageUrl());
        project.setFeatured(request.getFeatured());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setStatus(request.getStatus());
    }

    private ProjectResponseDto toDto(Project project) {
        ProjectResponseDto dto = new ProjectResponseDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setSlug(project.getSlug());
        dto.setSummary(project.getSummary());
        dto.setDescription(project.getDescription());
        dto.setTechStack(project.getTechStack());
        dto.setProjectUrl(project.getProjectUrl());
        dto.setGithubUrl(project.getGithubUrl());
        dto.setImageUrl(project.getImageUrl());
        dto.setFeatured(project.getFeatured());
        dto.setDisplayOrder(project.getDisplayOrder());
        dto.setStatus(project.getStatus());
        return dto;
    }
}