# Editing This Website

This site is a simple static GitHub Pages site. Most content is edited in one file:

`assets/js/site-data.js`

## Common Updates

- Profile links: edit the `links` list.
- Education: edit the `education` list.
- Work experience: edit the `work` list.
- Leadership and service roles: edit the `service` list.
- Skills: edit the `skills` list.
- Credentials and awards: edit the `awards` list.
- Credential buttons: edit `credentialLinks`.
- Projects and publications: edit the `projects` list.

## Credential Buttons

Each credential button is controlled by `credentialLinks` in `assets/js/site-data.js`.

Example:

```js
"Eagle Scout": {
  label: "Info",
  url: "https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/eagle-scout/"
}
```

- `label` is the button text shown on the site.
- `url` is the public page visitors open.
- If a credential is listed in `awards` but does not have a matching `credentialLinks` entry, it will still show as plain text.

## Page Text

The main hero text and section headings are in `index.html`.

Use `assets/css/styles.css` only for visual changes such as spacing, colors, buttons, and card layout.

## Quick Check Before Publishing

Open the site locally or on GitHub Pages and check:

- The page loads.
- Navigation links scroll to the right sections.
- Credential buttons open the correct public pages.
- Details buttons expand and collapse.
- No private contact information is added by mistake.
