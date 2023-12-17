/** @param {NS} ns **/
export async function main(ns) {
	const hackScript = "hackScript.js";
	const growScript = "growScript.js";
	const weakenScript = "weakenScript.js";
	const hostName = ["n00dles"]; //blade
	var scriptID = 0;
	while (true) {

		var hackTargetArr = [];
		var purchasedServer = ns.getPurchasedServers();
		purchasedServer.push("home");


		for (var i = 0; i < purchasedServer.length; i++) {
			for (var j = 0; j < hostName.length; j++) {


				//hack


				try {

					var hackChance = ns.hackAnalyzeChance(hostName[j]);
					var threadsCalculated = 1;
					var hackThreadCount = 1;
					while (true) {

						if (ns.hackAnalyze(hostName[j]) * ns.getServerMaxMoney(hostName[j]) * threadsCalculated < ns.getServerMaxMoney(hostName[j]) * 0.90 && ns.hackAnalyze(hostName[j]) != 0) {
							hackThreadCount = threadsCalculated;

						}
						else {
							break;
						}
						threadsCalculated += 2;


					}
					hackThreadCount *= (1 - hackChance + 1);




					var hackTime = ns.getHackTime(hostName[j]);

					hackTargetArr.push([hackScript, purchasedServer[i], hackThreadCount, hackTime]);
					ns.print("add Hack to hackArr " + purchasedServer[i] + " " + hackThreadCount);





				}
				catch (err) {

					ns.alert(err + "hack issue");
					ns.killall();
				}


				//grow



				try {

					var growBy = ns.getServerMaxMoney(hostName[j]) / (ns.getServerMaxMoney(hostName[j]) * 0.15);
					var growTime = ns.getGrowTime(hostName[j]);

					var growThreadCount = ns.growthAnalyze(hostName[j], growBy);
					ns.print("grow threadCount " + growThreadCount);


					hackTargetArr.push([growScript, purchasedServer[i], growThreadCount, growTime]);
					ns.print("add grow to hackArr " + purchasedServer[i] + " " + growThreadCount);




				}
				catch (err) {

					ns.alert(err + "grow issue");
					ns.killall();
				}

				//weaken

				// weaken removes 0.05 security per thread

				try {

					var hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadCount);
					var growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadCount);
					var weakenThreads = (hackSecurityIncrease + growSecurityIncrease + ns.getServerSecurityLevel(hostName[j]) - ns.getServerMinSecurityLevel(hostName[j])) / 0.05;
					var weakenTime = ns.getWeakenTime(hostName[j]);

					hackTargetArr.push([weakenScript, purchasedServer[i], weakenThreads, weakenTime]);
					ns.print("add weaken to hackArr " + purchasedServer[i] + " " + weakenThreads);



				}
				catch (err) {

					ns.alert(err + "weaken issue");
					ns.killall();
				}

				await hackTarget(hostName[j]);
				await ns.sleep(400);

			}



		}
		await ns.sleep(1000);
		scriptID++;
	}
	async function hackTarget(hostname) {
		// Execute each hacktarget

		ns.print("hackTarget function");
		ns.print(hackTargetArr);
		var decreaseThreads = 1;
		var totalRamCost = hackTargetArr[0][2] * ns.getScriptRam(weakenScript) + hackTargetArr[1][2] * ns.getScriptRam(growScript) + hackTargetArr[2][2] * ns.getScriptRam(hackScript);

		for (var i = hackTargetArr.length - 1; i >= 0; i--) {
			if (totalRamCost < ns.getServerMaxRam(hackTargetArr[0][1]) - ns.getServerUsedRam(hackTargetArr[0][1])) {
				try {


					if (hackTargetArr[i][0] == hackScript && i + 2 < hackTargetArr.length) {
						var sleepTime = Math.ceil(hackTargetArr[i + 2][3] - hackTargetArr[i][3] + 150);
					}
					else if (hackTargetArr[i][0] == growScript && i - 1 >= 0) {
						var sleepTime = Math.ceil(hackTargetArr[i + 1][3] - hackTargetArr[i][3] + 100);
					}
					else {
						sleepTime = 0;
					}

					ns.exec(hackTargetArr[i][0], hackTargetArr[i][1], hackTargetArr[i][2], hostName[j], sleepTime, scriptID);
				}

				catch (err) {

					ns.alert(err + "execute issue" + sleepTime);
					ns.killall();
				}
			}
		}


		hackTargetArr.length = 0;
	}
}