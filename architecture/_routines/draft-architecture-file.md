# Module

## Routine: Create Architecture Document

**Purpose:** Define the purpose, audience, use cases, content rules, and outline for an architecture document before writing it.

**Description:** Produces a briefing that captures what the document should achieve, who it is for, what to include and exclude, how to describe concepts (summary vs detail, example vs enumeration), whether to quote code, and a draft outline. This briefing is then used by the API or Implementation routine to guide content creation.

**Inputs:**

- `briefing` — Input from user or instructions defining the file to create.
- `location` — Location of the file to create.

**Outputs:** TBD

**Procedure:**

1. From `briefing`, identify the **audience** — who will read this document and what they need from it.
   - Example: "Developers planning new parser capabilities" vs "Developers debugging roundtrip mismatches".
2. From `briefing`, identify the **use cases** — concrete scenarios the document supports.
   - Example: "Understand the contract to plan new constructs" vs "Understand mechanics to draft a new implementation".
3. From `briefing`, define the **approach** — the angle to take when describing concepts (summary vs detail, example vs enumeration, prose vs tables).
   - Example: "Mechanics-first, example-driven" vs "Contract-first, link don't copy".
4. From `briefing`, define **what to include** — the content categories this document covers.
   - Example: "Public interfaces, config shapes, entry point signatures" vs "Step-by-step algorithms, hook patterns, error handling".
5. From `briefing`, define **what NOT to include** — content that belongs in a sibling document or is out of scope.
   - Example: "Do not include internal mechanics (that belongs in implementation.md)" vs "Do not include config shapes (that belongs in api.md)".
6. From `briefing`, define the **draft outline** — the section structure the document should follow.
7. From `briefing`, define **code quoting rules** — whether to quote source code, and if so, which parts (signatures, core loops, private modules).
8. From `briefing`, define **example rules** — whether to use examples, how detailed they should be, and what purpose they serve.
   - Example: "Super short examples — detailed patterns live in constructs/architecture/implementation.md" vs "Extensive examples — each distinct pattern needs a concrete illustration".
9. Return the briefing as a structured document definition.

---

## Routine: Create API Document

**Purpose:** Create an `architecture/api.md` file describing the external surface of a package or module.

**Description:** Writes an API document that covers config shapes, public interfaces, entry point signatures, and contract references to dependent packages. Does not describe internal mechanics.

**Inputs:**

- `briefing` — Input from user or instructions defining the file to create.
- `location` — Location of the file to create.

**Outputs:** TBD

**Procedure:**

1. Execute the **Routine: Create Architecture Document** with `briefing` and `location` to define the purpose, description, outline, and content rules.
2. Write the H1 title — `{Package/Module} API` — followed by a one-sentence purpose statement.
   - If the package is construct-agnostic, state that explicitly and link to the contract package's `api.md`.
3. Write the **config section(s)** — show each config interface, explain each field's purpose, and describe how it affects behaviour.
   - Do not copy type definitions from dependent packages — show the shape and link to their `api.md`.
4. Write the **entry point section(s)** — show each public function signature, describe what it takes and returns, and summarise the dispatch strategy at a high level.
   - Do not describe step-by-step mechanics — that belongs in `implementation.md`.
5. Write the **contract reference section** — list the types this package depends on from other packages, describe their role, and link to the relevant `api.md` sections.
6. Review against the briefing's "what NOT to include" rules. Remove any internal mechanics, private module code, or concrete construct examples.
7. Write the file to `location`.

---

## Routine: Create Implementation Document

**Purpose:** Create an `architecture/implementation.md` file describing how a package or module internals are implemented in relation to its use cases and API surface.

**Description:** Writes an implementation document that covers step-by-step algorithms, context management, messaging patterns, error handling, and concrete examples from existing implementations. Does not describe config shapes or public interfaces.

**Inputs:**

- `briefing` — Input from user or instructions defining the file to create.
- `location` — Location of the file to create.

**Outputs:** TBD

**Procedure:**

1. Execute the **Routine: Create Architecture Document** with `briefing` and `location` to define the purpose, description, outline, and content rules.
2. Write the H1 title — `{Package/Module} Implementation` — followed by a one-sentence purpose statement.
   - If this is a contract package (e.g. constructs), open with a note instructing future authors to add new examples when a novel pattern emerges.
3. Write the **entry point section** — describe what the entry point does, step by step.
   - Quote the core algorithm from source code.
4. Write the **core mechanism section(s)** — describe the dispatch loop, context stack, registry build, or other central mechanic.
   - Quote the relevant source code. Explain how each part works.
5. Write the **hook pattern section(s)** — describe how each contract hook is exercised, with examples from existing constructs.
   - Keep examples short if detailed patterns live in another file (e.g. `constructs/architecture/implementation.md`). Reference that file for full details.
   - Each distinct pattern should have at least one concrete example.
6. Write the **edge case section(s)** — describe fallback paths, error handling, and boundary conditions.
7. Review against the briefing's "what NOT to include" rules. Remove any config shapes, public interface descriptions, or ecosystem overview content.
8. Write the file to `location`.
