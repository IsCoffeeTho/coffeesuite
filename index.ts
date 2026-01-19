import batteryService from "./src/services/battery";
import oneshotService from "./src/services/oneshots";
import { readConfig } from "./src/config";
import hyprland from "./src/hypr/hyprland";

const pidFile = Bun.file(`${process.env["HOME"]}/.mydaemon/pid`);
if (await pidFile.exists()) {
	var runningPid = await pidFile.text();
	if (runningPid.match(/^[0-9]+$/g)) {
		var pidCheck = Bun.spawnSync(["ps", "-p", runningPid]);
		var lines = pidCheck.stdout.toString().split("\n");
		if (lines.length > 2) {
			console.log("mydaemon is already running; tailing logs");
			const decoder = new TextDecoder();
			var logFile = Bun.file(`/proc/${runningPid}/fd/1`);
			var logStream = logFile.stream();
			var logReader = logStream.getReader();
			while (true) {
				var chunk = await logReader.read();
				if (chunk.done) break;
				console.log(decoder.decode(chunk.value));
			}
			process.exit(0);
		}
	}
}
pidFile.write(`${process.pid}`);

readConfig("/etc/mydaemon/config.json");
readConfig(`${process.env["XDG_CONFIG_HOME"] ?? `${process.env["HOME"]}/.config`}/mydaemon/config.json`);

const hyprctl = new hyprland();

batteryService(hyprctl);
oneshotService(hyprctl);
