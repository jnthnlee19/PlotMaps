# Adelton Exterior Control Map

This version uses Netlify Blobs for one shared set of homesite data.

## Files to put in the ROOT of the GitHub repo

- `index.html`
- `package.json`
- `netlify.toml`
- `netlify/functions/adelton-state.mjs`

Netlify will install `@netlify/blobs` during the deploy and automatically gives
the Function access to the site's Blob store.

No database, API key, connection string, or separate service is required.
