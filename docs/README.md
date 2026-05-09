# Multimediary Docs

Developer documentation for the Multimediary API, built with [Docusaurus](https://docusaurus.io) and [docusaurus-plugin-openapi-docs](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs).

## Running locally

```bash
cd docs
npm install
npm start        # dev server at http://localhost:3000/docs/
```

## Building

```bash
npm run build    # output in docs/build/
npm run serve    # serve the production build locally
```

## Updating API reference

The API reference is generated from `docs/api/openapi.yaml`. After editing the spec:

```bash
npm run clean-api-docs   # remove old generated files
npm run gen-api-docs     # regenerate from openapi.yaml
npm run build            # verify the build passes
```

## Structure

```
docs/
├── api/
│   └── openapi.yaml          # OpenAPI 3.0 spec (source of truth)
├── docs/
│   ├── guide/                # 10 hand-written guide pages
│   └── api-reference/        # generated — do not edit manually
├── src/pages/index.tsx       # homepage
├── sidebars.ts               # sidebar config
└── docusaurus.config.ts      # site config
```
