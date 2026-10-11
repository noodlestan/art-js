# Research: Language Server

**Purpose:** Research the architecture, implementation patterns, dependencies, and reference projects relevant to building an Art language server that integrates with the existing Art ecosystem and runs in both Node.js and browser environments.

**Description:** The research focuses on JavaScript/TypeScript implementations of Language Server Protocol tooling, with Marko, Svelte, Astro, MDX, and TypeScript as primary references. Terraform is included as a non-JavaScript reference because its project modelling, schema discovery, and incremental analysis patterns are relevant to Art.

## Summary

An Art language server should not be the primary implementation of Art language intelligence. The language server should be an LSP adapter over a reusable language/project service.

The underlying service should consume the existing Art parser, extractor, validator, projector, and related libraries rather than reproducing their functionality.

The project service should maintain a persistent model of the current project, including source documents, parsed representations, extracted declarations, symbols, validation state, projections, dependencies, and caches. Changes should invalidate and recompute only the affected portions where practical.

The same language/project service should be usable from Node.js and the browser. Node-specific concerns such as filesystem access, process execution, package resolution, and temporary directories should be supplied by a runtime layer rather than embedded in the language implementation.

The Node implementation can expose the service through LSP over stdio for VS Code and other editors. A browser implementation can expose the same service directly to a web editor, potentially running inside a Web Worker. A browser-facing LSP transport is also possible but should not be required by the underlying service.

Marko is particularly interesting because its source appears to separate environment-independent service composition from Node/browser-specific plugins. Its `createService(plugins)` pattern allows the Node entry point to supply plugins that depend on Node facilities while the browser entry point omits incompatible functionality such as the `jsdom`-backed HTML plugin.

Svelte, Astro, and TypeScript provide stronger reference points for the relationship between language services, project state, transformations/projections, and existing TypeScript tooling.

MDX is useful because its language combines a document format with embedded programming-language semantics and transformation.

Terraform is useful as a project/indexing reference, particularly for lazy analysis, schema acquisition, module discovery, and maintaining semantic state beyond the currently open document.

## Proposed architecture

The central abstraction should be a persistent **Art project service** rather than an LSP server.

The project service should coordinate the existing Art ecosystem:

- Parser → constructs the current source representation.
- Extractor → derives declarations and other semantic information.
- Validator → reports structural and semantic problems.
- Projector → produces the in-memory and generated representations required to understand or operate on the project.
- Symbol/index services → provide declarations, references, relationships, and resolution.
- Project/cache services → maintain incremental state and avoid repeating expensive work.

The **language service** should sit above that project model and expose editor-oriented operations such as diagnostics, hover, definition, references, completion, document symbols, workspace symbols, rename, code actions, and semantic tokens.

The **LSP server** should be a thin protocol adapter over the language service. It should translate LSP requests and responses, manage document synchronisation, cancellation, capabilities, progress, and source-position conversion, but should not contain Art-specific language semantics.

The resulting separation is:

- Art project service → owns project state and coordinates the Art toolchain.
- Art language service → exposes semantic/editor operations against that project state.
- Node runtime → provides filesystem, process, package resolution, temporary storage, and other Node facilities.
- Browser runtime → provides virtual filesystem/project input, browser-compatible storage, and optionally Web Worker execution.
- LSP adapter → exposes the language service to VS Code and other LSP clients.

This also means that a browser application can use the language service without going through LSP at all.

## Conclusions

### Architecture

The language server should not become the owner of Art's semantic model.

The projector should likewise not be implemented specifically for language tooling. It should remain a first-class part of the Art project/build ecosystem. Language tooling should consume the same project semantics that ordinary projection/build operations consume.

The project service should maintain state across requests rather than repeatedly parsing, extracting, validating, resolving, and projecting the entire project for each LSP request.

The project model should therefore include:

- Source documents.
- Parsed representations.
- Extracted declarations.
- Symbol/index state.
- Validation state.
- Project dependencies.
- Projection state.
- Generated artefacts where required.
- Incremental caches.
- Configuration derived from the local project.

The browser requirement should be reflected in the dependency graph from the beginning. Shared language functionality should not depend directly on Node-only APIs.

Node and browser implementations should provide different runtime facilities to the same language/project implementation.

