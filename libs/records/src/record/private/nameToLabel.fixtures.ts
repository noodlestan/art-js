// The plan's rule table — every row must be asserted.
export const nameLabelCases: ReadonlyArray<readonly [string, string]> = [
	['userId', 'User Id'],
	['id', 'Id'],
	['aBA', 'A B A'],
	['aBC', 'A B C'],
	['repo2Branch', 'Repo2 Branch'],
	['canonicalName', 'Canonical Name'],
	['npmPackageDeployment', 'Npm Package Deployment'],
	['a333', 'A333'],
	['3A33', '3 A33'],
	['333A', '333 A'],
] as const;

// Direction B — names whose generated label must extract back to the same name.
export const directionBNameCases: ReadonlyArray<readonly [string]> = [
	['userId'],
	['aBA'],
	['id'],
	['aBC'],
	['repo2Branch'],
	['canonicalName'],
	['npmPackageDeployment'],
	['a333'],
] as const;
