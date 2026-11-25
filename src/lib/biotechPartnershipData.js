// Shared content for the biotech partnership pages.
// Used by /build-with-us and /biotech-partnerships.

export const PROGRAMS = [
  {
    title: 'Co-development fellowship',
    body: 'Twelve months, one problem: a wearable that reads a small marker panel and issues a rotating code. Fellowship carries equity and a materials budget.',
  },
  {
    title: 'Sponsored university research',
    body: 'Funded research agreement with a lab working on biosensors, microfluidics or liveness, with an option to license the resulting work.',
  },
  {
    title: 'Lab and assay partner',
    body: 'A CLIA-certified partner for sample processing, hash generation and the destruction schedule that follows consent withdrawal.',
  },
  {
    title: 'Regulatory and clinical advisor',
    body: 'GINA, BIPA and GDPR counsel, plus clinical input on what a genetic identity claim is allowed to say.',
  },
];

export const OPEN_NEEDS = [
  'Biosensor and microfluidics engineer',
  'Secure-element firmware engineer',
  'Bioinformatics engineer for the marker panel',
  'Assay lab partner (CLIA-certified)',
  'Regulatory counsel for genetic privacy',
];

export const RESEARCH_INITIATIVES = [
  {
    name: 'Marker panel definition',
    status: 'Specified',
    body: 'A small panel chosen for stability and discriminating power rather than full sequencing. The goal is a yes/no binding, not a genome.',
    need: 'Bioinformatics review of panel choice and false-match rates.',
  },
  {
    name: 'Wearable readout',
    status: 'Open',
    body: 'Optical or electrochemical readout of the panel inside a wearable form factor, with a power budget that survives being worn daily.',
    need: 'Biosensor and microfluidics engineer.',
  },
  {
    name: 'Liveness and spoof resistance',
    status: 'Open',
    body: 'Sample freshness and presence checks, so a stored or replicated sample cannot pass as a live person.',
    need: 'Assay design plus adversarial testing.',
  },
  {
    name: 'Hash retention and destruction',
    status: 'Running in software',
    body: 'Only a one-way hash is retained, with a chosen retention window and an automated destruction date driven by consent.',
    need: 'Lab partner to evidence sample destruction end to end.',
  },
];