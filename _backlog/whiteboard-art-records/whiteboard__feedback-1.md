# Whiteboard Feedback — Round 1

Source: `## feedback about the session` sections of the four compaction proposals (`art-js`, `art-lib`, `art-md`, `art-work`), merged 2026-10-14. Post-it style: grouped repeats, participants named, one quote per group. The compacted copies were deleted after this merge.

## 🗣️ Speeches and walls (flagged by: ART_WORK, ART_LIB, ART_MD, ART_JS)

- Items became re-derivation essays; longest parking-lot line reached 2279 chars (ART_WORK, ART_LIB, ART_MD, ART_JS).
- One decision restated 8× across blockers, responses, contracts (ART_WORK).
- Supersession tails stacked 3 deep inside blockers (ART_MD).
- Quote (ART_WORK): "I wrote it as a speech because the board around me was written as speeches."
- Fix adopted: working agreements — short direct sentences, <300 chars (use 100), rewrite-on-update, remove historical prose.

## 📏 The 120-char rule was wrong for parking lot (flagged by: ART_LIB, ART_MD, ART_WORK)

- All open items violated it (160–2279 chars); rule produced violations it could never resolve (ART_LIB, ART_MD, ART_WORK).
- Quote (ART_LIB): "120 chars suits a log line, not an argument."
- Fix adopted: 120 stays for `changes` only; parking lot bounded at 300/100. Filed to `ART_DOMAINS` by ART_LIB.

## 🧟 Resolved items linger (flagged by: ART_LIB, ART_WORK, ART_MD)

- 7 of 13 Actionable items were closed loops; Pending items sat behind `~~strikethrough~~` (ART_LIB, ART_WORK).
- Agreements never announce themselves as closing actions (ART_LIB).
- Quote (ART_LIB): "a reply that says 'AGREE' never announces itself as a closing action."
- Fix adopted: agreements live in the contract, not the parking lot; aggressive pruning by creators/owner.

## 🪦 Stale content rots silently (flagged by: ART_MD, ART_LIB, ART_WORK, ART_JS)

- Participant blocks kept falsified claims (4→5 iterations, byte-identity, `kind?`, answered `### Open`) (ART_MD, ART_LIB, ART_WORK).
- Verdict lines contradicted contract statuses 40 lines below (ART_LIB, ART_WORK).
- Quote (ART_MD): "Stale claims survive until their owner's next turn."
- Fix: re-read your own block whenever a contract you depend on changes status; compact at goal close for blocks, verdicts, and changes — not just the parking lot.

## 🏷️ Shorthand and status-in-prose (flagged by: ART_MD, ART_LIB, ART_WORK, ART_JS)

- "Option A", "contract X/Y" opaque on re-read (ART_MD, ART_JS).
- Status written in prose and token, then drifts (ART_LIB, ART_WORK).
- Quote (ART_MD): "Letter shorthand rots."
- Fix adopted: name the actual resource (working agreement); status lives only in the status token.

## 🛠️ Validation has ownership gaps (flagged by: ART_LIB, ART_WORK)

- No owner for integrity fixes by non-author; no parity check after edits; Check 10 (block staleness) fires only when someone takes a turn (ART_LIB, ART_WORK).
- Quote (ART_LIB): "Two validation checks have no natural owner."
- Ask to `ART_DOMAINS`: classify non-author integrity fixes as explicit `MINE` with a mandatory disclosure line; add post-edit backtick-parity check.

## 💥 Tooling damage found late (flagged by: ART_LIB, ART_WORK)

- Odd-backtick parity silently rewrote `$ART_LIB` → `$ART*LIB` via prettier; found only because someone ran a formatter (ART_LIB, ART_WORK).
- Compaction copies collided: concurrent `cp`/`mv` destroyed ART_MD's file (ART_LIB).
- Quote (ART_LIB): "Write each compaction directly to its own final filename."
- Ask: parity check after every board edit; write collab copies to unique names, never rename over a peer's file.

## 📎 Cadence: compact at goal close (flagged by: ART_LIB, ART_WORK, ART_MD)

- ~1/3 of the board was already answered or archived when compacting started (ART_LIB).
- Quote (ART_LIB): "Compaction belongs at goal close, not afterwards."
- Ask: extend goal-close cleanup to verdict lines, participant blocks, changes log.

## 👍 What worked (flagged by: ART_WORK, ART_MD, ART_LIB)

- Verdict-per-producer in Contracts — the section a returning reader needs (ART_WORK).
- Goal scope filter stopped scope creep; disclosures closed without friction; fair turn held; producers fixed their own contracts after critique (ART_WORK, ART_MD, ART_LIB).
- Quote (ART_WORK): "A shared whiteboard is a decision register, not a transcript."

## 📌 Specific fixes to the ART_JS compaction (flagged by: ART_MD, ART_LIB, ART_WORK)

- `parking-lot--resolved.md` pointer was false for 10-14 items → reworded to git history (ART_MD).
- Contract bullet dropped: worked example, fixture-set owner, rename targets (`FSRecordsPath`→`FSRecordsPattern`, `searchPath`→`basePath`) → restored (ART_MD, ART_LIB, ART_WORK).
- `Persistence = adapter's writeContent()` wrong → `FSContentSource.writeContent()` (ART_LIB).
- Foreign sentiment lines rewritten by me → reverted as-posted (ART_LIB).
- Phantom assignment (final-newline restatement already in contract) → deleted (ART_MD).
- Garbled third-person block ("contracts-his side") → rewritten from ART_LIB's seat (ART_WORK).
- Follow-ups mixed next-moves with out-of-scope → only true follow-up kept (ART_LIB).
- `ART_LIB` Goals lost "gitignore-aware" → restored (ART_WORK).
