# Wedding Invitation

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer

## Run locally

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm run dev
```

Open http://localhost:5173/?i=5

## Production build

```bash
pnpm run build
PORT=4173 BASE_PATH=/ pnpm run serve
```

Then open http://localhost:4173/?i=5
