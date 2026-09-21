# Module: Compiler

**Purpose:** Decisions about the pipeline that compiles art sources into projections — its model, implementation language, and guarantees.

## Decision: Reactive Pull Pipeline

**Status:** Adopted

**Context:** Pushing compiled output to every target on every source change recomputes work no consumer asked for and makes output availability depend on build scheduling. Consumers should receive exactly what they need, when they request it.

**Decision:** The pipeline is reactive and pull-based: output materialises when a consumer pulls a target through entry point → parse → extract → transform → render, and source changes propagate reactively to downstream consumers.

**Consequences:** The watcher and dev-server must react to source-change events rather than recompute full outputs, constraining their design.

## Decision: TypeScript Implementation

**Status:** Adopted

**Context:** The art-js toolchain needs an implementation language. "JS-first" was the working label, but the ecosystem constraint was never explicit, leaving package contracts underspecified.

**Decision:** TypeScript is the implementation language for all art-js packages and tooling.

## Decision: Entry Point Driven Compilation

**Status:** Adopted

**Context:** A compilation run needs a defined selection of what to compile; without one, output cannot be validated against expectations and builds are not reproducible from a single command.

**Decision:** Each compilation run is anchored by an entry point — declared, selected, and resolved per the entry point spec. Output is validated against that spec, not against a stored reference output.

**Consequences:** The entry point spec (PENDING in the WIP) is a prerequisite: the vertical slice cannot be validated until it is defined.

## Decision: Deterministic Compilation

**Status:** Adopted

**Context:** Projections are committed to git; if a build produced different output for the same inputs, committed projections would drift from sources and reviews would be meaningless.

**Decision:** Compilation is deterministic: identical source and config produce identical projections on every run.

## Decision: Reactive Framework: SolidJS Signals

**Status:** Proposal

**Context:** The pipeline is reactive and pull-based; the implementation needs a reactive primitive to propagate source-change events to downstream consumers without recomputing work no one asked for.

**Decision:** Use SolidJS signals as the reactive foundation for the art-js pipeline.

## Decision: Watcher Based on Chokidar

**Status:** Proposal

**Context:** The watcher must react to source-change events rather than recompute full outputs; file watching needs a battle-tested, cross-platform library.

**Decision:** Use chokidar for file watching in the watcher and dev-server packages.
