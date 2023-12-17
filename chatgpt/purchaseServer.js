

const LOG_LEVELS = { NONE: 0, ERROR: 1, MAIN: 2, INFO: 3, DELETE: 4, RAMTIER: 5, COPY: 6 };
let currentLogLevel = LOG_LEVELS.MAIN;
/** @param {NS} ns **/
export async function main(ns) {
	try {
		ns.disableLog("ALL");
		ns.print("Logging initialized...");
		const ramTierMax = 21;

		let highestRamServer = getHighestRamServer(ns);
		let serverRamOptions = Array.from({ length: ramTierMax }, (_, i) => Math.pow(2, i));

		let ramTier = ramTierMax-1;
		log(ns, LOG_LEVELS.MAIN, `Initial RAM tier: ${ramTier}`);

		// Decrease ramTier based on player's money but not below highest server's tier
		ramTier = adjustRamTierBasedOnPlayerMoney(ns, ramTier, highestRamServer, serverRamOptions);
		log(ns, LOG_LEVELS.MAIN, `after adjust RAM tier based on player money: ${ramTier}`);


		// Check if server with the given name already exists
		let serverCountSameTier = ns.getPurchasedServers().filter(server => server.split("-")[2] === String(ramTier)).length;
		let serverName = `Pserv-${serverCountSameTier}-${ramTier}`;

		if (!ns.serverExists(serverName)) {
			log(ns, LOG_LEVELS.MAIN, `Server ${serverName} does not exist, purchasing...`);
			
			if (ramTier >= 0 && ns.getPlayer().money >= ns.getPurchasedServerCost(serverRamOptions[ramTier])) {
				if (ns.purchaseServer(serverName, serverRamOptions[ramTier])) {
					log(ns, LOG_LEVELS.MAIN, `Purchased server ${serverName} with RAM: ${serverRamOptions[ramTier]}`);
					log(ns, LOG_LEVELS.MAIN, ns.getPurchasedServerCost(serverRamOptions[ramTier]));
				}
			} else {
				log(ns, LOG_LEVELS.MAIN, "Not enough money to purchase a server at the current RAM tier");
				log(ns, LOG_LEVELS.MAIN, ns.getPurchasedServerCost(serverRamOptions[ramTier]));
			}
		} else {
			log(ns, LOG_LEVELS.MAIN, `Server ${serverName} already exists, skipping purchase.`);
		}

		// Remove lower RAM servers if the server limit is reached
		removeLowestRamServers(ns, ramTier, serverRamOptions);



		// Copy scripts to all purchased servers
		copyScriptsToServers(ns);
	} catch (err) {
		log(ns, LOG_LEVELS.MAIN, `An error occurred: ${err}`);
	}
}

function log(ns, level, message,) {
	if (level == currentLogLevel) {
		ns.print(message);
	}
}

function getHighestRamServer(ns) {
	let highestRamServer = 0;
	for (let server of ns.getPurchasedServers()) {
		let serverRam = ns.getServerMaxRam(server);
		if (highestRamServer < serverRam) {
			highestRamServer = serverRam;
			log(ns, LOG_LEVELS.RAMTIER, `Highest RAM server updated: ${server} with RAM: ${serverRam}`);
		}
	}
	return highestRamServer;
}


function adjustRamTierBasedOnPlayerMoney(ns, ramTier, highestRamServer, serverRamOptions) {
	let highestRamTier = serverRamOptions.findIndex(ram => ram === highestRamServer);
	while (ramTier > highestRamTier && ns.getPurchasedServerCost(serverRamOptions[ramTier]) > ns.getPlayer().money) {
		ramTier--;
		log(ns, LOG_LEVELS.RAMTIER, `RAM tier decreased to: ${ramTier}`);
	}
	return ramTier;
}

function removeLowestRamServers(ns, ramTier, serverRamOptions) {
	while (ns.getPurchasedServers().length >= ns.getPurchasedServerLimit()) {
		let minRamServer = ns.getPurchasedServers().reduce((min, server) => ns.getServerMaxRam(server) < ns.getServerMaxRam(min) ? server : min);
		if (ns.getServerMaxRam(minRamServer) < serverRamOptions[ramTier]) {
			ns.killall(minRamServer);
			ns.deleteServer(minRamServer);
			log(ns, LOG_LEVELS.DELETE, `Deleted server ${minRamServer} to free up server limit`);
		} else {
			break;
		}
	}
}

function copyScriptsToServers(ns) {
	const scripts = ["HackScript.js", "GrowScript.js", "WeakenScript.js"];
	for (let server of ns.getPurchasedServers()) {
		for (let script of scripts) {
			if (!ns.fileExists(script, server)) {
				ns.scp(script, server, "home");
				log(ns, LOG_LEVELS.COPY, `Copied ${script} to server ${server}`);
			} else {
				log(ns, LOG_LEVELS.COPY, `Script ${script} already exists on server ${server}`);
			}
		}
	}
}