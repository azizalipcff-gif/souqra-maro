<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Use the installed Next.js version in this project as the source of truth. Before generating or editing Next.js code, compare the requested feature or fix against the local docs in `node_modules/next/dist/docs/` for this exact Next.js version. Identify the docs file that matches the API, convention, or file structure you will use.

If `node_modules/next/dist/docs/` is missing or unreadable, do not guess APIs or file structure. Stop and tell the user that the local Next.js docs are unavailable and ask them to install dependencies first. If the local docs say an API or convention is deprecated, do not use it in generated code; prefer the documented replacement and explain the deprecation to the user. If the user explicitly asks for a deprecated API, explain the deprecation and offer the documented replacement instead of using the deprecated path.
<!-- END:nextjs-agent-rules -->
