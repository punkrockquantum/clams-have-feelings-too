# CIO SIMULATOR!

A hilarious, fast-paced 90s-cartoon game. You are the CIO of a bank where every
department has discovered AI at once. Request/incident cards arrive faster and
faster — pick 1 of 3 strategies (Infrastructure / Networking / Software) per card.

Good, long-game choices calm **Stress / Risk / Cost**, raise **Board Confidence**,
extend the timer and fill your **Chill** meter. Tempting quick wins feel great now,
then land as delayed **WHAM!** consequences 15–25 seconds later — often spawning
worse follow-up cards. Reach 100 Chill (or survive to the whistle with the bank
calm) and our hero evolves from wild hair & bloodshot eyes to Hawaiian shirt,
shorts and sunglasses. Let any chaos meter max out and it's game over.

Partner choices are woven in as real options: Digital Realty (PlatformDIGITAL®
colocation, high-density AI colocation, ServiceFabric® private interconnection),
Oracle (OCI, Autonomous Database, Fusion Applications, OCI AI services) and
validated OEM-partner hardware.

## Run it

```bash
npm install
npm run dev    # play
npm test       # engine + card-deck tests (vitest)
npm run build  # typecheck + production build
```

Controls: click/tap a card in the inbox, then click a strategy — or press
`1` / `2` / `3`. Or press `0` / `I` to **Ignore**: the requester loiters by
your desk looking relaxed, foot tapping, for ~3 seconds — then either gets
bored and wanders off (tiny relief, silly 🤪 requests wander ~85% of the time)
or comes back escalated, with stress/risk up (serious 🚨 requests only wander
~25% of the time, and bring extra requests with them). The intro briefing is
4 short panels (~2 minutes to read, auto-advancing); hit
**START THE MADNESS!** to begin instantly.

> Token Quest note: the user-provided site
> (tokenquest.tokenquest.workers.dev) is behind a team password login, so its
> internal examples could not be read without a credential (none was
> available; no guessing attempted). Digital Realty choices therefore use
> Digital Realty's public PlatformDIGITAL® / ServiceFabric® offerings —
> send the team password and the choices can be revised against the site's
> actual examples.
