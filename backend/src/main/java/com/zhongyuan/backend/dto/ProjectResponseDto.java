package com.zhongyuan.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectResponseDto {
    private Long id;
    private String title;
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