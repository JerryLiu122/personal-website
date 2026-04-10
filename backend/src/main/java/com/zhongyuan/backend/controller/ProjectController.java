package com.zhongyuan.backend.controller;

import com.zhongyuan.backend.dto.CreateProjectRequest;
import com.zhongyuan.backend.dto.ProjectResponseDto;
import com.zhongyuan.backend.dto.UpdateProjectRequest;
import com.zhongyuan.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/projects")
    public List<ProjectResponseDto> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/projects/{slug}")
    public ProjectResponseDto getProjectBySlug(@PathVariable String slug) {
        return projectService.getProjectBySlug(slug);
    }

    @GetMapping("/public/projects")
    public List<ProjectResponseDto> getPublishedProjects() {
        return projectService.getPublishedProjects();
    }

    @GetMapping("/public/projects/{slug}")
    public ProjectResponseDto getPublishedProjectBySlug(@PathVariable String slug) {
        return projectService.getPublishedProjectBySlug(slug);
    }

    @PostMapping("/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDto createProject(@Valid @RequestBody CreateProjectRequest request) {
        return projectService.createProject(request);
    }

    @PutMapping("/projects/{id}")
    public ProjectResponseDto updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}