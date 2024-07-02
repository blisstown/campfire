# Campfire

social media for the galaxy-wide-web! 🌌

this is a *very experimental* frontend for browsing the fediverse, built
from the ground up in svelte!

should you choose to play around with this yourself, just know that *many
things are bound not to work!* notably, campfire is currently only being
battle-tested on mastodon API-compliant instances. anything beyond this
will likely be incompatible, and the web console will get very upset.

## features

### current

- infinite-scrolling feed
- log in with most/all fedi services! (with varying compatibility)
- ability to favourite, boost, and react to posts
- view threads in context
- notifications feed
- fun, clicky buttons!

### planned

- posting! (incl. replies and quotes)
- live feed

### "maybe"

- fast account switching
- post editing/deletion
- push notifications
- ...and potentially much more as development continues!

## try it out!

- `git clone` this repo
- `npm install` the dependencies
- `npm run dev` to spin up the dev environment

if you wish to run this in production, you need only `npm run build` and
place the static files somewhere accessible by a static webhost, such as
nginx or apache! **note:** your web server should attempt to reach
`/fallback.html` before erroring out.

have fun! ✨
