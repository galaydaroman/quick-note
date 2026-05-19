# quick-note

A minimalist, distraction-free, and lightning-fast web application to make a quick note. Built as a lightweight, modern frontend application using Vite.

## Features

- **Minimalist Interface:** Zero clutter—just an open, editable page ready for your thoughts.
- **Auto-Focusing & Editable:** Instantly focused upon loading so you can start typing immediately.
- **Theme Toggle:** Quick toggle button to switch between dark and light environments easily.
- **Optimized Performance:** Uses debouncing techniques to handle high-frequency interactions efficiently.

## Tech Stack

- **Build Tool:** [Vite](https://vite.dev/) (v8+)
- **Language:** JavaScript / ESM (Module type)
- **Dependencies:** `debounce`
- **Deployment:** `gh-pages`

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

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

Run the following command to bundle production assets with the relative repository base path and push directly to the gh-pages branch without clattering your git history:

```bash
npm run predeploy && npm run deploy
```

### License
This project is open source and available under the terms of the project's license configuration.
