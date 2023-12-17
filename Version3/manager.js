/** @param {NS} ns */
export async function main(ns) {

	while (true) {
		ns.run("MapServers.js");
		await ns.sleep(50);
		ns.run("BestHackTargets.js");

		if (ns.scriptRunning("HackSlow.js", ns.getHostname()) == false) {
			await ns.sleep(100);
			if (ns.peek(5) <= 15 || ns.peek(5) == "NULL PORT DATA") {
				ns.run("PurchaseServer.js");
			}
			await ns.sleep(100);

			ns.run("batchScript.js");

		}

		await ns.sleep(1000);
	}
}