// Outreach campaign content for Reclaim Me.
// Three audiences, deliberately narrow: personal authentication users,
// investors, and biological engineers (talent / partnership channel).

export const AUDIENCES = [
  {
    id: 'investors',
    priority: 1,
    name: 'Investors in Reclaim Me',
    who: 'Deep-tech and biotech funds, accelerators that back pre-prototype hardware, and angel syndicates with security or health-tech exposure.',
    notThis: 'Not generalist SaaS funds. They will price this as a feature, not a platform.',
    channels: [
      'Direct email from the founder, one at a time',
      'Warm introductions through security and biotech operators',
      'Accelerator programmes that fund pre-prototype hardware (IndieBio, HAX)',
      'LinkedIn, after the email has been sent',
    ],
    angle: 'A working software platform plus a defined hardware path. Lead with what exists, name what is missing, and state exactly what the money buys.',
    cta: 'A 20-minute call, with the demo open on screen.',
    cadence: '10 new contacts per week, one follow-up at day 4 and one at day 11.',
    metric: 'Investor contacts logged, then demo bookings',
    tools: [
      { label: 'Investor CRM', to: '/InvestorCRM' },
      { label: 'Investor Overview', to: '/InvestorOverview' },
      { label: 'Investor Demo', to: '/InvestorDemo' },
    ],
  },
  {
    id: 'engineers',
    priority: 2,
    name: 'Biological engineers',
    who: 'Bioinformatics and synthetic-biology engineers, microfluidics and biosensor specialists, and academic labs working on DNA readout or wearable diagnostics.',
    notThis: 'Not a marketing audience. Treat every contact as a talent and co-development conversation, never as a lead.',
    channels: [
      'BioSpace, in the résumé and project language engineers actually use',
      'LinkedIn: bioinformatics, synthetic biology, BioMEMS groups',
      'University labs and tech-transfer offices (MIT, Stanford, Johns Hopkins)',
      'Engineering communities where the work, not the pitch, is discussed',
    ],
    angle: 'Equity participation in a co-development partnership. The cloud platform is built and validated; the wearable is the open engineering problem, and the person who solves it should own part of it.',
    cta: 'A technical conversation about the assay, the sensor and the failure modes.',
    cadence: '15 lab and engineer contacts per week, plus one public technical post.',
    metric: 'Technical calls booked, then partnership letters of intent',
    tools: [
      { label: 'Build With Us', to: '/SeekingPartners' },
      { label: 'Prototype Schematics', to: '/helix-prototype-schematics' },
      { label: 'Token Requirements', to: '/helix-token-requirements' },
    ],
  },
  {
    id: 'users',
    priority: 3,
    name: 'Personal authentication users',
    who: 'Privacy-literate people who have already lost access to an account, been listed by a data broker, or had a device stolen. They are searching for identity recovery, not for another password manager.',
    notThis: 'Not a general consumer audience. Broad ads waste budget here and attract people who will not tolerate a DNA-based model.',
    channels: [
      'Privacy communities where identity theft and broker exposure are already discussed',
      'Identity-theft support groups and recovery forums',
      'Personal-security newsletters and privacy tool directories',
      'Organic search around lockout, broker removal and account recovery',
    ],
    angle: 'The story, not the spec sheet: a stolen phone cost irreplaceable photos, and the platform exists so no one is locked out of their own life again.',
    cta: 'Read the story, then run an exposure check.',
    cadence: 'Two genuine community contributions per week before any link is shared.',
    metric: 'Contact form submissions and exposure checks started',
    tools: [
      { label: 'Exposure Shield', to: '/exposure-shield' },
      { label: 'Data Brokers', to: '/data-broker-directory' },
      { label: 'Contact', to: '/Contact' },
    ],
  },
];

