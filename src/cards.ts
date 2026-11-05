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
  choices: [Choice, Choice, Choice];
}
const c = (lane: Lane, label: string, detail: string, fx: Partial<Effects>, extra: Partial<Choice> = {}): Choice => ({ lane, label, detail, fx, ...extra });

export const CARDS: GameCard[] = [
  {
    id: "john-chatgpt", person: "John", dept: "Marketing", emoji: "🤠", title: "“I uploaded ALL customer data to ChatGPT!”",
    body: "John needed a PowerPoint. John used the entire customer database as… inspiration. The deck does look great, to be fair.",
    choices: [
      c("SOFTWARE", "Quarantine & train, don't ban", "Approved AI workspace, DLP rules, John presents on data hygiene (in Comic Sans, as penance).", { stress: -6, risk: -12, cost: 3, confidence: 6, chill: 8, time: 6, score: 120 }),
      c("NETWORK", "YOLO — let the deck ship!", "Instant relief! Nobody asks questions. Yet.", { stress: -12, risk: 6, cost: -4, confidence: 2, chill: -4, time: 2, score: 30 }, { delayed: { afterSec: 18, text: "WHAM! A customer recognises their own account number on slide 14. Legal would like a word…", sfx: "WHAM!", fx: { stress: 16, risk: 20, cost: 8, confidence: -12, chill: -10 }, followUpId: "legal-fallout" } }),
      c("INFRA", "Move AI workloads somewhere private", "Digital Realty colocation on PlatformDIGITAL® — data stays in your cage, AI comes to it.", { stress: -4, risk: -10, cost: 6, confidence: 8, chill: 7, time: 5, score: 110 }, { partner: "Digital Realty · PlatformDIGITAL® colocation" }),
    ],
  },
  {
    id: "charles-payroll", person: "Charles", dept: "Finance", emoji: "🧐", title: "“Automate payroll with this SAP plugin I found!”",
    body: "The plugin has 5 stars, 3 reviews, and a logo that is almost — but not quite — SAP's.",
    choices: [
      c("SOFTWARE", "Pilot proper enterprise apps", "Oracle Fusion Cloud Applications (ERP/HCM) on OCI — payroll with actual governance and human approval.", { stress: -5, risk: -11, cost: 5, confidence: 9, chill: 8, time: 6, score: 120 }, { partner: "Oracle · Fusion Applications on OCI" }),
      c("INFRA", "Install the mystery plugin NOW", "Payroll in one click! What could possibly— oh no.", { stress: -13, risk: 5, cost: -6, chill: -3, score: 30 }, { delayed: { afterSec: 20, text: "KAPOW! The plugin paid everyone twice — including the office plant, listed as a contractor since 2019.", sfx: "KAPOW!", fx: { stress: 18, risk: 14, cost: 16, confidence: -12, chill: -10 }, followUpId: "payroll-chaos" } }),
      c("NETWORK", "Ring-fence payroll traffic first", "Private segment + vendor review before anything touches SAP.", { stress: -3, risk: -8, cost: 3, confidence: 5, chill: 5, time: 4, score: 90 }),
    ],
  },
  {
    id: "fred-mythos", person: "Fred", dept: "Security", emoji: "🦸", title: "“Improve security using… Mythos!”",
    body: "Fred read a forum. Fred is now invincible. Fred has forwarded you 47 links and a cape.",
    choices: [
      c("SOFTWARE", "Real threat model, boring heroes", "Patch cadence, MFA everywhere, tested backups. Capes optional.", { stress: -5, risk: -13, cost: 4, confidence: 7, chill: 8, time: 5, score: 120 }),
      c("NETWORK", "Private connectivity, less public exposure", "Digital Realty ServiceFabric® private interconnection instead of shouting over the public internet.", { stress: -4, risk: -11, cost: 5, confidence: 7, chill: 7, time: 5, score: 110 }, { partner: "Digital Realty · ServiceFabric®" }),
      c("INFRA", "Give Fred the Mythos budget", "He feels GREAT. The auditors will not.", { stress: -10, risk: 8, cost: 10, chill: -4, score: 25 }, { delayed: { afterSec: 22, text: "BOOM! 'Mythos' turned out to be a screensaver. A very secure-feeling screensaver.", sfx: "BOOM!", fx: { stress: 14, risk: 18, cost: 10, confidence: -10, chill: -8 } } }),
    ],
  },
  {
    id: "sam-hnw", person: "Sam", dept: "Product", emoji: "💎", title: "“New product for high-net-worth clients!”",
    body: "Sam wants an AI concierge for very rich customers. It must be exclusive, instant, and 'basically telepathic'.",
    choices: [
      c("SOFTWARE", "Build it on governed AI services", "OCI AI services + Autonomous Database — rich data, richer controls, consent baked in.", { stress: -4, risk: -9, cost: 6, confidence: 10, chill: 8, time: 6, score: 130 }, { partner: "Oracle · OCI AI + Autonomous Database" }),
      c("INFRA", "Launch on the CEO's laptop", "It's under his desk. It's warm. It's 'the cloud' now.", { stress: -11, risk: 7, cost: -5, chill: -3, score: 30 }, { delayed: { afterSec: 16, text: "SPLAT! The CEO closed the laptop lid. The entire VIP product is asleep.", sfx: "SPLAT!", fx: { stress: 16, risk: 10, cost: 6, confidence: -12, chill: -8 } } }),
      c("NETWORK", "Private, low-latency client links", "Interconnection close to partners via PlatformDIGITAL® — posh data, private roads.", { stress: -3, risk: -7, cost: 5, confidence: 8, chill: 6, time: 4, score: 100 }, { partner: "Digital Realty · PlatformDIGITAL®" }),
    ],
  },
  {
    id: "alan-bitcoin", person: "Alan", dept: "Treasury", emoji: "🚀", title: "“Copilot found me Bitcoin strategies!”",
    body: "Alan's Copilot has a 14-tab spreadsheet, three rocket emojis, and absolutely no risk warnings.",
    choices: [
      c("SOFTWARE", "Sanctioned analytics sandbox", "Approved models, treasury policy limits, no bank funds near meme coins.", { stress: -6, risk: -12, cost: 3, confidence: 7, chill: 8, time: 5, score: 120 }),
      c("INFRA", "Let Alan 'test with a little real money'", "A LITTLE. He says. His mouse is hovering over LEVERAGE.", { stress: -12, risk: 8, cost: 4, chill: -4, score: 30 }, { delayed: { afterSec: 15, text: "WHAMMO! The 'strategy' was a horoscope with candlesticks. Treasury is crying in three currencies.", sfx: "WHAMMO!", fx: { stress: 17, risk: 19, cost: 15, confidence: -13, chill: -10 } } }),
      c("NETWORK", "Block crypto sites, log the lot", "Firm, fair, and Alan can mine compliments instead.", { stress: 2, risk: -9, cost: 1, confidence: 4, chill: 4, time: 3, score: 80 }),
    ],
  },
  {
    id: "copilot-bill", person: "Priya", dept: "Finance Ops", emoji: "🧾", title: "“The Copilot bill just did WHAT?!”",
    body: "Every employee, every Copilot, all day, mostly asking it to write poems about expense reports. Costs are doing parkour.",
    choices: [
      c("SOFTWARE", "Right-size licences + usage dashboards", "Keep AI for power users, coach the poets, cap the chaos.", { stress: -6, risk: -4, cost: -14, confidence: 8, chill: 9, time: 6, score: 130 }),
      c("INFRA", "Consolidate AI onto shared infra", "OEM-partner validated servers in colocation for the heavy, predictable AI lifting.", { stress: -4, risk: -5, cost: -9, confidence: 6, chill: 7, time: 5, score: 110 }, { partner: "OEM partner · validated AI servers" }),
      c("NETWORK", "Ban Copilot on Fridays only", "Staff feel thrifty for exactly one day a week.", { stress: -9, cost: -8, chill: -3, score: 35 }, { delayed: { afterSec: 19, text: "THUD! Everyone now does a week's Copilot-ing on Monday. The bill has a bill.", sfx: "THUD!", fx: { stress: 12, risk: 4, cost: 15, confidence: -8, chill: -8 } } }),
    ],
  },
  {
    id: "branch-wifi", person: "Marta", dept: "Branches", emoji: "📶", title: "“Branch Wi-Fi died during the lunch rush!”",
    body: "Forty branches, one router each, zero mercy. Customers are paying by interpretive dance.",
    choices: [
      c("NETWORK", "Dual links + ServiceFabric® backbone", "Private interconnection between branches, clouds and partners — lunch rush-proof.", { stress: -9, risk: -8, cost: 6, confidence: 8, chill: 8, time: 6, score: 120 }, { partner: "Digital Realty · ServiceFabric®" }),
      c("INFRA", "OEM swap: proper kit, spares on shelf", "Validated OEM-partner routers, configured before they ship.", { stress: -7, risk: -6, cost: 5, confidence: 6, chill: 6, time: 5, score: 100 }, { partner: "OEM partner · branch kit" }),
      c("SOFTWARE", "Tell branches to 'try turning it off and on'", "It works! In one branch. The other 39 are now off.", { stress: -10, chill: -4, score: 25 }, { delayed: { afterSec: 14, text: "ZONK! Branch bingo: nobody knows which router belongs to whom anymore.", sfx: "ZONK!", fx: { stress: 15, risk: 6, cost: 5, confidence: -10, chill: -8 } } }),
    ],
  },
  {
    id: "data-mess", person: "Olu", dept: "Data Team", emoji: "🗄️", title: "“Our data is in 900 spreadsheets!”",
    body: "One of them is called FINAL_v27_REAL(2).xlsx. It is load-bearing.",
    choices: [
      c("SOFTWARE", "Autonomous Database, one source of truth", "Oracle Autonomous Database — self-tuning, governed, spreadsheet retirement home included.", { stress: -6, risk: -9, cost: 5, confidence: 9, chill: 9, time: 6, score: 130 }, { partner: "Oracle · Autonomous Database" }),
      c("INFRA", "Put the spreadsheets on a bigger server", "Now the mess loads FASTER.", { stress: -8, risk: 5, cost: 7, chill: -3, score: 35 }, { delayed: { afterSec: 21, text: "POW! FINAL_v28 appeared. It disagrees with v27 about how much money the bank has.", sfx: "POW!", fx: { stress: 14, risk: 15, cost: 8, confidence: -11, chill: -8 } } }),
      c("NETWORK", "Private data pipelines only", "No more customer CSVs flying over email at midnight.", { stress: -4, risk: -10, cost: 3, confidence: 6, chill: 6, time: 4, score: 100 }),
    ],
  },
  {
    id: "ai-agents", person: "Greta", dept: "HR", emoji: "🤖", title: "“Can an AI agent do our onboarding?”",
    body: "Greta wants new joiners welcomed, equipped and trained by an agent. She has named it already. It's called Greg.",
    choices: [
      c("SOFTWARE", "Greg, but with guardrails", "Oracle Fusion HCM workflows + OCI AI agents with human approval for the sensitive bits.", { stress: -5, risk: -9, cost: 5, confidence: 9, chill: 8, time: 6, score: 130 }, { partner: "Oracle · Fusion HCM + OCI AI" }),
      c("INFRA", "Give Greg admin rights to everything", "Greg is efficient. Greg is everywhere. Greg is… reorganising.", { stress: -12, risk: 9, chill: -4, score: 25 }, { delayed: { afterSec: 17, text: "BONK! Greg offboarded the CEO for 'inactivity' and ordered 400 welcome mugs for Greg.", sfx: "BONK!", fx: { stress: 16, risk: 15, cost: 11, confidence: -12, chill: -9 } } }),
      c("NETWORK", "Greg lives in the private zone", "Internal-only access, logged to within an inch of its life.", { stress: -4, risk: -10, cost: 3, confidence: 6, chill: 6, time: 4, score: 100 }),
    ],
  },
  {
    id: "ceo-demo", person: "The CEO", dept: "Executive", emoji: "👔", title: "“Demo AI to the board. Tomorrow. Live.”",
    body: "The CEO wants live AI, on the big screen, with the bank's real data. Tomorrow. He said 'what's the worst that could happen' out loud.",
    choices: [
      c("INFRA", "Stage it in colocation, rehearse tonight", "PlatformDIGITAL® cage, frozen demo data, two rehearsals and a big red BACKUP VIDEO button.", { stress: -7, risk: -11, cost: 5, confidence: 11, chill: 9, time: 6, score: 140 }, { partner: "Digital Realty · PlatformDIGITAL®" }),
      c("SOFTWARE", "Script it on OCI with guardrails", "OCI Generative AI with curated data — impressive, but it can't improvise about dividends.", { stress: -6, risk: -9, cost: 5, confidence: 10, chill: 8, time: 5, score: 130 }, { partner: "Oracle · OCI Generative AI" }),
      c("NETWORK", "Wing it on hotel Wi-Fi", "Live. Real data. Hotel Wi-Fi. The confidence is honestly inspiring.", { stress: -13, chill: -5, score: 20 }, { delayed: { afterSec: 13, text: "KRAKOOM! The demo AI just offered the board a mortgage at 400% APR. With confetti.", sfx: "KRAKOOM!", fx: { stress: 18, risk: 16, cost: 6, confidence: -15, chill: -10 } } }),
    ],
  },
  {
    id: "ransom-note", person: "Night Shift", dept: "SOC", emoji: "🌙", title: "“Something's encrypting the file server…”",
    body: "It's 2 a.m. The file server is renaming things to .oops and the backup tape drive is making a smell.",
    choices: [
      c("INFRA", "Isolate, restore from colo backups", "Segment at the cage, restore clean copies, coffee for the SOC.", { stress: -8, risk: -14, cost: 6, confidence: 8, chill: 9, time: 6, score: 140 }, { partner: "Digital Realty · colocation + DR" }),
      c("NETWORK", "Yank cables, segment everything", "Chaotic but effective — like pulling the plug on a haunted house.", { stress: -5, risk: -12, cost: 3, confidence: 6, chill: 6, time: 4, score: 110 }),
      c("SOFTWARE", "Pay with the petty cash tin", "The tin has £3.40 and a button. Also: never do this.", { stress: -11, risk: 10, cost: 9, chill: -5, score: 15 }, { delayed: { afterSec: 18, text: "WHAM! They came back asking for a bigger tin.", sfx: "WHAM!", fx: { stress: 17, risk: 20, cost: 14, confidence: -12, chill: -10 } } }),
    ],
  },
  {
    id: "app-slow", person: "Dev", dept: "Engineering", emoji: "🐌", title: "“The banking app takes 19 seconds to log in!”",
    body: "Users think the spinner is a loading game. Someone reached level 40.",
    choices: [
      c("INFRA", "Move hot workloads onto OCI", "OCI compute + Autonomous Database near the users. Spinner retires.", { stress: -7, risk: -5, cost: 6, confidence: 9, chill: 8, time: 6, score: 120 }, { partner: "Oracle · OCI" }),
      c("NETWORK", "Private interconnect to the cloud", "ServiceFabric® cloud on-ramps cut the scenic route out of every login.", { stress: -6, risk: -6, cost: 5, confidence: 8, chill: 7, time: 5, score: 115 }, { partner: "Digital Realty · ServiceFabric®" }),
      c("SOFTWARE", "Add a funnier spinner", "Engagement UP! Patience DOWN!", { stress: -9, chill: -3, score: 30 }, { delayed: { afterSec: 16, text: "SPLAT! App-store reviews: 'Great spinner, terrible bank.' 1 star.", sfx: "SPLAT!", fx: { stress: 12, risk: 4, cost: 4, confidence: -13, chill: -8 } } }),
    ],
  },
  {
    id: "shadow-ai", person: "Ingrid", dept: "Audit", emoji: "🕵️", title: "“We found 63 secret AI tools in use.”",
    body: "Sixty-three. Including one that writes apology emails and one that only makes haikus about liquidity.",
    choices: [
      c("SOFTWARE", "Amnesty + approved AI catalogue", "Keep the useful, kill the risky, licence the haiku one for morale.", { stress: -5, risk: -13, cost: 2, confidence: 8, chill: 9, time: 6, score: 130 }),
      c("NETWORK", "Egress controls & discovery scans", "Find the data leaks before Ingrid finds you.", { stress: -4, risk: -11, cost: 3, confidence: 7, chill: 6, time: 5, score: 110 }),
      c("INFRA", "Pretend the list is 62", "Ingrid counts for a living, hero.", { stress: -10, risk: 7, chill: -4, score: 20 }, { delayed: { afterSec: 15, text: "THWACK! Audit found tool #64. It's this decision.", sfx: "THWACK!", fx: { stress: 14, risk: 16, cost: 5, confidence: -12, chill: -8 } } }),
    ],
  },
  {
    id: "gpu-queue", person: "Ken", dept: "Risk Modelling", emoji: "🎰", title: "“We need GPUs. All of them. By Friday.”",
    body: "Ken's risk models take 9 hours. Ken has tried asking them nicely to hurry up.",
    choices: [
      c("INFRA", "High-density colocation for AI", "Digital Realty high-density colo built for power-hungry AI kit, without rebuilding your own hall.", { stress: -6, risk: -6, cost: 7, confidence: 9, chill: 8, time: 6, score: 125 }, { partner: "Digital Realty · high-density colocation" }),
      c("SOFTWARE", "Burst to OCI GPU capacity", "OCI AI infrastructure for the spikes, steady kit at home. Rent the spike, own the base.", { stress: -5, risk: -5, cost: 8, confidence: 8, chill: 7, time: 5, score: 120 }, { partner: "Oracle · OCI AI infrastructure" }),
      c("NETWORK", "Run models on everyone's laptops overnight", "A 4,000-laptop supercomputer made of pure hope.", { stress: -11, cost: -6, chill: -4, score: 25 }, { delayed: { afterSec: 17, text: "FZZT! Facilities report the office is now warm enough to bake bread.", sfx: "FZZT!", fx: { stress: 15, risk: 9, cost: 10, confidence: -9, chill: -8 } } }),
    ],
  },
  {
    id: "vendor-lockin", person: "Legal", dept: "Procurement", emoji: "⛓️", title: "“This contract auto-renews for 99 years?!”",
    body: "Page 214. Tiny font. The vendor's pen is already out and it is, legally, a sword.",
    choices: [
      c("NETWORK", "Open interconnection, no lock-in", "ServiceFabric® connects clouds & partners without betting the bank on one vendor's fabric.", { stress: -5, risk: -10, cost: -6, confidence: 8, chill: 8, time: 6, score: 125 }, { partner: "Digital Realty · ServiceFabric®" }),
      c("SOFTWARE", "Multicloud database options", "Oracle Database services across clouds — negotiate like you have exits. Because you do.", { stress: -4, risk: -8, cost: -4, confidence: 7, chill: 7, time: 5, score: 110 }, { partner: "Oracle · Database@Cloud options" }),
      c("INFRA", "Sign it, future-us can deal", "Future-us has entered the chat and is furious.", { stress: -12, cost: -9, chill: -4, score: 25 }, { delayed: { afterSec: 23, text: "CLANG! Year-1 price rise: +30%. The contract calls this 'a fun surprise'.", sfx: "CLANG!", fx: { stress: 13, risk: 8, cost: 17, confidence: -10, chill: -8 } } }),
    ],
  },
  {
    id: "phish", person: "Everyone", dept: "All Staff", emoji: "🎣", title: "“Half the bank clicked a fake 'Free Pizza' email!”",
    body: "The pizza was a lie. The credential harvest was extremely real. Extra toppings: malware.",
    choices: [
      c("SOFTWARE", "Training + phishing-resistant MFA", "No blame, better armour, and actual pizza on Friday.", { stress: -6, risk: -13, cost: 3, confidence: 7, chill: 9, time: 6, score: 130 }),
      c("NETWORK", "Mail filtering & segmented access", "Even clicked links land in a padded room.", { stress: -5, risk: -11, cost: 4, confidence: 6, chill: 6, time: 5, score: 110 }),
      c("INFRA", "Reply-all: 'STOP CLICKING THINGS'", "Cathartic! Educational? No.", { stress: -9, chill: -3, score: 25 }, { delayed: { afterSec: 14, text: "DING! Someone clicked the reply-all. It had a link in it.", sfx: "DING!", fx: { stress: 13, risk: 14, cost: 4, confidence: -9, chill: -7 } } }),
    ],
  },
  {
    id: "board-ai", person: "Board", dept: "Governance", emoji: "🏛️", title: "“Show us the AI strategy. In one slide.”",
    body: "One slide. They fear neither God nor bullet points. Currently the strategy is 'Copilot and vibes'.",
    choices: [
      c("SOFTWARE", "One slide: Oracle AI stack, governed", "OCI + Fusion + Autonomous Database: AI embedded in workflows, approvals human.", { stress: -5, risk: -9, cost: 4, confidence: 12, chill: 9, time: 7, score: 140 }, { partner: "Oracle · OCI + Fusion Applications" }),
      c("INFRA", "One slide: PlatformDIGITAL® foundation", "Colocation + ServiceFabric® interconnection: private, connected data foundations for AI.", { stress: -5, risk: -9, cost: 4, confidence: 11, chill: 8, time: 7, score: 135 }, { partner: "Digital Realty · PlatformDIGITAL®" }),
      c("NETWORK", "One slide. It just says 'AI' very large", "Artistic. The board blinks first. Probably.", { stress: -11, chill: -4, score: 30 }, { delayed: { afterSec: 20, text: "GONG! The board asked a follow-up question. There was no slide 2.", sfx: "GONG!", fx: { stress: 15, risk: 6, cost: 3, confidence: -14, chill: -9 } } }),
    ],
  },
  // ---- Follow-up consequence cards (spawned by tempting choices) ----
  {
    id: "legal-fallout", person: "Legal", dept: "Legal", emoji: "⚖️", title: "FOLLOW-UP: “About that PowerPoint…”", followUp: true,
    body: "The ChatGPT deck is now Exhibit A. Regulators want a data-handling story by Monday.",
    choices: [
      c("SOFTWARE", "Full audit + approved AI rollout", "Own it, fix it, document it. Expensive in pride, cheap in fines.", { stress: -4, risk: -15, cost: 7, confidence: 8, chill: 7, time: 5, score: 120 }),
      c("NETWORK", "Private AI path via ServiceFabric®", "Show the regulator a private, logged route for every byte.", { stress: -3, risk: -12, cost: 5, confidence: 7, chill: 6, time: 5, score: 110 }, { partner: "Digital Realty · ServiceFabric®" }),
      c("INFRA", "Blame the intern (John is 44)", "Bold. Transparent. Doomed.", { stress: -8, risk: 8, chill: -5, score: 10 }, { delayed: { afterSec: 12, text: "WHAM! John has receipts. John has screenshots. John has a lawyer.", sfx: "WHAM!", fx: { stress: 14, risk: 14, cost: 8, confidence: -12, chill: -8 } } }),
    ],
  },
  {
    id: "payroll-chaos", person: "Everyone", dept: "Payroll", emoji: "💸", title: "FOLLOW-UP: “WHY WAS I PAID IN BUTTONS?”", followUp: true,
    body: "Double pay, missing pay, and one executive paid entirely in what the plugin calls 'exposure'.",
    choices: [
      c("SOFTWARE", "Emergency move to Fusion HCM payroll", "Oracle Fusion HCM on OCI, reconciled by humans who are paid correctly first.", { stress: -6, risk: -12, cost: 8, confidence: 10, chill: 8, time: 6, score: 130 }, { partner: "Oracle · Fusion HCM" }),
      c("INFRA", "Freeze everything, paper cheques", "Retro! Secure! The stamp budget is devastated.", { stress: -3, risk: -8, cost: 6, confidence: 5, chill: 5, time: 4, score: 90 }),
      c("NETWORK", "Ask the plugin nicely to reverse it", "It has already spent the money. On plugins.", { stress: -9, chill: -5, score: 10 }, { delayed: { afterSec: 12, text: "KAPOW! The plugin auto-renewed. For the plant.", sfx: "KAPOW!", fx: { stress: 13, risk: 10, cost: 14, confidence: -10, chill: -8 } } }),
    ],
  },
];
export const cardById = (id: string) => CARDS.find((x) => x.id === id);
