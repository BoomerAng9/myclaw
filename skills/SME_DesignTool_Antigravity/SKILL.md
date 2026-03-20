---
name: SME_DesignTool_Antigravity
description: AI-powered animated website design, generation, testing, and deployment using Antigravity IDE + Google Stitch + TestSprite
---

# SME DesignTool: Antigravity + Stitch + TestSprite Workflow

## Purpose
This skill enables Chicken Hawk and its `lil_hawks` (specifically `Designer_Ang` and `Coder_Ang`) to design, generate, test, and deploy animated production-ready websites using a fully AI-driven pipeline.

## Tool Stack

### 1. Google Stitch (Design → Code)
Stitch is a design-to-code generation tool accessible via MCP. It allows you to:
- **Create projects** to contain UI screens
- **Generate screens from text prompts** — describe a page and get a full UI design
- **Edit screens** — refine designs iteratively with natural language
- **Generate variants** — explore alternative layouts, color schemes, animations
- **Export code** — get production-ready HTML/CSS/JS from designs

#### Stitch MCP Commands
```
mcp_StitchMCP_create_project       → Create a new design project
mcp_StitchMCP_generate_screen      → Generate a screen from a text prompt
mcp_StitchMCP_edit_screens         → Edit existing screens with text
mcp_StitchMCP_generate_variants    → Create design alternatives
mcp_StitchMCP_list_screens         → List all screens in a project
mcp_StitchMCP_get_screen           → Get screen details and code
```

### 2. Antigravity IDE (Build + Debug)
Antigravity is the AI-powered IDE you are operating within. Use it to:
- Turn Stitch designs into fully functional applications
- Add 3D scroll animations, parallax effects, and micro-interactions
- Debug and fix issues using the `systematic-debugging` superpowers skill
- Run browser subagents to visually verify the output

### 3. TestSprite 2.1 (Automated QA)
TestSprite automatically scans websites to:
- Find visual bugs, layout breaks, and animation glitches
- Test responsiveness across devices (mobile, tablet, desktop)
- Verify accessibility compliance
- Integrate with GitHub to test PRs before merge

#### TestSprite Integration
```bash
# Install TestSprite CLI
npm install -g @testsprite/cli

# Run a full scan on a deployed URL
testsprite scan https://your-site.com --full

# Run on a local dev server
testsprite scan http://localhost:3000 --responsive --animations
```

## Workflow (Step-by-Step)

### Phase 1: Design
1. Use `mcp_StitchMCP_create_project` to create a new project
2. Use `mcp_StitchMCP_generate_screen_from_text` with a detailed prompt describing the page layout, colors, and animations desired
3. Review the screen, then use `edit_screens` or `generate_variants` to refine

### Phase 2: Build
1. Export the Stitch-generated code
2. Enhance with 3D scroll animations, GSAP/Framer Motion transitions, and parallax
3. Apply the `verification-before-completion` superpowers skill to ensure quality

### Phase 3: Test
1. Run `testsprite scan` on the built site
2. Fix any reported bugs using the `systematic-debugging` skill
3. Re-scan until all checks pass

### Phase 4: Deploy
1. Build the production bundle
2. Deploy to custom domain via Coolify or Netlify
3. Run a final TestSprite scan on the live URL
4. Package the evidence bundle (screenshots, test results, deploy logs)

## LUC Metering
All design generation calls through Stitch count toward the `tokens_out` service key. TestSprite scans count toward `container_hours`. The LUC `canExecute()` gate must pass before each phase.

## Integration with Chicken Hawk
Chicken Hawk dispatches this skill to `Designer_Ang` for visual work and `Coder_Ang` for implementation. The `Validator_Ang` runs the TestSprite scan as the review gate. This follows the standard pipeline:
```
Chicken Hawk → Picker_Ang → Designer_Ang (Stitch) → Coder_Ang (Build) → Validator_Ang (TestSprite) → Deploy
```
