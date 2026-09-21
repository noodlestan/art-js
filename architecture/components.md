# Art JS Components

The Art JS implementation is a modular set of libraries and CLI tools with small responsibilities that add up to a pipeline for authoring, validating, and projecting Art MD programs. Components are grouped into core libraries (`libs/`), CLI packages (`cli/`), and planned packages derived from the records design in `_backlog/7-backlog`.

## Core Libraries (`libs/`)

### Bundler (`@art-js/bundler`)

**Status:** SCAFFOLD

Bundles Art modules for distribution.

### Program (`@art-js/program`)

**Status:** SCAFFOLD

Program execution engine for Art modules. Executes parsed Art modules and manages program state.

### Validator (`@art-js/validator`)

**Status:** SCAFFOLD

Validates parsed modules against structural and semantic rules.

## CLI Packages (`cli/`)

### Bin (`@art-js/bin`)

**Status:** SCAFFOLD

CLI for developing and building Art modules. Provides an entry point to bundler, program, validator, parser, and watcher.

### Dev Server (`@art-js/dev-server`)

**Status:** SCAFFOLD

Development server for Art modules. CLI that exposes all core pipeline commands.

### Language Server (`@art-js/language-server`)

**Status:** SCAFFOLD

Language server for Art modules. Provides IDE support for Art module development.

### Tools (`@art-js/tools`)

**Status:** SCAFFOLD

Agent tools for working with Art. Deterministic operations for agents to work with Art and context files.

### Watcher (`@art-js/watcher`)

**Status:** SCAFFOLD

File watcher for Art modules. Watches for changes in Art modules and triggers rebuilds.

## Planned Packages

The following packages are part of the Art JS ecosystem but are not yet implemented. Their responsibilities come from the records design in `_backlog/7-backlog/plan-design-lib-records`.

### Records (`@art-js/records`)

**Status:** PLANNED

Record modelling extracted from `SectionBlock` and `Field` constructs. Extraction and presence-assertion API, write-back with positioning anchors and an optional content-hash guard, and optional `ProxyObject`-based transparent field access.

Primary types: `ArtRecord`, `ArtRecordCapsule`, `Records`. Responsibility: record identity, locating, extraction, update and serialisation.

### Records (`@art-js/modules`)

**Status:** PLANNED
