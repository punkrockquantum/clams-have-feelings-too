# CIO SIMULATOR!

A hilarious, fast-paced 90s-cartoon game. You are the CIO of a company where every
department has discovered AI at once. Request/incident cards arrive faster and
faster — pick 1 of 3 strategies (Infrastructure / Networking / Software) per card.

Good, long-game choices calm **Stress / Risk / Cost**, raise **Board Confidence**,
extend the timer and fill your **Chill** meter. Tempting quick wins feel great now,
then land as delayed **WHAM!** consequences 15–25 seconds later — often spawning
worse follow-up cards. Reach 100 Chill (or survive to the whistle with the company
calm) and our hero evolves from wild hair & bloodshot eyes to Hawaiian shirt,
shorts and sunglasses. Let any chaos meter max out and it's game over.

The end screen breaks down exactly where your score came from — points from
choices vs. points from successful Ignores, good calls, traps taken, delayed
consequences landed, and ignores that came back worse.

Partner choices are woven in as real options: colocation partners (private
data halls, high-density AI colocation, private interconnection), cloud &
enterprise software partners (cloud infrastructure, managed databases,
enterprise apps and AI services) and validated OEM-partner hardware.

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

> Token Quest credit: the interconnection/colocation choice specifics were
> mined from **Token Quest**
> — [punkrockquantum/JRRToken](https://github.com/punkrockquantum/JRRToken/tree/cursor/token-quest-datacenter-game)
> (branch `cursor/token-quest-datacenter-game`, esp. `js/data.js` and
> `js/network.js`). Borrowed, in generic form: private-fabric port/Link/
> Connection specifics (10G/100G ports, L2 Links & L3 Connections from
> 50 Mbps to 100 Gbps, cloud on-ramps, service-directory partners, other
> metros, managed internet, ~15-day new-port cross-connect SLA vs
> minutes-fast virtual connections), cross connects, an early-access
> agent-configuration option (the "fabric-mcp" card), London direct-to-chip
> liquid cooling at 150 kW/rack+ for liquid-only rack-scale GPUs, metro
> power-ladder placement (the "metro-choice" card), and fibre physics
> (~5 µs/km). The password-gated tokenquest.tokenquest.workers.dev site
> was not used — the repo is the source.

Demo/QA screenshots: append `?demo=frazzled` or `?demo=beach` to the URL for a frozen game at that extreme (used for the playtest screenshots).
