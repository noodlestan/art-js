export const canonicalNameCases: ReadonlyArray<readonly [string, boolean]> = [
	// accept — camel case, short names, and digit runs
	['userId', true],
	['aBA', true],
	['id', true],
	['repo2Branch', true],
	['a333', true],
	['a', true],
	['aB', true],
	['z9', true],
	['abc', true],
	['user1', true],
	// accept — reserved handle names are syntactically valid
	['name', true],
	['save', true],
	['renameField', true],
	// reject — leading digit
	['3A33', false],
	['333A', false],
	['010', false],
	['1', false],
	// reject — leading uppercase
	['UserId', false],
	['A', false],
	['Zoo', false],
	// reject — separators and whitespace
	['Canonical Name', false],
	['user_id', false],
	['user-name', false],
	['user.name', false],
	['user$name', false],
	['__x', false],
	['__section', false],
	['_x', false],
	[' user', false],
	['user ', false],
	// reject — non-ASCII letters
	['ação', false],
	['café', false],
	['naïve', false],
	// reject — empty string
	['', false],
] as const;
