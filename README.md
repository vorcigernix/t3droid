# Shorty - Link Shortener & Analytics

A fast, responsive React link shortening application with live click counting, background metadata unfurling, QR code sharing, bulk import, and an Axiom-inspired telemetry dashboard.

## Features

- **Link Shortening**: Generate clean, collision-free short URLs with custom or auto-generated 6-character URL-safe slugs.
- **Live Click Tracking**: Real-time tabular click counts with immediate visual feedback, simulated live WebSocket updates, and direct visit tracking.
- **Metadata Unfurling**: Automatic page title, favicon, and description extraction with background queue status.
- **Bulk Import**: Paste multiple URLs at once to create batch short links.
- **QR Code Generation**: Download and share QR codes for any shortened link.
- **Telemetry & Observability**: Real-time dashboard showing request distribution by route, p95 latency, clicks ranking, and transactional event streams.
- **Search & Filtering**: Search through your links by short slug, destination URL, or extracted page title.

## Getting Started

```bash
npm install
npm run dev
```

The application runs on Vite with React 19 and Tailwind CSS.
