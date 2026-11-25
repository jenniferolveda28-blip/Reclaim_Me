// Content for the HelixVerify token "paperwork prototype" — the document layer
// stakeholders and external auditors read before touching the live system.

export const DOCUMENT_CONTROL = [
  ['Document ID', 'HLXV-PPR-001'],
  ['Title', 'HelixVerify Token Architecture — Paperwork Prototype'],
  ['Version', '0.1 (Prototype)'],
  ['Status', 'Draft for stakeholder and external auditor review'],
  ['Owner', 'Reclaim Me — Security Architecture'],
  ['Classification', 'Confidential — stakeholder and auditor distribution'],
  ['Effective date', '2026-11-25'],
  ['Review cycle', 'Re-reviewed at every architecture change and before any production issuance'],
];

export const REVISIONS = [
  ['0.1', '2026-11-25', 'Initial paperwork prototype: token architecture, control set and evidence map'],
];

export const TOKEN_FIELDS = [
  ['Token serial', 'token_serial', 'Factory-issued unique serial printed on the device and recorded at registration'],
  ['Hardware identity', 'device_id', 'Non-cloneable hardware identifier that binds one physical token to one enrollment'],
  ['Secret', 'secret_key', 'One-time-code secret provisioned in a controlled step and stored server-side only, encrypted'],
  ['Rotating code', 'current_code', 'Short-lived one-time code presented at authentication; each code is accepted once'],
  ['Form factor', 'form_factor', 'Wearable band, skin patch or subdermal chip'],
  ['Manual identity gate', 'manual_identity_verified', 'Activation is blocked until a named verifier completes a manual identity check'],
  ['Radio lock', 'rf_read_locked', 'The subdermal form keeps its radio interface locked until identity verification succeeds'],
  ['Lockout', 'failed_attempts', 'Three consecutive failed attempts lock the token and require administrator-assisted recovery'],
  ['Device health', 'battery_level, firmware_version, sync_status', 'Reported to the hardware status dashboard for the wearer and the owner'],
];

export const LAYERS = [
  {
    id: 'L1',
    name: 'HelixVerify',
    role: 'DNA wearable identity anchor — who you are',
    mechanism: 'An enrolled genetic hash is bound to one wearable token that issues rotating one-time codes. No password, fingerprint or face fallback exists.',
    status: 'Enrollment, registration and verification logic implemented in the platform. Physical wearable not yet built.',
  },
  {
    id: 'L2',
    name: 'CipherPass',
    role: 'Protected API gateway — what you may access',
    mechanism: 'Scoped, short-lived access is issued only after a token verification succeeds, with AI-assisted routing, rate limiting and automatic failover.',
    status: 'Implemented in the platform.',
  },
  {
    id: 'L3',
    name: 'Dynamic Scrambler (IP Shield)',
    role: 'Moving-target defense — how you stay protected',
    mechanism: 'Keys, data paths and encryption layers rotate continuously, so a captured credential expires before it can be replayed.',
    status: 'Implemented in the platform. Rotation intervals shown in dashboards are simulated.',
  },
];

export const ENROLLMENT_STEPS = [
  ['Consent captured', 'Collection, storage and permitted-use consent, GINA acknowledgement and a typed electronic signature are recorded before any sample is accepted.', 'system_DnaEnrollment'],
  ['Kit issued, sample received', 'The kit carries a barcoded sample ID; courier tracking and intake date establish chain of custody.', 'system_DnaSample'],
  ['Lab returns a one-way hash', 'A CLIA-certified partner processes the sample and returns a genetic hash. Raw sequence data is never stored by the platform.', 'system_DnaSample.dna_hash'],
  ['Token registered', 'Serial, form factor, hash and a biometric confidence score are recorded against the enrolling person.', 'HelixVerifyRegistration'],
  ['Manual identity check', 'A named verifier completes a government-ID check and records their identity and the document reference.', 'identity_verifier_email, identity_document_ref'],
  ['Activation', 'Status moves to activated and the radio lock is released only after the manual check in step 5.', 'HelixVerifyRegistration, HelixVerifyToken'],
  ['Retention clock starts', 'A destruction date is set at enrollment and the destruction monitor flags expiry.', 'retention_expires_date'],
];

export const VERIFICATION_STEPS = [
  'The wearer presents the current code from their token.',
  'The server validates the code window and rejects any reuse of a spent code.',
  'The server confirms the token is active, bound to an enrollment, and not locked.',
  'Liveness and wear state are checked; a token removed from the body stops issuing codes.',
  'A failed attempt increments the counter; the third failure locks the token and records a token activation failure.',
  'Every outcome is written to the security log with event type, threat level and result.',
  'CipherPass issues scoped access while the Dynamic Scrambler keeps rotating underneath.',
];

