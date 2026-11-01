// The plan's rule table — every row must be asserted.
export const labelNameCases: ReadonlyArray<readonly [string, string]> = [
	['Purpose', 'purpose'],
	['Canonical Name', 'canonicalName'],
	['Canonical-Name', 'canonicalName'],
	['user_id', 'userId'],
	['a[b]c', 'aBC'],
	['f(x)', 'fX'],
	['IDField', 'idfield'],
	['NPM Package', 'npmPackage'],
	['aB-a', 'aBA'],
	['aBC', 'aBc'],
	['3A33', '3A33'],
	['333A', '333A'],
	['A333', 'a333'],
	['0-1-0', '010'],
	['2Branch', '2Branch'],
	['Repo 2 Branch', 'repo2Branch'],
	['Ação', 'ação'],
] as const;

// Rule 1 — word characters: letters, combining marks, and digits; code points, not UTF-16 units.
export const labelWordCharacterCases: ReadonlyArray<readonly [string, string]> = [
	['café', 'café'],
	['cafe\u0301', 'cafe\u0301'],
	['naïve', 'naïve'],
	['Ünder', 'ünder'],
	['Дом', 'дом'],
	['2024', '2024'],
	['0abc', '0abc'],
	['abc12', 'abc12'],
	['a1B2', 'a1B2'],
	['a\u{1D4B6}', 'a\u{1D4B6}'],
] as const;

// Rule 2 — anything outside the word class ends the current word, uniformly.
export const labelSeparatorCases: ReadonlyArray<readonly [string, string]> = [
	['hello world', 'helloWorld'],
	['a,b;c', 'aBC'],
	['a.b-c_d', 'aBCD'],
	['---user', 'user'],
	['user---', 'user'],
	['1-2', '12'],
	['$100 usd', '100Usd'],
	['name🚀 value', 'nameValue'],
] as const;

// Rule 3 — an uppercase letter starts a word only when the previous character is not uppercase.
export const labelUppercaseBoundaryCases: ReadonlyArray<readonly [string, string]> = [
	['aB', 'aB'],
	['1A', '1A'],
	['AB', 'ab'],
	['A', 'a'],
	['userID', 'userId'],
	['USER ID', 'userId'],
	['aBCd', 'aBcd'],
	['aBCDE', 'aBcde'],
	['aBCDEFG', 'aBcdefg'],
] as const;

// Rule 4 — first word lowercased, later words capitalized, joined without a separator.
export const labelCasingJoiningCases: ReadonlyArray<readonly [string, string]> = [
	['USER', 'user'],
	['Hello World', 'helloWorld'],
	['hello WORLD', 'helloWorld'],
	['x y z', 'xYZ'],
	['a b', 'aB'],
	['Ünicode Wörd', 'ünicodeWörd'],
] as const;

// Rule 5 — no words produced: empty, whitespace-only, or separator-only labels throw.
export const labelNoWordCases: ReadonlyArray<readonly [string]> = [
	[''],
	['   '],
	['\t\n'],
	['  \t '],
	['---'],
	['()[]'],
	['...'],
	['🚀'],
] as const;
