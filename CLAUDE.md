# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Customized fork of Mozilla's PDF.js (upstream: `mozilla/pdf.js`). Fork adds signature support, parent window event messaging, base64 document export, and sidebar state management. Branch `develop` holds customizations; `master` is the main merge target.

## Build & Development Commands

```bash
# Install dependencies
npm ci

# Build
npx gulp generic          # Standard build → build/generic/
npx gulp minified         # Production minified build
npx gulp generic-legacy   # Legacy browser build

# Development server (port 8888)
npx gulp server

# Linting
npx gulp lint             # ESLint + stylelint

# Tests
npx gulp test             # Full test suite
npx gulp unittest         # Unit tests only
npx gulp unittestcli      # CLI-based unit tests
npx gulp integrationtest  # Integration tests
npx gulp browsertest      # Puppeteer browser tests
npx gulp fonttest         # Font tests
```

Node requirement: 20.16.0 || >=22.3.0

## Architecture

Three-layer separation:

- **`src/core/`** — PDF specification parser (annotations, fonts, document structure, content streams). Runs in a Web Worker.
- **`src/display/`** — Rendering API (`api.js` is the main public API), canvas renderer, text/annotation layers, and editors (freetext, draw, signature, stamp, ink). Entry points: `src/pdf.js` (main) and `src/pdf.worker.js` (worker).
- **`web/`** — Viewer UI application. `app.js` is the main app, `viewer.html` is the HTML shell. Includes toolbar, sidebar, find controller, and signature manager.

`src/shared/` contains utilities shared between core and display layers.

## Build System

Gulp 5 (`gulpfile.mjs`, ~2600 lines) orchestrates Webpack + Babel bundling. A custom Babel plugin (`external/builder/babel-plugin-pdfjs-preprocessor.mjs`) handles conditional compilation. Build outputs are ES modules (`.mjs`) with source maps in `build/`.

## Fork Customizations

Custom changes live in these files (check recent commits on `develop`):
- `web/app.js` — sidebar state options, `getBase64Document()`, parent postMessage events
- `src/display/editor/draw.js` — document change events
- `src/display/editor/editor.js` — editor event additions
- `web/signature_manager.js` — signature handling
- `web/viewer.html` — viewer shell modifications

## Code Style

- Prettier: 80-char lines, 2-space indent, trailing commas (ES5), semicolons
- ESLint with plugins: import, jasmine, no-unsanitized, perfectionist, unicorn
- LF line endings, UTF-8, final newline required
