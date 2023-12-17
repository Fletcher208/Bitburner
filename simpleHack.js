import { ServerObject } from "ServerAvailability.js";
/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");

	let hackList = JSON.parse(ns.peek(2));

	hackList.sort((a, b) => b.serverHackValue - a.serverHackValue);
	let serverListIndex = hackTarget(hackList);
	const hackScript = "HackScript.js";
	const growScript = "GrowScript.js";
	const weakenScript = "WeakenScript.js";
	let target = hackList[serverListIndex];

	try {
		await hackLoop(weakenScript, target.serverWeakenAnalyzeHack, target.serverHost, 0);
		await hackLoop(growScript, target.serverGrowthAnalyze, target.serverHost, target.serverGrowTime + 100);
		await hackLoop(weakenScript, target.serverWeakenAnalyzeGrowth, target.serverHost, 200);
		await hackLoop(hackScript, target.serverHackAnalyze, target.serverHost, target.serverHackTime + 300);
	}
	catch (ex) {
		ns.print(ex);
	}
	async function hackLoop(script, threads, host, sleepTime) {
		let threadMult = 1.75;
		let subServerList = [];

		if (script == "HackScript.js") {
			threadMult = 1.70;
		}
		let ramCost = threads * threadMult;

		let server = new ServerObject(ns, ramCost);
		if (server.availableServer != 0) {
			for (let j = 0; j < server.serverList.length; j++) {
				let serverRamCost = Math.min(ramCost, server.serverList[j][1]);
				subServerList.push([server.serverList[j][0], Math.max(Math.floor((serverRamCost) / threadMult), 1)]);
				ramCost -= serverRamCost;
			}
			for (let i = 0; i < subServerList.length; i++) {
				let pid = Date.now() + Math.random();
				ns.exec(script, subServerList[i][0], subServerList[i][1], host, sleepTime, pid);
			}
		}
		else {
			while (ramCost >= threadMult) {
				for (let j = 0; j < server.serverList.length; j++) {
					ns.print(server.serverList.length);
					ns.print(server.serverList, " server List", "\n");

					ns.print(ramCost, " ram cost", "\n");

					let serverRamCost = Math.min(ramCost, server.serverList[j][1]);
					let pid = Date.now() + Math.random();

					if (ns.exec(script, server.serverList[j][0], Math.max(Math.floor((serverRamCost) / threadMult), 1), host, 0, pid) != 0) {

						ramCost -= serverRamCost;
					}
					if (ramCost <= threadMult) {
						break;
					}

				}
				server = new ServerObject(ns, ramCost);

				ns.print(Date.now());
				await ns.sleep(1000);
			}
		}
	}

	function hackTarget(hackList) {
		let index = -1;
		for (let i = 0; i < hackList.length; i++) {
			ns.print(hackList[i].serverRequiredHacking, " ", hackList[i].serverHost, " ", hackList[i].serverHackValue, "\n");
			if (hackList[i].serverAdminRights) {
				index = i;
				return index;
			}
		}

		return index;
	}

}