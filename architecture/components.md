# Art JS Components

## Overview

The Art JS ecosystem is a collection of libraries and CLI tools that parse, validate, transform, and execute Art-MD — a markdown-based language for structuring content, modules, and programs. The components are organised into two layers: core libraries (`libs/`) that provide the foundational parsing and execution pipeline, and CLI tools (`cli/`) that expose the pipeline to users and developers.

## Core Libraries

### Primitives (`@art-js/primitives`)

The foundation of the entire ecosystem. Primitives define the foundational types and utilities that every other library depends on — record types, construct interfaces, and shared helpers. This package has no internal dependencies; all other libs consume it. Think of it as the vocabulary of the language: if primitives change, everything above may need to adapt.

### Constructs (`@art-js/constructs`)

Constructs provide the factory functions that create parser records from markdown nodes. Each construct (SectionBlock, FieldBlock, Tag, NaturalBlock, etc.) has a factory responsible for detecting whether an mdast node matches the construct's pattern and building the appropriate record. Constructs depend on primitives for type definitions and on `mdast-util-from-markdown` for node parsing. They are the bridge between raw markdown syntax and the structured record model.

### Parser (`@art-js/parser`)

The parser consumes markdown source and produces a structured AST in the form of art records (art.json). It orchestrates the layered architecture described in [art-md-roundtrip.md](art-md-roundtrip.md): pre-processors intercept and transform nodes before factory detection, factories create records from matched nodes, and handlers post-process records (for example, routing tags to their nearest section). The parser depends on primitives, constructs, `mdast-util-from-markdown`, and `unist-util-visit`. It is the entry point for the forward pipeline: markdown → AST.

### Serializer (`@art-js/serializer`)

The serializer performs the inverse operation: it takes an AST of art records and renders them back into markdown. Each construct type has a `toMdast` adapter that converts the record into mdast nodes, which are then serialized to markdown text via `mdast-util-to-markdown`. Together with the parser, the serializer completes the roundtrip pipeline. The serializer depends on primitives, constructs, and `mdast-util-to-markdown`.

### Validator (`@art-js/validator`)

The validator checks parsed modules against structural and semantic rules. After the parser produces an AST, the validator ensures the module conforms to the language specification — required fields, valid construct nesting, naming conventions, and other constraints. It depends on primitives and constructs for type definitions and record shapes. The validator sits between parsing and execution: a module must pass validation before it can be run or bundled.

### Program (`@art-js/program`)

The program layer executes parsed and validated Art modules. It manages program state, resolves references between modules, and drives the execution model. Where the parser and serializer are concerned with syntax and representation, the program is concerned with semantics and behaviour. It depends on primitives and the validated record model.

### Bundler (`@art-js/bundler`)

The bundler packages Art modules for distribution. It resolves module dependencies, applies bundling rules, and produces distributable artifacts. The bundler consumes the output of the parser and validator, then packages them into a format suitable for deployment or consumption by other tools. It depends on primitives and the parser's record model.

## CLI Surface

### Bin (`@art-js/bin`)

The primary CLI entry point. Bin exposes all core pipeline commands to the command line — parse, serialize, validate, bundle, and run. It is the user-facing interface that wires together the core libraries into a coherent toolchain.

### Pipeline Tests (`@art-js/pipeline-tests`)

Test scripts that exercise the parser and serializer against a shared fixture suite. The `test-parser` script runs the forward pipeline (source.md → art.json) and compares results against committed snapshots. The `test-serializer` script runs the return pipeline (art.json → parsed.md) and diffs against the original source. See [art-md-fixture-tests.md](art-md-fixture-tests.md) for details on fixture anatomy and usage.

### Dev Server (`@art-js/dev-server`)

A local development server for testing Art modules interactively. It provides a live-reload environment where developers can see the results of parsing and rendering as they edit source files.

### Watcher (`@art-js/watcher`)

File system watcher that monitors Art modules for changes and triggers rebuilds automatically. It powers the dev experience by keeping the pipeline output in sync with source edits without manual invocation.

### Language Server (`@art-js/language-server`)

An LSP server for Art and context files (work in progress). When complete, it will provide IDE features — go-to-definition, diagnostics, completions — for authors working with Art-MD content.

### Tools (`@art-js/tools`)

A collection of deterministic operations for agents working with Art and context files. These are utility commands that support the broader toolchain, such as scaffolding, transformation helpers, and other agent-oriented operations.

## Spec (`@art-js/spec`)

The official Art language specification, written in Art itself. It is a content package consumed by the parser, validator, and bundler to ensure they adhere to the language definition. The spec is both documentation and test data — a bootstrap that demonstrates the language can describe its own rules.

## Relationships

```
primitives ← constructs ← parser → serializer
                 ↑           ↓
              validator ← program
                 ↓
              bundler

bin ──┐
dev-server ──┤
watcher ─────┤──→ core libraries
pipeline-tests ──┤
language-server ─┤
tools ───────────┘

spec → parser, validator, bundler
```

The dependency flows downward: primitives at the base, constructs built on primitives, parser and serializer built on constructs, and validator/program/bundler built on the parsing layer. The CLI tools consume the libraries they need — bin and pipeline-tests depend on the full pipeline, while dev-server and watcher primarily orchestrate file I/O and rebuild triggers.