### Deliverables

**Project service**

- Project configuration discovery.
- Project lifecycle.
- Source/document registry.
- Dependency graph.
- Incremental updates and invalidation.
- Coordination of parser, extractor, validator, and projector.
- Symbol/index state.
- Persistent or temporary caches.
- Runtime abstraction for filesystem and other environment-specific facilities.

**Document service**

- Open-document text and version state.
- Parsing.
- Source positions.
- Source-to-construct mapping.
- Syntax diagnostics.
- Incremental document updates.

**Language service**

- Diagnostics.
- Hover.
- Go-to-definition.
- Find references.
- Document symbols.
- Workspace symbols.
- Completion.
- Rename.
- Code actions.
- Semantic tokens.
- Eventually other LSP capabilities as required.

**Projector integration**

The projector should be capable of operating against the current project state and producing the representations required for semantic analysis.

The language service may need to:

- Project the current project state.
- Inspect generated representations.
- Resolve information from those representations.
- Map results back to Art source locations.

The same projection mechanism should remain usable by ordinary Art builds and projection scripts.

Where generated artefacts or caches are required, the project service should be able to produce them in memory where possible and in a hidden temporary/cache location where necessary.

**LSP adapter**

- LSP lifecycle and initialisation.
- Server capability declaration.
- Workspace folders.
- Document synchronisation.
- Request cancellation.
- Progress reporting.
- Diagnostics publication.
- Position/range conversion.
- LSP-specific error handling.
- Mapping between LSP requests and language-service operations.
- Stdio transport for the Node implementation.

**Node runtime**

- Filesystem access.
- Project discovery.
- Package/module resolution.
- Process execution where required.
- Temporary/cache directory management.
- Stdio transport.

**Browser runtime**

- Virtual filesystem/project representation.
- Browser-compatible cache/storage.
- Web Worker execution where useful.
- Browser-safe versions of all shared dependencies.
- Optional LSP transport over browser messaging.

### MVP

The first MVP should establish the complete architectural path while implementing only one editor feature: **diagnostics for the currently open document**.

The basic flow is:

- Open Art document.
- Add/update the document in the project service.
- Parse it using the existing Art parser.
- Run the existing extractor.
- Run the existing validator.
- Convert validation results into language-service diagnostics.
- Convert those diagnostics into LSP diagnostics.
- Publish them to the editor.
- Repeat the relevant work after document edits.

This deliberately avoids starting with completion or symbol resolution. Diagnostics exercise the important boundaries between document state, parser, project state, validator, source positions, incremental updates, language service, and LSP without requiring the complete symbol system.

The second feature should be **go-to-definition**. It provides a useful architectural test of whether the extractor, project model, and symbol-resolution mechanisms are sufficiently reusable for editor tooling.

### Notes

**Marko**

Marko's service/plugin composition is particularly relevant to the browser requirement.

The important architectural property is that the language functionality is not necessarily synonymous with the Node LSP process. The service can be composed with different plugins depending on its runtime.

The `createService(plugins: Partial<Plugin>[]): Plugin` implementation is significant because the Node entry point can provide all plugins while the browser entry point can omit a plugin whose implementation depends on `jsdom`.

This suggests that Art should similarly distinguish:

- Language functionality.
- Project functionality.
- Runtime facilities.
- Protocol transport.

The browser requirement should therefore influence package boundaries from the beginning rather than being added after a Node-only implementation exists.

**TypeScript**

TypeScript provides perhaps the clearest precedent for treating the language service as a persistent compiler/project system rather than a collection of LSP handlers.

The relevant conceptual separation is compiler → language service → server/protocol.

The TypeScript language service operates against a persistent project context and supports editor operations over changing files. `tsserver` provides the server-side process and project management around that service.

The important lesson for Art is that the LSP server should not itself become the project model.

**Svelte and Astro**

Svelte and Astro are particularly relevant because their language tooling combines a source language with other language tooling, especially TypeScript.

Their projection approach demonstrates an important pattern:

- Source document → projected representation.
- Projected representation → existing language service.
- Results → mapped back to source locations.

This is closely related to the proposed Art projector. It provides a precedent for using a transformation/projection layer to reuse an existing semantic engine rather than implementing a second one.