export const TEMPLATES = [
  {
    id: 'investor-email',
    audience: 'Investors',
    title: 'First investor email',
    subject: 'Reclaim Me — identity recovery platform, pre-prototype hardware',
    body: `Hi [Name],

I'm building Reclaim Me: a platform that restores access to a person's accounts and data after a theft, lockout or broker exposure, anchored to a wearable that verifies identity from a genetic hash rather than a password.

What exists today: the cloud platform. The CipherPass gateway, the Dynamic Scrambler (key and path rotation), the audit trail and the exposure-removal workflow are all built and running. The wearable token is specified but not yet built, and I won't pretend otherwise.

What the round funds: the first working token prototype with a lab partner, plus the compliance work that has to precede any issuance.

I have a short demo you can open in the browser and a two-page architecture document written for auditors. Would 20 minutes this week or next work for a first conversation?

[Your name]
Reclaim Me`,
  },
  {
    id: 'engineer-email',
    audience: 'Biological engineers',
    title: 'Bio engineer / lab partnership',
    subject: 'Co-development partnership — wearable DNA verification, equity participation',
    body: `Hi [Name],

I'm the founder of Reclaim Me. We've built and validated the software side of a DNA-anchored identity token: enrollment, hashing, rotating one-time codes, lockout, audit trail and the destruction schedule. The hardware is the unsolved part, and that's why I'm writing.

The problem is narrow and specific: a wearable that reads a small panel of genetic markers, confirms the sample belongs to the enrolled person, and issues a rotating code from a secure element. Microfluidics, an optical readout, liveness, and a power budget that survives being worn.

I'm looking for a co-development partner, not a vendor. That means equity participation in the token programme, named authorship on the work, and a say in the architecture. I can share the schematics, the token requirements document and the failure modes we've already mapped.

Would you be open to a technical conversation, no pitch deck?

[Your name]
Reclaim Me`,
  },
  {
    id: 'lab-email',
    audience: 'Biological engineers',
    title: 'University lab / tech transfer',
    subject: 'Research collaboration — wearable genetic-marker verification',
    body: `Hi [Name],

I'm building a wearable device that verifies identity from a small panel of genetic markers, with the goal of recovering access to accounts after a theft or lockout. The platform around it is built; the assay and sensor are not.

I'd like to explore a sponsored research or co-development arrangement with your group, with an option to license the resulting work. I can share the marker panel, the liveness approach and the hardware constraints, and I'm happy to start with a technical review rather than a commercial discussion.

If this is better routed to your tech-transfer office, I'd appreciate the introduction.

[Your name]
Reclaim Me`,
  },
  {
    id: 'community-post',
    audience: 'Personal authentication users',
    title: 'Privacy community contribution',
    subject: 'Ask first, link later',
    body: `I lost a phone in 2024 and with it the last photos of family members who are gone. What actually locked me out wasn't the phone, it was the recovery chain behind it.

I've spent the time since building a recovery platform around that problem: exposure discovery and removal requests, an audit trail of every access attempt, and an identity anchor that isn't a password or a phone number.

Before I share a link: for people here who have been through a lockout or a broker listing, what would you actually want such a system to prove before you trusted it? I'm more interested in the objections than the encouragement.`,
  },
  {
    id: 'user-reply',
    audience: 'Personal authentication users',
    title: 'Reply to an exposure check',
    body: `Thanks for running the check — that's a real result, not a hypothetical one.

Two things you can do now, both free: request removal from each broker listed (the directory page has the opt-out route for every one of them), and turn on two-factor everywhere that offers it while you decide on anything stronger.

If you want, I'll walk you through what an identity anchor that isn't a phone number would look like for your case. No pressure either way.`,
  },
];

export const SEQUENCE = [
  ['Weeks 1-2', 'Build the lists', '25 investors, 15 labs and engineers, 5 communities. Named humans only, no scraped addresses.'],
  ['Weeks 3-4', 'First wave', '10 investor emails and 15 engineer emails per week. One community contribution per week, no links.'],
  ['Weeks 5-6', 'Follow-up and demo', 'Day-4 and day-11 follow-ups. Book demos, open the platform live rather than sending slides.'],
  ['Weeks 7-8', 'Convert the conversations', 'Partner calls with the schematics open. Log every outcome in the CRM and cut the channels that produced nothing.'],
];

export const GUARDRAILS = [
  'Never describe personal authentication as a general consumer product. The audience is privacy-literate and will check every claim.',
  'State the hardware status plainly in the first two sentences of any investor or engineer message.',
  'Equity and partnership terms are discussed in conversation only, never in a first email and never without legal review.',
  'One community contribution before any link. Link-dropping gets the account removed and the channel closed.',
  'No invented traction numbers, certifications or lab partnerships anywhere in outreach.',
];