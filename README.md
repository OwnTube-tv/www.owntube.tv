# Official website for [OwnTube.tv](https://www.owntube.tv/)

This repo is for maintaining the official organization website.

## Project description

Updates are shipped to the GitHub Pages deployment at https://www.owntube.tv/ on pushes to `main` branch.

If editing via git source control, just clone/fork the repo as usual, install the dependencies, test & commit changes,
and submit the changes via a pull request. Node.js 22.12 or newer is required.

```sh
git clone git@github.com:OwnTube-tv/www.owntube.tv.git
cd www.owntube.tv/
npm install
npm run dev
```

## What technologies are used for this project?

- Astro 7 (static site generator)
- TypeScript
- Tailwind CSS 4 (the generated CSS targets Safari 16.4+, Chrome 111+ and Firefox 128+)
- Lit — the interactive UI is built as custom elements that enhance the static HTML, see
  [src/elements/README.md](src/elements/README.md)

## Component development

```sh
npm test          # component tests in a real Chromium (Web Test Runner, @open-wc/testing, axe)
npm run test:watch
npm run analyze   # regenerate custom-elements.json from the elements' JSDoc
```

The first test run needs a browser: `npx playwright install chromium`.

## Contributing

Do You have some good ideas on how to make our website better? Maybe some translations are wrong? Some information
incorrect? Or styling that doesn't fly? Open a ticket and share your ideas, assignable to `@okaziya` or `@mblomdahl`. ✨
