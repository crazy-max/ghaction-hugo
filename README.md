[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-hugo.svg?style=flat-square)](https://github.com/crazy-max/ghaction-hugo/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-hugo--github--action-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/hugo-github-action)
[![Release workflow](https://github.com/crazy-max/ghaction-hugo/workflows/release/badge.svg)](https://github.com/crazy-max/ghaction-hugo/actions?workflow=release)
[![Test workflow](https://github.com/crazy-max/ghaction-hugo/workflows/test/badge.svg)](https://github.com/crazy-max/ghaction-hugo/actions?workflow=test)
[![Support me on Patreon](https://img.shields.io/badge/donate-patreon-f96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/crazymax) 
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## ✨ About

GitHub Action for [Hugo](https://gohugo.io/), the world's fastest framework for building websites.

> **:warning: Note:** To use this action, you must have access to the [GitHub Actions](https://github.com/features/actions) feature. GitHub Actions are currently only available in public beta. You can [apply for the GitHub Actions beta here](https://github.com/features/actions/signup/).

## 🚀 Usage

Below is a simple snippet to use this action. A [live example](https://github.com/crazy-max/ghaction-hugo/actions) is also available for this repository as well as a ['production-ready' example](https://github.com/crazy-max/crazymax.dev).

```yaml
name: hugo

on:
  pull_request:
  push:

jobs:
  hugo:
    runs-on: ubuntu-latest
    steps:
      -
        # https://github.com/actions/checkout
        name: Checkout
        uses: actions/checkout@master
      -
        # https://github.com/crazy-max/ghaction-hugo
        name: Run Hugo
        uses: crazy-max/ghaction-hugo@v1
        with:
          version: latest
          extended: false
          args: --cleanDestinationDir --minify --verbose
      -
        # https://github.com/crazy-max/ghaction-github-pages
        name: Deploy
        if: success() && github.event_name != 'pull_request'
        uses: crazy-max/ghaction-github-pages@v1
        with:
          target_branch: gh-pages
          build_dir: public
        env:
          GITHUB_PAT: ${{ secrets.GITHUB_PAT }}
```

## 💅 Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name          | Type    | Default   | Description                      |
|---------------|---------|-----------|----------------------------------|
| `version`     | String  | `latest`  | Hugo version. Example: `v0.58.3` |
| `extended`    | Bool    | `false`   | Use Hugo extended                |
| `args`        | String  |           | Arguments to pass to Hugo        |

## 🤝 How can I help ?

All kinds of contributions are welcome :raised_hands:!<br />
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:<br />
But we're not gonna lie to each other, I'd rather you buy me a beer or two :beers:!

[![Support me on Patreon](.res/patreon.png)](https://www.patreon.com/crazymax) 
[![Paypal Donate](.res/paypal.png)](https://www.paypal.me/crazyws)

## 📝 License

MIT. See `LICENSE` for more details.
