import { ServerObject } from "chatgpt/ServerAvailability.js";
/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("exec");
	//ns.tail();
	let hackList = JSON.parse(ns.peek(2));

	hackList.sort((a, b) => b.serverHackValue - a.serverHackValue);

	let targetServerIndex = getHackTargetIndex(hackList);
	const hackScript = "HackScript.js";
	const growScript = "GrowScript.js";
	const weakenScript = "WeakenScript.js";
	let target = hackList[targetServerIndex];


	try {
		await executeHackStrategy(target, weakenScript, growScript, hackScript);
	}
	catch (ex) {
		//ns.tail();
		ns.print(ex, " error");
	}

	async function executeHackStrategy(target, weakenScript, growScript, hackScript) {
		await hackLoop(weakenScript, target.serverWeakenAnalyzeHack, target.serverHost, 0);
		await hackLoop(growScript, target.serverGrowthAnalyze, target.serverHost, target.serverGrowTime + 100);
		await hackLoop(weakenScript, target.serverWeakenAnalyzeGrowth, target.serverHost, 200);
		await hackLoop(hackScript, target.serverHackAnalyze, target.serverHost, target.serverHackTime + 300);
	}

	async function hackLoop(script, threads, host, sleepTime) {
		let threadMultiplier = script == "HackScript.js" ? 1.70 : 1.75;
		let ramCost = threads * threadMultiplier;
		let subServerList = [];

		ns.print(`Preparing to run ${script} on host ${host} with ${threads} threads`);
		ns.print(`Expected RAM cost is ${ramCost}`);

		// Initialize server object and fetch total max RAM.
		let server = new ServerObject(ns, ramCost);
		let totalMaxRam = server.serverList.reduce((total, serverInfo) => total + serverInfo[1], 0); // assuming serverList structure is [serverName, maxRam]
		ns.print(`Total Max RAM: ${totalMaxRam}`);

		if (totalMaxRam >= ramCost) {
			ns.print(`Found enough potential Max RAM to run the full loop`);
			while (server.availableServer == 0) {
				ns.print(`Waiting for available servers...`);
				await ns.sleep(30000); // Wait for 30 seconds before checking again.
				server = new ServerObject(ns, ramCost);
			}
			ns.print(server);
			ns.print(`Allocating servers for script execution...`);
			allocateServers(ramCost, server, subServerList, threadMultiplier);
			ns.print(`Executing scripts on allocated servers... ${subServerList}`);
			await executeScripts(script, host, sleepTime, subServerList);
			ns.print(`Script execution completed`);
		}
		else {
			ns.print(`Max RAM from all servers is insufficient, handling insufficient RAM...`);
			await handleInsufficientRam(script, host, ramCost, server, threadMultiplier);
			ns.print(`Handled insufficient RAM scenario`);
		}
	}

	function allocateServers(ramCost, server, subServerList, threadMultiplier) {
		for (let j = 0; j < server.serverList.length; j++) {
			let serverRamCost = Math.min(ramCost, server.serverList[j][1]);
			subServerList.push([server.serverList[j][0], Math.max(Math.floor((serverRamCost) / threadMultiplier), 1)]);
			ramCost -= serverRamCost;
			if(ramCost <= 1){
				break;
			}
		}
	}

	function executeScripts(script, host, sleepTime, subServerList) {
		for (let i = 0; i < subServerList.length; i++) {
			let pid = Date.now() + Math.random();
			if (ns.exec(script, subServerList[i][0], subServerList[i][1], host, sleepTime, pid)) {
				ns.print("exec full server success");
			}
			else {
				ns.print(`Failed to execute ${script} on server ${subServerList[i][0]}, ramCost: ${subServerList[i][1]}`);
			}

		}
	}

	async function handleInsufficientRam(script, host, ramCost, server, threadMultiplier) {
		ns.print(`Handling unavailable servers for script ${script} with ramCost ${ramCost}`);
		while (ramCost >= threadMultiplier) {
			await ns.sleep(100);
			ns.print(`\nCurrent ramCost is ${ramCost}, looping through available servers...`);
			for (let j = 0; j < server.serverList.length; j++) {
				let serverRamCost = Math.min(ramCost, server.serverList[j][1]);
				let pid = Date.now() + Math.random();
				ns.print(`Trying to exec ${script} on server ${server.serverList[j][0]} with ramCost ${serverRamCost}`);
				if (ns.exec(script, server.serverList[j][0], Math.max(Math.floor((serverRamCost) / threadMultiplier), 1), host, 0, pid) != 0) {
					ns.print(`Successfully executed ${script} on server ${server.serverList[j][0]}`);
					ramCost -= serverRamCost;
				} else {
					ns.print(`Failed to execute ${script} on server ${server.serverList[j][0]}, ramCost: ${ramCost} -- handleInsufficientRam`);
				}
				if (ramCost <= threadMultiplier) {
					ns.print(`ramCost is now less or equal to threadMultiplier, breaking the loop...`);
					break;
				}
			}
			server = new ServerObject(ns, ramCost);
			ns.print(`Sleeping for 1 second before trying to allocate more servers...`);
		}
		ns.print(`handleUnavailableServers for ${script} completed`);
	}

	function getHackTargetIndex(hackList) {

		for (let i = 0; i < 10; i++) {
			ns.print(hackList[i].serverRequiredHacking, " ", hackList[i].serverHost, " ", hackList[i].serverHackValue, "\n");
		}


		for (let i = 0; i < hackList.length; i++) {
			ns.print(hackList[i].serverRequiredHacking, " ", hackList[i].serverHost, " ", hackList[i].serverHackValue, "\n");
			if (hackList[i].serverAdminRights) {
				return i;
			}
		}
		return -1;
	}
}
