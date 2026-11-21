# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Production API configuration (Vercel)

The frontend reads the Flask API origin from `import.meta.env.VITE_API_URL` in
`src/services/apiBase.js`. The production default in `.env.production` is:

`https://college-backend-lightweight-project.onrender.com`

In Vercel, add `VITE_API_URL` with that same value for Production, Preview, and
Development, then redeploy after changing it. Vite embeds `VITE_` variables at
build time, so a new deployment is required after changing the value.

Also add `VITE_CLERK_PUBLISHABLE_KEY` in Vercel using the publishable key from
your Clerk dashboard. Do not put Clerk secret keys or database credentials in
any `VITE_` variable or frontend file.

After the Vercel deployment creates its frontend domain, add that exact origin
to the Render backend's `FRONTEND_ORIGINS` environment variable (comma-separated
if there are multiple origins), then redeploy the backend.
