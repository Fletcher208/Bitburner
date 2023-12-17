/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("scp");
	ns.disableLog("getServerRequiredHackingLevel");
	ns.disableLog("getHackingLevel");
	ns.disableLog("scan");
	//ns.tail();
	let scanTargets = ["home"];
	let purchasedServers = ns.getPurchasedServers();
	let virusFiles = ["SQLInject.exe", "HTTPWorm.exe", "relaySMTP.exe", "FTPCrack.exe", "BruteSSH.exe"];
	let portOpeners = [ns.sqlinject, ns.httpworm, ns.relaysmtp, ns.ftpcrack, ns.brutessh];
	let hackBots = [];

	for (let i = 0; i < scanTargets.length; i++) {
		let currentServer = scanTargets[i];
		if (!purchasedServers.includes(currentServer)) {
			let newTargets = ns.scan(currentServer);
			for (let newTarget of newTargets) {
				if (!scanTargets.includes(newTarget) && !purchasedServers.includes(newTarget)) {
					scanTargets.push(newTarget);
				}
			}
		}
	}

	for (let target of scanTargets) {
		try {
			
			if (!ns.hasRootAccess(target) && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)) {
				let requiredPorts = ns.getServerNumPortsRequired(target)-1;
				for (let i = requiredPorts; i >= 0; i--) {
					ns.print(virusFiles[i], i);
					if (ns.fileExists(virusFiles[i], "home")) {
						portOpeners[i](target);
					}
					
				}
				ns.print(`target: ${target}, open port: ${ns.getServer(target).openPortCount}, req port opened: ${ns.getServer(target).numOpenPortsRequired}`);
				if (ns.getServer(target).openPortCount == ns.getServer(target).numOpenPortsRequired) {
					ns.nuke(target);
					
				}
			}
			else if(ns.hasRootAccess(target) && ns.getServer(target).maxRam > 0){
				hackBots.push(target);
			}
		}
		catch (err) {
			ns.print(`Error handling server ${target}: ${err}`);
		}
	}

	for (let target of scanTargets) {
		if (ns.getServer(target).maxRam !== 0 && ns.hasRootAccess(target) && !ns.fileExists("hackScript.js", target)) {
			ns.scp(["HackScript.js", "GrowScript.js", "WeakenScript.js"], target, "home");
		}
	}

	ns.clearPort(3);
	ns.print(await ns.tryWritePort(3, JSON.stringify(hackBots)));
	ns.print(hackBots);
	ns.clearPort(1);
	ns.print(await ns.tryWritePort(1, JSON.stringify(scanTargets)));
	ns.print(scanTargets);
}