**MDX**

MDX is a useful conceptual analogue for Art because it combines a document-oriented language with embedded JavaScript/JSX semantics and transformation.

Its separation of language service, language server, TypeScript integration, and editor integration is useful when considering how Art's own language tooling should be decomposed.

**Terraform**

Terraform's language server is implemented in Go and therefore is not an implementation dependency for Art.

Its architecture is nevertheless useful for studying project-wide semantic state, schema acquisition, module discovery, lazy analysis, and incremental workspace indexing.

The relevant pattern is that the server does not treat the currently open file as an isolated unit. It progressively constructs knowledge about the project and its dependencies as that information becomes necessary.

## Reference

### Documentation

**Language Server Protocol specification**

[Language Server Protocol 3.17 specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)

Read particularly:

- `initialize`
- Document synchronisation
- Diagnostics
- Completion
- Hover
- Definition
- References
- Symbols
- Workspace folders
- Cancellation
- Progress
- File operations

The key distinction is that LSP is the protocol contract, not the architecture of the underlying language implementation.

**Microsoft LSP implementation**

[vscode-languageserver-node](https://github.com/microsoft/vscode-languageserver-node)

Useful for the separation between common, Node, and browser implementations.

[VS Code Web Extensions – Language Server Protocol](https://github.com/microsoft/vscode-docs/blob/main/api/extension-guides/web-extensions.md)

Relevant to browser execution, Web Workers, and the relationship between a browser language server/client and VS Code's web extension environment.

**TypeScript architecture**

[TypeScript Architectural Overview](https://github.com/microsoft/TypeScript/wiki/Architectural-Overview)

Read the Language Service material particularly closely.

[TypeScript Standalone Server / tsserver](https://github.com/microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29)

Relevant to configured, external, and inferred projects and to the persistent project model around the language service.

### Projects

**Marko**

[Marko Language Server](https://github.com/marko-js/language-server)

Particularly investigate the service/plugin composition around `createService`, the `Plugin` abstraction, Node/browser entry points, and embedded-language support.

The browser-specific plugin composition is the most relevant part for the Art architecture.

**Svelte**

[Svelte Language Tools](https://github.com/sveltejs/language-tools)

[Language server entry point](https://github.com/sveltejs/language-tools/blob/master/packages/language-server/src/server.ts)

[Language-server plugins](https://github.com/sveltejs/language-tools/tree/master/packages/language-server/src/plugins)

[Svelte2TSX](https://github.com/sveltejs/language-tools/tree/master/packages/svelte2tsx)

The Svelte2TSX project is particularly relevant to the projector concept because it demonstrates source-language projection into a representation consumable by TypeScript tooling, followed by source mapping.

**Astro / Volar**

[Astro language-server checker](https://github.com/withastro/astro/blob/main/packages/language-tools/language-server/src/check.ts)

This is useful for examining language-plugin and language-service composition around an existing TypeScript-oriented semantic engine.

**MDX**

[MDX Analyzer](https://github.com/mdx-js/mdx-analyzer)

[MDX language-service package](https://github.com/mdx-js/mdx-analyzer/tree/main/packages/language-service)

[MDX language-server package](https://github.com/mdx-js/mdx-analyzer/tree/main/packages/language-server)

The package separation is more significant than the individual LSP handlers.

**TypeScript language-server**

[typescript-language-server](https://github.com/typescript-language-server/typescript-language-server)

Useful primarily for studying the adapter boundary between LSP and the TypeScript language service/`tsserver`.

**Terraform**

[Terraform Language Server](https://github.com/hashicorp/terraform-ls)

[Schema architecture](https://github.com/hashicorp/terraform-ls/blob/main/docs/schema.md)

Useful for schema acquisition and assembling semantic information from multiple sources.

[Terraform Language Server changelog](https://github.com/hashicorp/terraform-ls/blob/main/CHANGELOG.md)

The 0.34.0 architecture changes are particularly relevant to lazy module analysis and scheduled project work.

[Terraform Language Server usage](https://github.com/hashicorp/terraform-ls/blob/main/docs/USAGE.md)

Useful for the distinction between isolated-file operation and workspace/project-level analysis.
