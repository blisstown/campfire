# space social

social media for the galaxy-wide-web! 🌌

this is a neat experiment in building as much of a fediverse-compatible
software stack as i can (at least before the crippling weight of the full
activitypub spec finally cripples me)

starting, of course, with a nice frontend! ✨

should you choose to play around with this yourself, just know that *many
things are bound not to work!* notably, this has only been tested on iceshrimp
and mastodon-compatible instances. anything beyond this will likely be
incompatible, and the web console will get very upset.

## features

### current

- a read-only, infinite-scrolling feed
- custom emotes and reactions (again, read-only)
- fun, clicky buttons! (they still do nothing)

### planned

- a login flow that doesn't suck (seriously, it's bad)
- posting! (incl. replies and quotes)
- reacting!

### "maybe"

- account switching
- post editing/deletion
- live updates over websocket (this may lead to notifications, too)

## try it out!

- `git clone` this repo
- `npm install` the dependencies
- `npm run dev` to spin up the dev environment
- have fun! ✨
