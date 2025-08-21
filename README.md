# Teaching Helper Rubric (v2)

This repository contains a single‑page web application for creating and using
grading rubrics. It was designed for a Cebu‑based English teacher and includes
two built‑in templates—an ESL rubric and a general rubric—along with options
for switching between student and teacher views and toggling basic UI labels
between English and Bisayâ (Cebuano).

The header of the page displays a decorative flourish alongside a signature
image. To personalise the app for yourself or another teacher, simply
replace the file at `assets/signature.png` with a transparent PNG of the
desired signature.

## Quick Start

Open `index.html` in any modern web browser. The application loads
Tailwind CSS and Chart.js via CDN, so an internet connection is required
for styling and chart rendering. No server is needed.

## Features

* **Multiple rubric templates:** ESL and General. Each rubric defines
  criteria, level descriptors, weights, and point ranges. You can add
  additional templates by editing `src/app.js` and following the existing
  structure.
* **Student/Teacher modes:** In teacher mode, rubric cells are clickable
  and assign points; in student mode, the table is read‑only.
* **Language toggle:** Basic interface labels (e.g. “Student View,”
  “Teacher View,” “Grading Summary”) can be switched between English and
  Bisayâ. The rubric descriptors remain in English to avoid mistranslation.
* **Real‑time chart:** A horizontal bar chart visualises the points awarded
  for each criterion relative to its weight.
* **Responsive design:** The layout is fluid and works on desktop and
  mobile devices.

## Development

The application is pure client‑side JavaScript. Modify `src/app.js` to
adjust rubric definitions, add translations, or extend functionality.

## License

This project is released under the MIT License. See `LICENSE` for
details.