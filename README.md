# MultiResume

A simple in-browser web app to store resume sections and assemble multiple LaTeX resumes using a shared template. Built with [Vite](https://vitejs.dev) so it can be easily deployed to platforms like Vercel. All data lives in your browser's local storage.

## Development

1. Install dependencies with `npm install`.
2. Start a local dev server using `npm run dev` and open the printed URL in a browser.
3. Add summaries, experiences, projects, coursework, skills and honors in the **Sections** area.
4. Create one or more resumes and choose which sections belong in each resume.
5. Click **Show LaTeX** on any resume to generate the complete `.tex` source. Use the **Copy to Clipboard** button to copy it elsewhere.
6. Build a production bundle with `npm run build` (output in `dist/`). This build output can be deployed to Vercel or any static host.

The LaTeX template is based on `template.tex` and is embedded directly in the app.
