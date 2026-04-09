CREATE TABLE admin_users (
                             id BIGSERIAL PRIMARY KEY,
                             username VARCHAR(50) NOT NULL UNIQUE,
                             password_hash VARCHAR(255) NOT NULL,
                             email VARCHAR(100) NOT NULL UNIQUE,
                             role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
                          id BIGSERIAL PRIMARY KEY,
                          title VARCHAR(150) NOT NULL,
                          slug VARCHAR(150) NOT NULL UNIQUE,
                          summary VARCHAR(300),
                          description TEXT,
                          tech_stack VARCHAR(500),
                          project_url VARCHAR(255),
                          github_url VARCHAR(255),
                          image_url VARCHAR(255),
                          featured BOOLEAN NOT NULL DEFAULT FALSE,
                          display_order INT NOT NULL DEFAULT 0,
                          status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
                            id BIGSERIAL PRIMARY KEY,
                            title VARCHAR(200) NOT NULL,
                            slug VARCHAR(200) NOT NULL UNIQUE,
                            excerpt VARCHAR(500),
                            content TEXT NOT NULL,
                            cover_image_url VARCHAR(255),
                            category VARCHAR(100),
                            tags VARCHAR(255),
                            status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                            published_at TIMESTAMP,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_messages (
                                  id BIGSERIAL PRIMARY KEY,
                                  name VARCHAR(100) NOT NULL,
                                  email VARCHAR(150) NOT NULL,
                                  message TEXT NOT NULL,
                                  is_replied BOOLEAN NOT NULL DEFAULT FALSE,
                                  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);