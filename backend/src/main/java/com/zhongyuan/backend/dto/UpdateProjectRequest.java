package com.zhongyuan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String summary;
    private String description;
    private String techStack;
    private String projectUrl;
    private String githubUrl;
    private String imageUrl;
    private Boolean featured;
    private Integer displayOrder;
    private String status;
}