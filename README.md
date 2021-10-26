# Portfolio UI

This is primarily a pet project to play around with the idea of a web-based UI for Portfolio Performance, following the ideas in https://github.com/buchen/portfolio/issues/1921.

It fetches data from Portfolio Performance using a REST API, which is currently in progress in this fork: https://github.com/oxisto/portfolio/tree/rest-api.

Here is a screenshot showing an early stage with data coming from Portfolio Performance using the REST API. The data itself is fake though.

<img width="1674" alt="Screenshot 2021-10-26 at 11 50 13" src="https://user-images.githubusercontent.com/12459061/138854552-c9c2146f-9355-4dd6-9666-6dcff99d2976.png">


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
