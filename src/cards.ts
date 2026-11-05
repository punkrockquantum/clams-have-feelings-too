import type { Effects } from "./engine";
export type Lane = "INFRA" | "NETWORK" | "SOFTWARE";
export interface Choice {
  lane: Lane; label: string; detail: string; partner?: string;
  fx: Partial<Effects>;
  /** Tempting quick win: feels great now, bites later. */
  delayed?: { afterSec: number; text: string; sfx: string; fx: Partial<Effects>; followUpId?: string };
}
export interface GameCard {
  id: string; person: string; dept: string; emoji: string; title: string; body: string; followUp?: boolean;
  /** 1 = silly/low-stakes (fairly safe to Ignore), 2 = medium, 3 = serious (Ignore at your peril). Defaults to 2. */
  severity?: 1 | 2 | 3;
  /** Card spawned if this one is Ignored and escalates. Defaults to an escalated clone. */
  escalatesTo?: string;
  choices: [Choice, Choice, Choice];
}
export const severityOf = (card: GameCard): 1 | 2 | 3 => card.severity ?? 2;
const c = (lane: Lane, label: string, detail: string, fx: Partial<Effects>, extra: Partial<Choice> = {}): Choice => ({ lane, label, detail, fx, ...extra });

export const CARDS: GameCard[] = [
  {
    id: "john-chatgpt", severity: 3, escalatesTo: "legal-fallout", person: "John", dept: "Marketing", emoji: "🤠", title: "“I uploaded ALL customer data to ChatGPT!”",
    body: "John needed a PowerPoint. John used the entire customer database as… inspiration. The deck does look great, to be fair.",
    choices: [
      c("SOFTWARE", "Quarantine & train, don't ban", "Approved AI workspace, DLP rules, John presents on data hygiene (in Comic Sans, as penance).", { stress: -6, risk: -12, cost: 3, confidence: 6, chill: 4, time: 6, score: 120 }),
      c("NETWORK", "YOLO — let the deck ship!", "Instant relief! Nobody asks questions. Yet.", { stress: -12, risk: 3, cost: -4, confidence: 2, chill: -4, time: 2, score: 30 }, { delayed: { afterSec: 18, text: "WHAM! A customer recognises their own account number on slide 14. Legal would like a word…", sfx: "WHAM!", fx: { stress: 16, risk: 20, cost: 8, confidence: -12, chill: -10 }, followUpId: "legal-fallout" } }),
      c("INFRA", "Move AI workloads somewhere private", "Partner colocation in a private data hall — customer data stays in your cage under your keys, and the AI runs next to it instead of data flying out to a public chatbot.", { stress: -4, risk: -10, cost: 4, confidence: 8, chill: 4, time: 5, score: 110 }, { partner: "Colocation partner · private data halls" }),
    ],
  },
  {
    id: "charles-payroll", severity: 3, escalatesTo: "payroll-chaos", person: "Charles", dept: "Finance", emoji: "🧐", title: "“Automate payroll with this SAP plugin I found!”",
    body: "The plugin has 5 stars, 3 reviews, and a logo that is almost — but not quite — SAP's.",
    choices: [
      c("SOFTWARE", "Pilot proper enterprise apps", "A proper enterprise apps suite (ERP/HR) in the cloud — payroll with actual governance and human approval.", { stress: -5, risk: -11, cost: 3, confidence: 9, chill: 4, time: 6, score: 120 }, { partner: "Enterprise apps partner · cloud suite" }),
      c("INFRA", "Install the mystery plugin NOW", "Payroll in one click! What could possibly— oh no.", { stress: -13, risk: 2, cost: -6, chill: -3, score: 30 }, { delayed: { afterSec: 20, text: "KAPOW! The plugin paid everyone twice — including the office plant, listed as a contractor since 2019.", sfx: "KAPOW!", fx: { stress: 18, risk: 14, cost: 16, confidence: -12, chill: -10 }, followUpId: "payroll-chaos" } }),
      c("NETWORK", "Ring-fence payroll traffic first", "Private segment + vendor review before anything touches SAP.", { stress: -3, risk: -8, cost: 3, confidence: 5, chill: 3, time: 4, score: 90 }),
    ],
  },
  {
    id: "fred-mythos", severity: 2, person: "Fred", dept: "Security", emoji: "🦸", title: "“Improve security using… Mythos!”",
    body: "Fred read a forum. Fred is now invincible. Fred has forwarded you 47 links and a cape.",
    choices: [
      c("SOFTWARE", "Real threat model, boring heroes", "Patch cadence, MFA everywhere, tested backups. Capes optional.", { stress: -5, risk: -13, cost: 4, confidence: 7, chill: 4, time: 5, score: 120 }),
      c("NETWORK", "Private connectivity, less public exposure", "Our private interconnection fabric: one multi-service port, private virtual connections to clouds & partners picked from the Service Directory — instead of shouting over the public internet.", { stress: -4, risk: -11, cost: 3, confidence: 7, chill: 4, time: 5, score: 110 }, { partner: "Interconnection partner · private fabric" }),
      c("INFRA", "Give Fred the Mythos budget", "He feels GREAT. The auditors will not.", { stress: -10, risk: 5, cost: 10, chill: -4, score: 25 }, { delayed: { afterSec: 22, text: "BOOM! 'Mythos' turned out to be a screensaver. A very secure-feeling screensaver.", sfx: "BOOM!", fx: { stress: 14, risk: 18, cost: 10, confidence: -10, chill: -8 } } }),
    ],
  },
  {
    id: "sam-hnw", severity: 1, person: "Sam", dept: "Product", emoji: "💎", title: "“New product for high-net-worth clients!”",
    body: "Sam wants an AI concierge for very rich customers. It must be exclusive, instant, and 'basically telepathic'.",
    choices: [
      c("SOFTWARE", "Build it on governed AI services", "Cloud AI services + a managed database — rich data, richer controls, consent baked in.", { stress: -4, risk: -9, cost: 4, confidence: 10, chill: 4, time: 6, score: 130 }, { partner: "Cloud partner · AI + managed database" }),
      c("INFRA", "Launch on the CEO's laptop", "It's under his desk. It's warm. It's 'the cloud' now.", { stress: -11, risk: 4, cost: -5, chill: -3, score: 30 }, { delayed: { afterSec: 16, text: "SPLAT! The CEO closed the laptop lid. The entire VIP product is asleep.", sfx: "SPLAT!", fx: { stress: 16, risk: 10, cost: 6, confidence: -12, chill: -8 } } }),
      c("NETWORK", "Private, low-latency client links", "Put the concierge in a data-centre metro near the clients and reach clouds/partners over a private fabric — Token Quest's lesson: first-token speed lives or dies on the path, and the public internet is the jittery one.", { stress: -3, risk: -7, cost: 3, confidence: 8, chill: 3, time: 4, score: 100 }, { partner: "Colocation partner · metro + private fabric" }),
    ],
  },
  {
    id: "alan-bitcoin", severity: 2, person: "Alan", dept: "Treasury", emoji: "🚀", title: "“Copilot found me Bitcoin strategies!”",
    body: "Alan's Copilot has a 14-tab spreadsheet, three rocket emojis, and absolutely no risk warnings.",
    choices: [
      c("SOFTWARE", "Sanctioned analytics sandbox", "Approved models, treasury policy limits, no company funds near meme coins.", { stress: -6, risk: -12, cost: 3, confidence: 7, chill: 4, time: 5, score: 120 }),
      c("INFRA", "Let Alan 'test with a little real money'", "A LITTLE. He says. His mouse is hovering over LEVERAGE.", { stress: -12, risk: 5, cost: 4, chill: -4, score: 30 }, { delayed: { afterSec: 15, text: "WHAMMO! The 'strategy' was a horoscope with candlesticks. Treasury is crying in three currencies.", sfx: "WHAMMO!", fx: { stress: 17, risk: 19, cost: 15, confidence: -13, chill: -10 } } }),
      c("NETWORK", "Block crypto sites, log the lot", "Firm, fair, and Alan can mine compliments instead.", { stress: 2, risk: -9, cost: 1, confidence: 4, chill: 2, time: 3, score: 80 }),
    ],
  },
  {
    id: "copilot-bill", severity: 2, person: "Priya", dept: "Finance Ops", emoji: "🧾", title: "“The Copilot bill just did WHAT?!”",
    body: "Every employee, every Copilot, all day, mostly asking it to write poems about expense reports. Costs are doing parkour.",
    choices: [
      c("SOFTWARE", "Right-size licences + usage dashboards", "Keep AI for power users, coach the poets, cap the chaos.", { stress: -6, risk: -4, cost: -14, confidence: 8, chill: 5, time: 6, score: 130 }),
      c("INFRA", "Consolidate AI onto shared infra", "OEM-partner validated servers in colocation for the heavy, predictable AI lifting.", { stress: -4, risk: -5, cost: -9, confidence: 6, chill: 4, time: 5, score: 110 }, { partner: "OEM partner · validated AI servers" }),
      c("NETWORK", "Ban Copilot on Fridays only", "Staff feel thrifty for exactly one day a week.", { stress: -9, cost: -8, chill: -3, score: 35 }, { delayed: { afterSec: 19, text: "THUD! Everyone now does a week's Copilot-ing on Monday. The bill has a bill.", sfx: "THUD!", fx: { stress: 12, risk: 1, cost: 15, confidence: -8, chill: -8 } } }),
    ],
  },
  {
    id: "branch-wifi", severity: 2, person: "Marta", dept: "Branches", emoji: "📶", title: "“Branch Wi-Fi died during the lunch rush!”",
    body: "Forty branches, one router each, zero mercy. Customers are paying by interpretive dance.",
    choices: [
      c("NETWORK", "Dual links + private-fabric backbone", "Token Quest-style: a 10G/100G private-fabric port per region, redundant port groups, Layer 2 Links or Layer 3 Connections (50 Mbps–100 Gbps) to branches, clouds and partners. New ports need a cross-connect (plan ~15 days); the virtual links themselves go live in minutes. Lunch rush-proof.", { stress: -9, risk: -8, cost: 4, confidence: 8, chill: 4, time: 6, score: 120 }, { partner: "Interconnection partner · private fabric" }),
      c("INFRA", "OEM swap: proper kit, spares on shelf", "Validated OEM-partner routers, configured before they ship.", { stress: -7, risk: -6, cost: 3, confidence: 6, chill: 3, time: 5, score: 100 }, { partner: "OEM partner · branch kit" }),
      c("SOFTWARE", "Tell branches to 'try turning it off and on'", "It works! In one branch. The other 39 are now off.", { stress: -10, chill: -4, score: 25 }, { delayed: { afterSec: 14, text: "ZONK! Branch bingo: nobody knows which router belongs to whom anymore.", sfx: "ZONK!", fx: { stress: 15, risk: 3, cost: 5, confidence: -10, chill: -8 } } }),
    ],
  },
  {
    id: "data-mess", severity: 2, person: "Olu", dept: "Data Team", emoji: "🗄️", title: "“Our data is in 900 spreadsheets!”",
    body: "One of them is called FINAL_v27_REAL(2).xlsx. It is load-bearing.",
    choices: [
      c("SOFTWARE", "Managed database, one source of truth", "A managed, self-tuning database — self-tuning, governed, spreadsheet retirement home included.", { stress: -6, risk: -9, cost: 3, confidence: 9, chill: 5, time: 6, score: 130 }, { partner: "Cloud partner · managed database" }),
      c("INFRA", "Put the spreadsheets on a bigger server", "Now the mess loads FASTER.", { stress: -8, risk: 2, cost: 7, chill: -3, score: 35 }, { delayed: { afterSec: 21, text: "POW! FINAL_v28 appeared. It disagrees with v27 about how much money the company has.", sfx: "POW!", fx: { stress: 14, risk: 15, cost: 8, confidence: -11, chill: -8 } } }),
      c("NETWORK", "Private data pipelines only", "No more customer CSVs flying over email at midnight.", { stress: -4, risk: -10, cost: 3, confidence: 6, chill: 3, time: 4, score: 100 }),
    ],
  },
  {
    id: "ai-agents", severity: 1, person: "Greta", dept: "HR", emoji: "🤖", title: "“Can an AI agent do our onboarding?”",
    body: "Greta wants new joiners welcomed, equipped and trained by an agent. She has named it already. It's called Greg.",
    choices: [
      c("SOFTWARE", "Greg, but with guardrails", "Enterprise HR workflows + cloud AI agents with human approval for the sensitive bits.", { stress: -5, risk: -9, cost: 3, confidence: 9, chill: 4, time: 6, score: 130 }, { partner: "Enterprise apps partner · HR suite + AI" }),
      c("INFRA", "Give Greg admin rights to everything", "Greg is efficient. Greg is everywhere. Greg is… reorganising.", { stress: -12, risk: 6, chill: -4, score: 25 }, { delayed: { afterSec: 17, text: "BONK! Greg offboarded the CEO for 'inactivity' and ordered 400 welcome mugs for Greg.", sfx: "BONK!", fx: { stress: 16, risk: 15, cost: 11, confidence: -12, chill: -9 } } }),
      c("NETWORK", "Greg lives in the private zone", "Internal-only access, logged to within an inch of its life.", { stress: -4, risk: -10, cost: 3, confidence: 6, chill: 3, time: 4, score: 100 }),
    ],
  },
  {
    id: "ceo-demo", severity: 2, person: "The CEO", dept: "Executive", emoji: "👔", title: "“Demo AI to the board. Tomorrow. Live.”",
    body: "The CEO wants live AI, on the big screen, with the company's real data. Tomorrow. He said 'what's the worst that could happen' out loud.",
    choices: [
      c("INFRA", "Stage it in colocation, rehearse tonight", "Private data-hall cage, frozen demo data, two rehearsals and a big red BACKUP VIDEO button.", { stress: -7, risk: -11, cost: 3, confidence: 11, chill: 5, time: 6, score: 140 }, { partner: "Colocation partner · data-centre platform" }),
      c("SOFTWARE", "Script it on cloud AI with guardrails", "Cloud generative AI with curated data — impressive, but it can't improvise about dividends.", { stress: -6, risk: -9, cost: 3, confidence: 10, chill: 4, time: 5, score: 130 }, { partner: "Cloud partner · generative AI" }),
      c("NETWORK", "Wing it on hotel Wi-Fi", "Live. Real data. Hotel Wi-Fi. The confidence is honestly inspiring.", { stress: -13, chill: -5, score: 20 }, { delayed: { afterSec: 13, text: "KRAKOOM! The demo AI just offered the board a mortgage at 400% APR. With confetti.", sfx: "KRAKOOM!", fx: { stress: 18, risk: 13, cost: 6, confidence: -15, chill: -10 } } }),
    ],
  },
  {
    id: "ransom-note", severity: 3, person: "Night Shift", dept: "SOC", emoji: "🌙", title: "“Something's encrypting the file server…”",
    body: "It's 2 a.m. The file server is renaming things to .oops and the backup tape drive is making a smell.",
    choices: [
      c("INFRA", "Isolate, restore from colo backups", "Segment at the cage, restore clean copies, coffee for the SOC.", { stress: -8, risk: -14, cost: 4, confidence: 8, chill: 5, time: 6, score: 140 }, { partner: "Colocation partner · backup & recovery" }),
      c("NETWORK", "Yank cables, segment everything", "Chaotic but effective — like pulling the plug on a haunted house.", { stress: -5, risk: -12, cost: 3, confidence: 6, chill: 3, time: 4, score: 110 }),
      c("SOFTWARE", "Pay with the petty cash tin", "The tin has £3.40 and a button. Also: never do this.", { stress: -11, risk: 7, cost: 9, chill: -5, score: 15 }, { delayed: { afterSec: 18, text: "WHAM! They came back asking for a bigger tin.", sfx: "WHAM!", fx: { stress: 17, risk: 20, cost: 14, confidence: -12, chill: -10 } } }),
    ],
  },
  {
    id: "app-slow", severity: 2, person: "Dev", dept: "Engineering", emoji: "🐌", title: "“The company app takes 19 seconds to log in!”",
    body: "Users think the spinner is a loading game. Someone reached level 40.",
    choices: [
      c("INFRA", "Move hot workloads to the cloud", "Cloud compute + a managed database near the users. Spinner retires.", { stress: -7, risk: -5, cost: 4, confidence: 9, chill: 4, time: 6, score: 120 }, { partner: "Cloud partner · cloud infrastructure" }),
      c("NETWORK", "Private interconnect to the cloud", "Private cloud on-ramps to all the big clouds cut the scenic route out of every login — in Token Quest, private fabric beats peering and thrashes the public internet on jitter.", { stress: -6, risk: -6, cost: 3, confidence: 8, chill: 4, time: 5, score: 115 }, { partner: "Interconnection partner · cloud on-ramps" }),
      c("SOFTWARE", "Add a funnier spinner", "Engagement UP! Patience DOWN!", { stress: -9, chill: -3, score: 30 }, { delayed: { afterSec: 16, text: "SPLAT! App-store reviews: 'Great spinner, terrible company.' 1 star.", sfx: "SPLAT!", fx: { stress: 12, risk: 1, cost: 4, confidence: -13, chill: -8 } } }),
    ],
  },
  {
    id: "shadow-ai", severity: 2, person: "Ingrid", dept: "Audit", emoji: "🕵️", title: "“We found 63 secret AI tools in use.”",
    body: "Sixty-three. Including one that writes apology emails and one that only makes haikus about liquidity.",
    choices: [
      c("SOFTWARE", "Amnesty + approved AI catalogue", "Keep the useful, kill the risky, licence the haiku one for morale.", { stress: -5, risk: -13, cost: 2, confidence: 8, chill: 5, time: 6, score: 130 }),
      c("NETWORK", "Egress controls & discovery scans", "Find the data leaks before Ingrid finds you.", { stress: -4, risk: -11, cost: 3, confidence: 7, chill: 3, time: 5, score: 110 }),
      c("INFRA", "Pretend the list is 62", "Ingrid counts for a living, hero.", { stress: -10, risk: 4, chill: -4, score: 20 }, { delayed: { afterSec: 15, text: "THWACK! Audit found tool #64. It's this decision.", sfx: "THWACK!", fx: { stress: 14, risk: 16, cost: 5, confidence: -12, chill: -8 } } }),
    ],
  },
  {
    id: "gpu-queue", severity: 1, person: "Ken", dept: "Risk Modelling", emoji: "🎰", title: "“We need GPUs. All of them. By Friday.”",
    body: "Ken's risk models take 9 hours. Ken has tried asking them nicely to hurry up.",
    choices: [
      c("INFRA", "Liquid-cooled hall for the monster racks", "Token Quest's rule: rack-scale NVL72-class kit is liquid-only. A specialist London innovation lab runs direct-to-chip liquid cooling at 150 kW per rack or more — put Ken's monsters in a hall built for them, not an air hall with a fan and a prayer.", { stress: -6, risk: -6, cost: 5, confidence: 9, chill: 4, time: 6, score: 125 }, { partner: "Colocation partner · liquid-cooled halls (150 kW/rack class)" }),
      c("SOFTWARE", "Burst to cloud GPU capacity", "Cloud AI infrastructure for the spikes, steady kit at home. Rent the spike, own the base.", { stress: -5, risk: -5, cost: 6, confidence: 8, chill: 4, time: 5, score: 120 }, { partner: "Cloud partner · AI infrastructure" }),
      c("NETWORK", "Run models on everyone's laptops overnight", "A 4,000-laptop supercomputer made of pure hope.", { stress: -11, cost: -6, chill: -4, score: 25 }, { delayed: { afterSec: 17, text: "FZZT! Facilities report the office is now warm enough to bake bread.", sfx: "FZZT!", fx: { stress: 15, risk: 6, cost: 10, confidence: -9, chill: -8 } } }),
    ],
  },
  {
    id: "vendor-lockin", severity: 2, person: "Legal", dept: "Procurement", emoji: "⛓️", title: "“This contract auto-renews for 99 years?!”",
    body: "Page 214. Tiny font. The vendor's pen is already out and it is, legally, a sword.",
    choices: [
      c("NETWORK", "Open interconnection, no lock-in", "A private fabric reaches every big cloud's on-ramps, partners from a service directory, other metros and managed internet from one port — negotiate like you have exits, because you do.", { stress: -5, risk: -10, cost: -6, confidence: 8, chill: 4, time: 6, score: 125 }, { partner: "Interconnection partner · private fabric" }),
      c("SOFTWARE", "Multicloud database options", "Managed database services across clouds — negotiate like you have exits. Because you do.", { stress: -4, risk: -8, cost: -4, confidence: 7, chill: 4, time: 5, score: 110 }, { partner: "Cloud partner · database options" }),
      c("INFRA", "Sign it, future-us can deal", "Future-us has entered the chat and is furious.", { stress: -12, cost: -9, chill: -4, score: 25 }, { delayed: { afterSec: 23, text: "CLANG! Year-1 price rise: +30%. The contract calls this 'a fun surprise'.", sfx: "CLANG!", fx: { stress: 13, risk: 5, cost: 17, confidence: -10, chill: -8 } } }),
    ],
  },
  {
    id: "phish", severity: 3, person: "Everyone", dept: "All Staff", emoji: "🎣", title: "“Half the company clicked a fake 'Free Pizza' email!”",
    body: "The pizza was a lie. The credential harvest was extremely real. Extra toppings: malware.",
    choices: [
      c("SOFTWARE", "Training + phishing-resistant MFA", "No blame, better armour, and actual pizza on Friday.", { stress: -6, risk: -13, cost: 3, confidence: 7, chill: 5, time: 6, score: 130 }),
      c("NETWORK", "Mail filtering & segmented access", "Even clicked links land in a padded room.", { stress: -5, risk: -11, cost: 4, confidence: 6, chill: 3, time: 5, score: 110 }),
      c("INFRA", "Reply-all: 'STOP CLICKING THINGS'", "Cathartic! Educational? No.", { stress: -9, chill: -3, score: 25 }, { delayed: { afterSec: 14, text: "DING! Someone clicked the reply-all. It had a link in it.", sfx: "DING!", fx: { stress: 13, risk: 11, cost: 4, confidence: -9, chill: -7 } } }),
    ],
  },
  {
    id: "board-ai", severity: 2, person: "Board", dept: "Governance", emoji: "🏛️", title: "“Show us the AI strategy. In one slide.”",
    body: "One slide. They fear neither God nor bullet points. Currently the strategy is 'Copilot and vibes'.",
    choices: [
      c("SOFTWARE", "One slide: cloud AI stack, governed", "Cloud + enterprise apps + managed database: AI embedded in workflows, approvals human.", { stress: -5, risk: -9, cost: 2, confidence: 12, chill: 5, time: 7, score: 140 }, { partner: "Cloud partner · cloud + enterprise apps" }),
      c("INFRA", "One slide: data-centre foundation", "Colocation + private-fabric interconnection (a secure 'data meeting place' for clouds, partners and AI workloads): private, connected foundations. The board nods. Slowly. Then all at once.", { stress: -5, risk: -9, cost: 2, confidence: 11, chill: 4, time: 7, score: 135 }, { partner: "Colocation partner · platform + private fabric" }),
      c("NETWORK", "One slide. It just says 'AI' very large", "Artistic. The board blinks first. Probably.", { stress: -11, chill: -4, score: 30 }, { delayed: { afterSec: 20, text: "GONG! The board asked a follow-up question. There was no slide 2.", sfx: "GONG!", fx: { stress: 15, risk: 3, cost: 3, confidence: -14, chill: -9 } } }),
    ],
  },
  {
    id: "fabric-mcp", person: "Nadia", dept: "Networks", emoji: "🧶", title: "“An AI agent wants to rewire our network itself!”", severity: 2,
    body: "Nadia's agent can configure interconnection through an agent-configuration server. It has already drawn a diagram. The diagram has arrows. So many arrows. (Card inspired by a Token Quest option.)",
    choices: [
      c("NETWORK", "Agent-configured fabric — agent proposes, human approves", "Token Quest's model: the agent states intent via an early-access agent-configuration server, you approve or edit the exact priced config, then 10G/100G ports and minutes-fast virtual connections do the rest. Same wire, faster admin, human hand on the wheel.", { stress: -6, risk: -10, cost: 2, confidence: 9, chill: 4, time: 6, score: 135 }, { partner: "Interconnection partner · agent-configured fabric (early access)" }),
      c("INFRA", "Same building? Just Cross Connect it", "A physical cable between two endpoints in one facility: nothing to configure, 100G-class, and it physically cannot leave the building. Boring. Beautiful.", { stress: -5, risk: -9, cost: 2, confidence: 7, chill: 4, time: 5, score: 115 }, { partner: "Colocation partner · cross connects" }),
      c("SOFTWARE", "Give the agent write access & a coffee", "It feels empowered. It has ordered bandwidth to the Moon (low latency to the Moon pending).", { stress: -11, risk: 5, cost: 6, chill: -4, score: 25 }, { delayed: { afterSec: 16, text: "BZZT! The agent right-sized everyone's bandwidth — to 50 Mbps. Including the CEO's video call. Froze mid-blink.", sfx: "BZZT!", fx: { stress: 15, risk: 12, cost: 9, confidence: -11, chill: -8 } } }),
    ],
  },
  {
    id: "metro-choice", person: "Priya", dept: "Finance Ops", emoji: "🗺️", title: "“Why is the AI hall quote different in every city?!”", severity: 1,
    body: "London power is tight and pricey, other metros have bigger power blocks going cheaper. Priya has a spreadsheet and strong opinions. (Scenario style borrowed from Token Quest's metro power ladders.)",
    choices: [
      c("INFRA", "Match racks to metros like Token Quest", "Real data-centre metros, different power blocks per city: scarce-power metros for the latency-critical bits, roomier cheaper-power metros for batch. Physics (about 5 µs/km in fibre) sets the speed limit, not the brochure.", { stress: -5, risk: -6, cost: -7, confidence: 9, chill: 4, time: 6, score: 125 }, { partner: "Colocation partner · metro sites" }),
      c("NETWORK", "Two metros + private fabric between them", "Split London/Frankfurt-style: inter-site private links only where a second metro earns its keep.", { stress: -4, risk: -7, cost: 1, confidence: 8, chill: 4, time: 5, score: 110 }, { partner: "Interconnection partner · metro links" }),
      c("SOFTWARE", "Pick whichever city is trending", "Decisions by vibes! The latency will also be vibes.", { stress: -9, chill: -3, score: 25 }, { delayed: { afterSec: 18, text: "WHIRR! Users on the other continent describe the app as 'meditative'.", sfx: "WHIRR!", fx: { stress: 12, risk: 2, cost: 6, confidence: -10, chill: -7 } } }),
    ],
  },
  // ---- Follow-up consequence cards (spawned by tempting choices) ----
  {
    id: "legal-fallout", severity: 3, person: "Legal", dept: "Legal", emoji: "⚖️", title: "FOLLOW-UP: “About that PowerPoint…”", followUp: true,
    body: "The ChatGPT deck is now Exhibit A. Regulators want a data-handling story by Monday.",
    choices: [
      c("SOFTWARE", "Full audit + approved AI rollout", "Own it, fix it, document it. Expensive in pride, cheap in fines.", { stress: -4, risk: -15, cost: 7, confidence: 8, chill: 4, time: 5, score: 120 }),
      c("NETWORK", "Private AI path via the private fabric", "Show the regulator a private, logged route for every byte.", { stress: -3, risk: -12, cost: 3, confidence: 7, chill: 3, time: 5, score: 110 }, { partner: "Interconnection partner · private fabric" }),
      c("INFRA", "Blame the intern (John is 44)", "Bold. Transparent. Doomed.", { stress: -8, risk: 5, chill: -5, score: 10 }, { delayed: { afterSec: 12, text: "WHAM! John has receipts. John has screenshots. John has a lawyer.", sfx: "WHAM!", fx: { stress: 14, risk: 14, cost: 8, confidence: -12, chill: -8 } } }),
    ],
  },
  {
    id: "payroll-chaos", severity: 3, person: "Everyone", dept: "Payroll", emoji: "💸", title: "FOLLOW-UP: “WHY WAS I PAID IN BUTTONS?”", followUp: true,
    body: "Double pay, missing pay, and one executive paid entirely in what the plugin calls 'exposure'.",
    choices: [
      c("SOFTWARE", "Emergency move to the enterprise HR payroll suite", "Enterprise HR/payroll suite in the cloud, reconciled by humans who are paid correctly first.", { stress: -6, risk: -12, cost: 6, confidence: 10, chill: 4, time: 6, score: 130 }, { partner: "Enterprise apps partner · HR/payroll suite" }),
      c("INFRA", "Freeze everything, paper cheques", "Retro! Secure! The stamp budget is devastated.", { stress: -3, risk: -8, cost: 6, confidence: 5, chill: 3, time: 4, score: 90 }),
      c("NETWORK", "Ask the plugin nicely to reverse it", "It has already spent the money. On plugins.", { stress: -9, chill: -5, score: 10 }, { delayed: { afterSec: 12, text: "KAPOW! The plugin auto-renewed. For the plant.", sfx: "KAPOW!", fx: { stress: 13, risk: 7, cost: 14, confidence: -10, chill: -8 } } }),
    ],
  },
];
export const cardById = (id: string) => CARDS.find((x) => x.id === id);
/** What an ignored card comes back as when it gets worse instead of bored. */
export function escalatedClone(card: GameCard): GameCard {
  if (card.escalatesTo) return cardById(card.escalatesTo) ?? card;
  return {
    ...card, id: `${card.id}-escalated`, followUp: true, severity: 3,
    title: `ESCALATED: ${card.title}`,
    body: `${card.body} You ignored it. It went away, thought about its life, and came back BIGGER — with friends and a meeting invite.`,
  };
}
