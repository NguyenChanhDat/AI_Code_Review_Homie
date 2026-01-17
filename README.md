# AI-Powered Source Code Quality Assessment System

## Developing README

Please have a look at docs/ DEV.md

## Overview

This project aims to build an AI-powered system for automated source code quality assessment.  
The system supports customizable review rules, quantitative evaluation of code quality, and advanced dashboards for both developers and technical managers.  
Beyond traditional code review, the system also focuses on transparency, performance measurement, and infrastructure efficiency.

---

## I. Review Features

### 1. Custom Review Rules and Coding Principles

- Allows users to define **custom review rules** based on team-specific coding standards.
- Supports adding **coding principles** (e.g. clean code, SOLID, security best practices).
- Rules can be enabled, disabled, or prioritized per repository or project.
- Designed to adapt to different teams and evolving coding conventions.

### 2. Boilerplate Code Awareness

- Users can register **boilerplate code templates** (e.g. common configs, setup files).
- The system recognizes boilerplate patterns and avoids redundant or noisy feedback.
- Helps improve review accuracy and reduces unnecessary AI comments.

---

## II. Evaluation Features

### 1. Code Quality Grading System

- Each Merge Request (MR) is evaluated using a **grading scale**.
- The system generates:
  - Overall code quality score
  - Rule-level and category-level scores
- Enables objective comparison between MRs and tracks quality over time.

### 2. Contributor Performance Dashboards

Dashboards provide insights into individual and team-level code quality trends:

- Code quality score per contributor:
  - Weekly
  - Monthly
  - Yearly
- Improvement trends and consistency indicators
- Contribution-based quality metrics to support fair and data-driven performance reviews

> These metrics are designed as **decision-support tools**, not surveillance mechanisms.

---

## III. AI System & Infrastructure Efficiency Dashboard

To ensure cost control, scalability, and system transparency, the project includes an infrastructure-focused dashboard.

### 1. AI Resource Usage Monitoring

- Token consumption per:
  - Merge Request
  - Repository
  - Contributor
- Average tokens per file and per lines of code (LOC)
- Estimated AI processing cost based on token usage
- Identification of expensive review rules or configurations

### 2. Model Performance Metrics

- Average response time per review
- Latency breakdown:
  - Preprocessing
  - Model inference
  - Post-processing
- Review throughput (MRs/hour, files/minute)
- Cache hit ratio for repeated patterns and boilerplate code

### 3. Review Effectiveness Analysis

- Percentage of AI suggestions accepted or applied by developers
- Repeated violations after AI feedback (false positive indicator)
- Code quality improvement before and after review
- Ranking of review rules based on practical impact

---

## IV. Infrastructure Health Monitoring

- CPU and memory usage during review processes
- Review queue length and processing backlog
- Error and failure rates (timeouts, model errors)
- Peak usage analysis to support scalability planning

---

## V. Dashboard Structure Summary

The system provides three main dashboard categories:

1. **Code Quality Dashboard**
   - Scores, violations, improvements, and trends

2. **Contributor Dashboard**
   - Individual and team-level performance insights

3. **AI System & Infrastructure Dashboard**
   - Token usage, cost estimation, latency, and system efficiency

---

## VI. Project Scope and Research Value

This project goes beyond automated code review by:

- Introducing measurable and explainable quality metrics
- Supporting data-driven technical and managerial decisions
- Addressing real-world constraints such as AI cost and system performance
- Providing a foundation for future research in AI-assisted software engineering
