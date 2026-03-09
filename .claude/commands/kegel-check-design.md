Review all `.jsx` and `.scss` files and check for design violations:

- Any border-radius values? → Remove them
- Any colors not in IBM Carbon Dark palette? → Fix them
- Any font other than IBM Plex Sans / Mono? → Fix it
- Any external UI library imports? → Remove them
- Any hardcoded colors (not using CSS variables or Carbon tokens)? → Refactor to variables

Report violations with file name and line number.
