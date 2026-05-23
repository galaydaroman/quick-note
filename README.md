# quick-note

A minimalist, distraction-free, and lightning-fast web application to make quick notes. Built as a lightweight, modern frontend application using Vanilla JS/ESM, Custom Web Components, and Vite.

## Features

- **Minimalist Interface:** Zero clutter—just a clean, distraction-free page focused entirely on your writing.
- **Auto-Focusing & Editable:** Instantly focuses on loading so you can start typing immediately without clicking.
- **Support for Multiple Notes:**
  - Every note is assigned a unique, short, 4-character alphanumeric ID (generated using `nanoid`).
  - Active notes are tracked via the `?note=xxxx` URL query parameter, enabling direct bookmarking and sharing.
  - Listen to browser `popstate` events to allow back/forward history navigation seamlessly.
  - Automatically manages a registry of up to **100 notes** in `localStorage`, auto-purging older entries to conserve storage space.
- **History Content Navigator (Quick Switcher):**
  - Press **`Cmd + P`** (macOS) or **`Ctrl + P`** (Windows/Linux) to invoke a spotlight-like notes search overlay.
  - Filters your note catalog in real-time as you type.
  - **Dynamic Preview:** Moving through search items (or hovering over them) instantly previews the note's content in the editor behind the panel.
  - **Interactive Navigation:** Supports `ArrowUp`/`ArrowDown` for moving focus, `Enter` to open, and `Escape` to close/restore previous content and cursor positions.
  - **Full Accessibility:** Adheres to accessibility patterns using ARIA roles (`combobox`, `listbox`, `aria-activedescendant`), keyboard shortcuts, and automatic list auto-scrolling.
- **Dynamic Title Generation:** The title of each note in the navigator is dynamically parsed from the first non-empty text element/line in the note.
- **Debounced Auto-Saving:** Auto-saves your work to `localStorage` in the background with a 2-second debounce delay to minimize expensive DOM and write interactions.
- **Theme Toggle:** Effortlessly switch between dark and light themes, remembering your system preferences and manual toggles.

## Tech Stack

- **Build Tool:** [Vite](https://vite.dev/) (v8+)
- **Language:** JavaScript / ESM (Vanilla custom Web Components)
- **Dependencies:**
  - `debounce`: Debounces writing content to local storage.
  - `nanoid`: Generates short unique IDs for notes.
  - `nanoid-dictionary`: Supplies custom character dictionaries for IDs.
- **Deployment:** `gh-pages`

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. Clone the repository:
2. Install the dependencies:

```bash
npm install
```

### Development
To start the local development server with hot-module replacement (HMR):

```bash
npm run dev
```
Open the provided URL (usually http://localhost:5173) in your browser.

### Build
To compile and optimize the project for production assets:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

### Preview
To locally preview the production build:

```bash
npm run preview
```

### Deployment
This repository is pre-configured to build and deploy straight to GitHub Pages using the gh-pages script utility.

Run the following command to bundle production assets with the relative repository base path and push directly to the `gh-pages` branch without cluttering your git history:

```bash
npm run predeploy && npm run deploy
```

### License
This project is open source and available under the terms of the project's license configuration.
