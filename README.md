# PHC Connect

PHC Connect is a browser-based prototype for managing patient queues at a Primary Health Centre (PHC). It simulates:

- patient appointment booking
- token generation
- queue tracking for doctors
- admin dashboard management
- live waiting-area display

This project is intended as a public-facing demo and is not a production healthcare system. It does not include real patient records, regulated medical workflows, secure authentication, or a backend database.

## Features

- Patient booking form with doctor selection and time slots
- Token generation and live status tracking
- Admin dashboard for queue updates
- TV-style waiting display for the public area
- Browser-local persistence using localStorage

## Run locally

Because this is a static front-end prototype, you can preview it by serving the repository locally:

```bash
cd /path/to/PCH-draft
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/front.html
```

## Important notes for public use

- This repository is a static demo only.
- It stores demo data in the browser using `localStorage`.
- There is no real authentication, no API backend, and no secure patient data handling.
- Replace the sample data before using it in any real or externally visible environment.

## Repo structure

```text
.
├── front.html
├── again.js
├── style.css
├── README.md
```
