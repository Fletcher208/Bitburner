/** @param {NS} ns **/
export async function main(ns) {
	const scanServers = "scanServers.js";
	const purchaseServerjs = "purchaseServer.js";
	const hackArray = "hackArray.js";
	const hackTarget = "hackTarget.js";
	const hackFromHosts = "hackFromHosts.js";
	const home = "home";
	const checkServerFull = "checkServerFull.js";
	let serverAllocationSplit = 0;
	let scriptID = 0;
	const shareScript = "shareScript.js";
	const commitCrimejs = "commitCrime.js";
	ns.disableLog("ALL");
	while (true) {
		try {
			//await ns.sleep(1000);
			ns.print("scanServer");
			if (!ns.scriptRunning(scanServers, home)) {
				ns.exec(scanServers, home);
				///await ns.sleep(1000);
			}
			else {
				await ns.sleep(1);
			}

			//ns.alert(ns.getOwnedSourceFiles());		
			if (ns.getOwnedSourceFiles().includes == "n4") {
				await ns.sleep(1000);
				ns.print("commit Crime");
				if (!ns.scriptRunning(commitCrimejs, home)) {
					ns.exec(commitCrimejs, home);
					//await ns.sleep(1000);
				}
				else {
					await ns.sleep(1);
				}
			}

			ns.print(ns.peek(5) + " " + ns.nFormat(ns.getPurchasedServerCost(Math.pow(2, ns.peek(5))), '($ 0.00 a)'));
			//await ns.sleep(1000);
			ns.print("purchase");
			if (!ns.scriptRunning(purchaseServerjs, home) && ns.peek(5) != 21 && !ns.scriptRunning(hackTarget, home) && ns.getPurchasedServerCost(Math.pow(2, ns.peek(5))) < ns.getPlayer().money || ns.getPurchasedServers().length == 0 || ns.peek(5) == "NULL PORT DATA") {
				ns.print(ns.exec(purchaseServerjs, home) + " purchase server ID");
				await ns.sleep(1000);
			}
			else {
				await ns.sleep(1);
			}

			//await ns.sleep(5000);
			ns.print("check");
			ns.exec(checkServerFull, home);

			if (ns.peek(4) == 1) {
				await ns.sleep(5000);
				//ns.print("sleeping");
			}
			else {
				//await ns.sleep(1000);
				ns.print("array");
				if (!ns.scriptRunning(hackArray, home)) {
					ns.exec(hackArray, home);
					await ns.sleep(1000);
				}
				else {
					await ns.sleep(1);
				}

				//for (let k = 0; k < Math.ceil(ns.getPurchasedServers().length / 5); k++) {
				if (ns.getPurchasedServers().length != 0) {
					var serverAllocation = [];
					// if (serverAllocationSplit > 24) {
					// 	serverAllocationSplit = 0;
					// }
					//ns.print(serverAllocationSplit);

					//ns.print(serverAllocation[0] + " " + serverAllocation[serverAllocation.length -1]);
					for (let i = serverAllocationSplit; i < ns.getPurchasedServers().length; i++) {
						serverAllocation.push(ns.getPurchasedServers()[i]);
						if (i == ns.getPurchasedServers().length - 1 && ns.getServer(home).maxRam >= 256) {
							serverAllocation.push(home);
						}
						if (i % 5 == 4) {

							break;
						}
					}

					if (ns.getPurchasedServers().length < 5 && !serverAllocation.includes(home) || ns.getServer(home).maxRam >= 256) {
						serverAllocation.push(home);
					}
					serverAllocationSplit += 5;
					if (serverAllocationSplit >= ns.getPurchasedServers().length) {
						serverAllocationSplit = 0;
						//await ns.sleep(5000);
					}

					//ns.print(serverAllocationSplit);
					//serverAllocation = JSON.stringify(serverAllocation);
					//ns.print(serverAllocation);
					ns.clearPort(3);
					await ns.tryWritePort(3, serverAllocation);
					ns.print(serverAllocation);
					// ns.print(serverAllocationSplit);
					// ns.print(serverAllocation);
					// ns.print(serverAllocation[0]);
					await ns.sleep(1000);
					ns.print("target");
					if (ns.peek(1) != "NULL PORT DATA" && ns.peek(2) != "NULL PORT DATA" && ns.peek(3) != "NULL PORT DATA" && !ns.getRunningScript(purchaseServerjs, home) && !ns.getRunningScript(hackTarget, home, serverAllocation[0])) {
						if (ns.peek(5) < 15) {
							ns.exec(hackTarget, home, 1, ns.getPurchasedServers()[0]);
						}
						else {
							ns.exec(hackTarget, home, 1, serverAllocation[0]);
						}

					}
				}
			}

			//await ns.sleep(1000);
			ns.print("array");
			if (!ns.scriptRunning(hackArray, home)) {
				ns.exec(hackArray, home);
				//await ns.sleep(1000);
			}
			else {
				await ns.sleep(1);
			}

			//await ns.sleep(1000);
			ns.print("host");
			if (ns.peek(1) != "NULL PORT DATA" && ns.peek(2) != "NULL PORT DATA") {
				ns.print(ns.exec(hackFromHosts, home, 1, scriptID));
				//await ns.sleep(1000);
			}

			//await ns.sleep(1000);
			// ns.print("share");
			// let shareThreads = (ns.getServer(home).maxRam * 0.2 - ns.getServer(home).ramUsed) / 2.4;
			// if ((ns.getServer(home).maxRam - ns.getServer(home).ramUsed) > (shareThreads * 2.4) && shareThreads > 0) {
			// 	//ns.print(shareThreads);
			// 	ns.exec(shareScript, home, shareThreads);
			// }

			//await ns.sleep(1000);
			scriptID++;
		}
		catch (err) {
			ns.alert(err);
			ns.killall();
		}
	}
}