---
name: talent-and-innovation-engine
description: preserve and reuse the original hidt-style workforce pathway matrix as an initiative-agnostic matching engine. use when chatgpt needs to turn initiative briefs, strategy plans, workforce documents, course catalogs, credential lists, learner or candidate profiles, regional labor inputs, or mixed source materials into a structured training-to-credential-to-role matching matrix. supports markdown-first outputs, agent-friendly tables, confidence scoring, weak-match flags, optional matrix deliverables, and visual-ready summaries for any country, city, institution, sector, or initiative.
---

# Talent and Innovation Engine

Use this skill to recreate the original HIDT matrix logic in a modern, agent-friendly form without changing its core rules.

The engine preserves the original matrix foundation and applies it to any initiative. It maps:
- initiative or sector need
- course and topic pathways
- target groups
- soft-skill overlays
- career stage fit
- course descriptions and levels
- credential paths
- role outcomes
- salary positioning
- confidence-ranked match logic

## Core rule

Do not deprecate the original matrix logic. Modernize it, extend it, and adapt it, but keep the OG structure and interpretation rules intact.

## Required operating behavior

1. Treat the original matrix as a workforce pathway engine, not a simple course list.
2. Preserve the original matrix fields and their intent.
3. Remove country-specific framing unless the user explicitly wants it.
4. Accept mixed input sources and normalize them into the matrix.
5. Output in markdown first unless the user requests another format.
6. When evidence is weak, do not force certainty. Flag it.
7. Rank matches with a transparent 0 to 100 confidence score.
8. Treat 80+ as strong fit, 60 to 79 as transition or emerging fit, and below 60 as weak fit.

## Permanent matrix foundation

Always preserve these fields as the base model. Do not remove them.

### Sheet or section 1: initiative pathway matrix
- Sector/Initiative
- Specific Courses/Topics
- Target Groups
- Soft Skills
- Entry-Level
- Mid-Level
- Senior-Level
- Executives
- Course Descriptions and Levels

### Sheet or section 2: credential to role mapping
- Certification
- Top 3 Jobs In Field
- Prerequisites
- Salary in local or requested markets

### Sheet or section 3: soft skill alignment
- Soft Skill Category
- Soft Skills Included
- Applicable Roles
- Skill Importance
- Demand Temperature
- Skill Level
- Entry Level Salary Range
- Manager Salary Range
- Executive Salary Range
- Trainer Market Rate if relevant

### Sheet or section 4: role and outcome crosswalk
- Course
- Sector
- Target Roles
- Expected Outcomes & Takeaways
- Certification Levels
- Reputable Institutions / Accreditation Bodies

## How to interpret inputs

Normalize all inputs into the same logic chain:

initiative need -> training pathway -> credential signal -> role pathway -> salary and career positioning

Possible inputs include:
- initiative briefs
- strategic plans
- city or national vision documents
- workforce development plans
- course catalogs
- credential lists
- learner or candidate profiles
- regional role and salary data
- institution or company skill needs
- age group or demographic segmentation

When sources conflict, prefer the most specific and current evidence. If the data remains unclear, say so.

## Matching workflow

### Step 1: identify the initiative frame
Extract:
- initiative name
- geography or institution
- priority sectors
- intended workforce outcomes
- target populations
- maturity or career levels addressed

### Step 2: identify the training pathways
Extract or infer:
- courses
- topic clusters
- domain skills
- soft skills
- learning level progression
- any practical or hands-on requirements

### Step 3: identify credential and recognition signals
Extract:
- certifications
- degrees or certificates
- prerequisite knowledge
- trusted institutions or awarding bodies
- evidence of hands-on skill validation when available

### Step 4: identify role outcomes
Map each training or credential pathway to:
- job families
- specific roles
- career stage fit
- industry placement
- salary range when available

### Step 5: score the strength of the match
Use the confidence model below.

### Step 6: deliver the result in the requested format
Default to markdown matrix plus markdown support tables.

## Confidence scoring model

Use a transparent 100-point scale.

### Scoring factors
- credential match
- practical hands-on experience
- transferable knowledge
- target industry alignment
- role or task similarity
- geography or company fit
- learner or candidate intent

### Default weighting
Use this default weighting unless the user provides a different model:
- Practical hands-on experience: 25
- Role or task similarity: 20
- Target industry alignment: 15
- Credential match: 15
- Transferable knowledge: 10
- Geography or company fit: 10
- Learner or candidate intent: 5

Total possible: 100

### Score interpretation
- 80 to 100: strong fit or great fit
- 60 to 79: transition fit, entry fit, or developing fit
- below 60: weak fit

### Weak-match rule
If the evidence does not support a strong mapping, write exactly:

`match is not strong; find a better match criteria.`

### Missing evidence rule
If salary, credential, role, or pathway evidence is missing, label the field as `insufficient evidence` rather than inventing certainty. Lower the confidence score accordingly.

## Output rules

### Default output
Return:
1. a markdown initiative pathway matrix
2. markdown support tables for credential mapping, soft-skill alignment, and role outcomes
3. a confidence-ranked match table when matching people, cohorts, or candidate profiles

### Optional output modes
If requested, also prepare the content for:
- matrix workbook deliverables
- pdf summaries
- powerpoint summaries
- ascii display blocks
- chart or table visualization handoff

When the user does not specify a format, stay in markdown and table form.

## Markdown output pattern

Use clean headings and readable tables. Keep labels literal and stable so agents can parse them easily.

### Required top sections
- Initiative Summary
- Initiative Pathway Matrix
- Credential to Role Mapping
- Soft Skill Alignment
- Role Outcome Crosswalk
- Confidence Match Table
- Gaps and Weak Matches

## Matrix construction rules

1. Keep all original columns present in the base matrix structure.
2. It is acceptable to hide, extend, or supplement columns in downstream products, but never discard the base fields in the core model.
3. Keep course descriptions tied to level language such as beginner, intermediate, advanced, expert, or equivalent.
4. Keep career stage markers explicit.
5. Pair technical pathways with soft skills whenever evidence supports it.
6. When practical training matters, elevate hands-on evidence in the score.
7. Separate initiative-scope logic from person-match logic when both are present.

## Decision rules for two common use cases

### A. Initiative design mode
Use when the task is to build a training and workforce matrix for an initiative.

Focus on:
- sectors
- pathways
- courses
- credentials
- role demand
- salary positioning
- target groups

### B. Person or cohort matching mode
Use when the task is to assess a learner, candidate, or target group against roles.

Focus on:
- existing training
- credentials
- practical skills
- transferable knowledge
- role alignment
- confidence score

Keep these modes distinct, but allow them to connect.

## Use the preserved blueprint from the original matrix

The original matrix logic should guide interpretation:
- initiatives are not one-off classes; they are training ecosystems
- credentials are positioning signals, not just completion markers
- soft skills are employability multipliers, not generic add-ons
- career stage fit matters
- training should make the learner or candidate more appointable to a role family

## Examples of valid initiative use

Use this skill for cases such as:
- recreating the original HIDT-style initiative matrix
- adapting the matrix to a national workforce initiative such as build back better
- adapting the matrix to a city or regional strategy such as a 2040 vision plan
- mapping training and credentials to workforce outcomes for a university, agency, ministry, or company

## Resources

Use these references when needed:
- `references/tie-template.md` for the reusable markdown template
- `references/scoring-model.md` for the confidence logic
- `references/use-cases.md` for worked examples and application rules