export const CONTROLS = [
  ['HV-AC-01', 'Identity binding is DNA-only', 'Genetic hash plus confidence score; no fallback authenticator', 'HelixVerifyRegistration.dna_hash, biometric_confidence'],
  ['HV-AC-02', 'No static credential exists', 'Rotating one-time code refreshed on a short interval', 'HelixVerifyToken.current_code, last_code_generated'],
  ['HV-AC-03', 'Brute-force lockout', 'Token locks after three consecutive failures', 'failed_attempts; security log token_activation_failure'],
  ['HV-AC-04', 'Human gate before activation', 'Named verifier plus government-ID reference required', 'manual_identity_verified, identity_verifier_email'],
  ['HV-AC-05', 'Radio interface locked by default', 'Subdermal token cannot be read until verification succeeds', 'rf_read_lock_engaged, rf_read_locked'],
  ['HV-AC-06', 'Least privilege on records', 'Row-level security per entity and per role', 'Entity access policies'],
  ['HV-AC-07', 'Independent auditor oversight', 'Passcode-gated auditor portal; every access attempt logged', 'AuditorAccessPass, AuditorAccessLog'],
  ['HV-AC-08', 'Data minimisation', 'Only a one-way hash is retained; no sequence data field exists', 'system_DnaSample record shape'],
  ['HV-AC-09', 'Automated destruction', 'Retention expiry drives the destruction workflow', 'retention_expires_date, destruction monitor'],
  ['HV-AC-10', 'Moving-target defense', 'Continuous key and path rotation under the gateway', 'ScramblingSession records, scrambling reports'],
];

export const EVIDENCE = [
  ['HelixVerifyRegistration', 'Enrollment, verifier identity, activation state', 'Subject, administrator'],
  ['HelixVerifyToken', 'Token identity, lock state, sync and battery health', 'Subject, administrator'],
  ['system_DnaSample', 'Chain of custody, hash generation, destruction date', 'Administrator only'],
  ['system_DnaEnrollment', 'Consent, retention choice, withdrawal', 'Subject, administrator'],
  ['SecurityLog', 'Verification outcomes, threats, activation failures', 'Subject (own records), administrator, auditor'],
  ['AuditorAccessLog', 'Every auditor access attempt and its result', 'Administrator, auditor'],
  ['ScramblingSession', 'Rotation activity behind the gateway', 'Administrator'],
];

export const STANDARDS = [
  ['GINA', 'Consent, permitted use and withdrawal rights are captured before collection', 'Procedural mapping, not a certification'],
  ['State genetic-privacy law', 'Consent and automated destruction controls', 'Jurisdiction review still pending'],
  ['NIST SP 800-63B', 'Design targets strong authenticator binding and lockout behaviour', 'Not yet assessed against the standard'],
  ['OWASP ASVS', 'Authentication, session and logging controls reflected in the control set', 'Self-assessment only'],
  ['SOC 2 / ISO 27001', 'Access control, logging and vendor management mapped to common criteria', 'No independent audit performed'],
];

export const LIMITATIONS = [
  'The wearable hardware does not exist yet. Codes are generated and displayed in software for demonstration.',
  'Biometric confidence values in demonstration records are illustrative, not measured.',
  'Dynamic Scrambler rotation intervals shown in dashboards are simulated.',
  'No third-party audit, certification or production issuance has taken place.',
  'Laboratory partnership, chain-of-custody logistics and jurisdiction-specific legal review remain open.',
];

export const GLOSSARY = [
  ['TOTP', 'Time-based one-time password; a code derived from a shared secret and the current time window.'],
  ['Genetic hash', 'A fixed-length value derived one-way from genetic markers. It cannot be reversed into a sequence.'],
  ['Form factor', 'The physical shape of the token: wearable band, skin patch or subdermal chip.'],
  ['Radio lock', 'A state in which the token refuses to transmit until identity verification succeeds.'],
  ['Manual identity verification', 'A human check of a government ID, recorded against the enrollment before activation.'],
  ['Row-level security', 'Record access rules enforced per user and role at the data layer.'],
  ['Moving-target defense', 'Continuously changing keys and paths so an intercepted credential is already void.'],
  ['Chain of custody', 'The documented trail of who held a sample and when, from kit to laboratory.'],
  ['AAL3', 'An authenticator assurance level defined by NIST for hardware-based, verifier-impersonation-resistant authentication.'],
];

export const ATTESTATION_CHECKLIST = [
  'Token identity fields match the enrollment record for every issued token.',
  'A named verifier and document reference are present before any activation.',
  'Lockout behaviour observed at three consecutive failed attempts.',
  'A retention and destruction date exists for every sample on record.',
  'Auditor access is passcode-gated and every attempt appears in the access log.',
  'No raw genetic sequence data is present in any stored record.',
];