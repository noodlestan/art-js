# Art JS Components

The Art JS ecosystem is a modular pipeline for parsing and serialising a markdown dialect (Art-MD). Components are organised into core libraries (`libs/`) and CLI tools (`cli/`).

## Core Libraries

### Primitives (`@art-js/primitives`)

Low-level shared types (`MdastNode`, `VisitContext`, `Point`) and utilities. No internal dependencies — all other libs consume it.

### Constructs (`@art-js/constructs`)

The contract layer of the ecosystem. Defines the factory interfaces that parser and serializer depend on, the data shapes that flow through the pipeline, and an open registry for concrete constructs. Ships both the contract types and the concrete implementations.

- Contract types: `ConstructParser`, `ConstructToMdast`, `ConstructParserFactory`, `ConstructToMdastFactory`
- Data shapes: `ArtDocument`, `Construct`, `BlockContent`, `InlineContent`
- Open registry: `BlockConstructMap`, `InlineConstructMap` (augmented via declaration merging)
- Concrete constructs: `FieldBlock`, `FieldInline`, `SectionBlock`, `Tag`, `NaturalBlock`, `NaturalExpression`

**Read more:** [Constructs Architecture](../libs/constructs/architecture/index.md)

### Parser (`@art-js/parser`)

Transforms markdown into an `ArtDocument` via a generic dispatch loop. Construct-agnostic — knows only the contract types, never names a concrete construct. The [ecosystem overview](overview.md#the-parse-direction) describes how pre-processors, factories, and the default construct interact.

- Entry point: `buildDocument(config, markdown)`
- Config: `ParserConfig` with `defaultConstruct` and `constructs` list
- Dispatch: pre-processors → factories → `NaturalBlock` fallback
- Context: `VisitContext` stack for nested constructs

**Read more:** [Parser Architecture](../libs/parser/architecture/index.md)

### Serializer (`@art-js/serializer`)

Transforms an `ArtDocument` back into markdown. Builds a registry from config factories, visits the construct tree bottom-up, and dispatches to `toMdast` adapters. Construct-agnostic — the [ecosystem overview](overview.md#the-serialise-direction) explains the composition decision.

- Entry point: `artAstToMdast(config, document)`
- Config: `SerializerConfig` with `constructs` list
- Registry: `Map<string, ConstructToMdast>` keyed by construct name
- Sibling placement: block constructs (`SectionBlock`, `FieldBlock`) emit children as siblings

**Read more:** [Serializer Architecture](../libs/serializer/architecture/index.md)

### Validator (`@art-js/validator`)

Checks parsed modules against structural and semantic rules — required fields, valid construct nesting, naming conventions. Sits between parsing and execution.

### Program (`@art-js/program`)

Executes parsed and validated Art modules. Manages program state, resolves cross-module references, drives the execution model.

### Bundler (`@art-js/bundler`)

Resolves module dependencies, applies bundling rules, produces distributable artifacts. Consumes parser and validator output.

## CLI Surface

### Bin (`@art-js/bin`)

Primary CLI entry point. Exposes parse, serialize, validate, bundle, and run commands.

### Pipeline Tests (`@art-js/pipeline-tests`)

Fixture-based test suite for the parser and serializer roundtrip. See [art-md-fixture-tests.md](art-md-fixture-tests.md) for fixture anatomy.

### Dev Server (`@art-js/dev-server`)

Local development server with live-reload for interactive Art module testing. (Scaffolded.)

### Watcher (`@art-js/watcher`)

File system watcher that triggers rebuilds on source changes. Powers the dev experience. (Scaffolded.)

### Language Server (`@art-js/language-server`)

LSP server for Art and context files (work in progress). Will provide go-to-definition, diagnostics, completions. (Scaffolded.)

### Tools (`@art-js/tools`)

Deterministic utility operations for agents working with Art and context files. (Scaffolded.)

## Spec (`@art-js/spec`)

The Art language specification, written in Art itself. Consumed by parser, validator, and bundler. Both documentation and test data.
