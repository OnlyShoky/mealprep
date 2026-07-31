# Meal Prep Codex (React Frontend)

This is the React frontend for Meal Prep Codex, migrated from the original Django project. 
It is built as a Single Page Application (SPA) designed to be hosted on static hosting services like Netlify.

## Tech Stack
- **Framework:** Vite + React (v18)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (v3) with a custom Sepia theme
- **Icons:** Font Awesome 6

## Getting Started for Beginners

If you don't know much about React or Node.js, don't worry! Follow these simple steps to run the site on your computer.

### Prerequisites
1. **Install Node.js**: You need Node.js to run the local development server. Download and install the LTS version from [nodejs.org](https://nodejs.org/). This will also install `npm` (Node Package Manager).

### Running the App Locally

1. Open your terminal (Command Prompt or PowerShell on Windows, Terminal on Mac).
2. Navigate to this folder (`frontend/`):
   ```bash
   cd path/to/recipe_project/frontend
   ```
3. Install the dependencies (you only need to do this once):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to the URL provided in the terminal (usually `http://localhost:5173`).
6. Any changes you make to the code will automatically update in the browser!

## Data Source Architecture

The application is built with a swappable data repository pattern. It currently uses a local JSON file containing 8 hand-crafted recipes.

**To switch data sources in the future:**
1. The app reads the `VITE_DATA_SOURCE` environment variable. By default, it is set to `local`.
2. When you're ready to connect to a real database (like Supabase), create a `.env` file in the root of the `frontend` folder.
3. Add the following to your `.env` file:
   ```env
   VITE_DATA_SOURCE=supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
4. Implement the data fetching logic inside `src/services/supabaseSource.js` (a stub is already provided).
5. The rest of the app will automatically use the new data source without needing to change any component code!

## Deployment

This app is pre-configured to be deployed on **Netlify**.

1. Create a free account on [Netlify](https://www.netlify.com/).
2. You can either drag-and-drop the compiled `dist` folder into Netlify, or connect your GitHub repository.
3. If connecting GitHub, Netlify will read the `netlify.toml` file automatically.
4. The `netlify.toml` handles the build command (`npm run build`) and ensures that page refreshes work correctly (SPA fallback routing).
