CREATE TABLE repo (
  id uniqueidentifier PRIMARY KEY,
  repo_name nvarchar(255) NOT NULL
);

CREATE TABLE ai_pr_review_file (
  id uniqueidentifier PRIMARY KEY,
  repo_id uniqueidentifier NOT NULL,
  pr_id int NOT NULL,
  file_path nvarchar(1024) NOT NULL,
  diff_content nvarchar(max) NOT NULL,
  diff_hash char(64) NOT NULL,
  has_issue bit NOT NULL,
  review_comment nvarchar(max),
  severity varchar(50),
  created_at datetime2 NOT NULL DEFAULT sysdatetime(),
  isAccepted bit NOT NULL DEFAULT 0
);

CREATE TABLE coding_convention (
  id uniqueidentifier PRIMARY KEY,
  repo_id uniqueidentifier NOT NULL,
  title nvarchar(255) NOT NULL,
  description nvarchar(max),
  category varchar(100),
  created_by nvarchar(255),
  created_at datetime2 NOT NULL DEFAULT sysdatetime(),
  is_active bit NOT NULL DEFAULT 1
);

CREATE TABLE rag_document (
  id uniqueidentifier PRIMARY KEY,
  repo_id uniqueidentifier NOT NULL,
  source_type varchar(50) NOT NULL,
  source_id uniqueidentifier NULL,
  content nvarchar(max) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT sysdatetime()
);

-- OPTION A (RECOMMENDED FOR NOW)
CREATE TABLE rag_embedding (
  id uniqueidentifier PRIMARY KEY,
  document_id uniqueidentifier NOT NULL,
  embedding varbinary(max) NOT NULL,
  model_name varchar(100) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT sysdatetime()
);

CREATE TABLE ai_review_rag_reference (
  id uniqueidentifier PRIMARY KEY,
  review_file_id uniqueidentifier NOT NULL,
  document_id uniqueidentifier NOT NULL,
  similarity_score float NOT NULL
);

-- FOREIGN KEYS
ALTER TABLE ai_pr_review_file
ADD CONSTRAINT fk_review_repo FOREIGN KEY (repo_id) REFERENCES repo(id);

ALTER TABLE coding_convention
ADD CONSTRAINT fk_convention_repo FOREIGN KEY (repo_id) REFERENCES repo(id);

ALTER TABLE rag_document
ADD CONSTRAINT fk_rag_repo FOREIGN KEY (repo_id) REFERENCES repo(id);

ALTER TABLE rag_embedding
ADD CONSTRAINT fk_embedding_doc FOREIGN KEY (document_id) REFERENCES rag_document(id);

ALTER TABLE ai_review_rag_reference
ADD CONSTRAINT fk_review_rag_review FOREIGN KEY (review_file_id) REFERENCES ai_pr_review_file(id);

ALTER TABLE ai_review_rag_reference
ADD CONSTRAINT fk_review_rag_doc FOREIGN KEY (document_id) REFERENCES rag_document(id);
