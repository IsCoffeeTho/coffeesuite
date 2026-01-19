
import pkg from "./package.json";

const compileTargets = [
	"linux-x64",
	"linux-x64-baseline",
	"linux-x64-modern",
	"linux-arm64",
	"linux-arm64-modern"
];

for (let target of compileTargets) {
	console.log(`Building ${target}`);
	await Bun.build({
		entrypoints: ["./index.ts"],
		compile: {
			target: `bun-${target}`,
			outfile: `./dist/${pkg.version}/${pkg.name}-${target}`,
		},
	});
}
