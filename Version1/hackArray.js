/** @param {NS} ns **/
export async function main(ns) {
	const hackScript = "hackScript.js";
	const growScript = "growScript.js";
	const weakenScript = "weakenScript.js";
	var scanTargets = JSON.parse(ns.peek(1));
	var hackList = [];
	var hackingValue = 0;
	ns.print(scanTargets.length);

	
	// function hackListObject(scriptType, threadCount, hackTarget, sleepTime) {
	// 	this.scriptType = scriptType;
	// 	this.threadCount = threadCount;
	// 	this.hackTarget = hackTarget;
	// 	this.sleepTime = sleepTime;
	// }

	for (var i = 0; i < scanTargets.length; i++) {
		try {
			if (ns.getServer(scanTargets[i]).moneyMax != 0 && ns.getServer(scanTargets[i]).serverGrowth > 1) {
				hackingValue = (ns.getServer(scanTargets[i]).moneyMax * ns.getServer(scanTargets[i]).serverGrowth) / (ns.getWeakenTime(scanTargets[i]) + ns.getGrowTime(scanTargets[i]) + ns.getHackTime(scanTargets[i]));
				if (!hackList.includes(scanTargets[i]) && ns.getServer(scanTargets[i]).hasAdminRights) {
					hackList.push([scanTargets[i], hackingValue]);
				}
			}
		}
		catch (err) {
			ns.alert(err + " " + scanTargets[i] + " " + ns.getServer(scanTargets[i]).moneyMax);
		}
	}

	hackList.sort((a, b) => b[1] - a[1]);

	//splice to top 5
	for (var i = 0; i < hackList.length; i++) {
		if (i > 5) {
			hackList.splice(i);
		}
	}

	var hackTargetArr = [];

	for (var j = 0; j < hackList.length; j++) {
		ns.print(hackList[j][0]);
		//hack
		try {
			var hackChance = ns.hackAnalyzeChance(hackList[j][0]);
			var hackThreadCount = 1;


			hackThreadCount *= (1 - hackChance + 1);
			var hackTime = ns.getHackTime(hackList[j][0]);
			hackTargetArr.push([hackScript, hackThreadCount, hackList[j][0], hackTime]);

		} catch (err) {
			ns.print(hackTargetArr);
			ns.alert(err + " hack issue " + hackList[j][0]);
			ns.killall();
		}

		//grow
		try {
			var growBy = ns.getServer(hackList[j][0]).moneyMax / (ns.getServer(hackList[j][0]).moneyMax * 0.10);
			var growTime = ns.getGrowTime(hackList[j][0]);
			var growThreadCount = Math.ceil(ns.growthAnalyze(hackList[j][0], growBy));
			
			hackTargetArr.push([growScript, growThreadCount, hackList[j][0], growTime]);

		} catch (err) {

			ns.alert(err + "grow issue " + hackList[j][0]);
			ns.killall();
		}

		//weaken
		// weaken removes 0.05 security per thread
		try {

			var hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadCount);
			var growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadCount);
			var weakenThreads = (hackSecurityIncrease + growSecurityIncrease + ns.getServer(hackList[j][0]).hackDifficulty - ns.getServer(hackList[j][0]).minDifficulty) / ns.weakenAnalyze(1);
			var weakenTime = ns.getWeakenTime(hackList[j][0]);
			hackTargetArr.push([weakenScript, weakenThreads, hackList[j][0], weakenTime]);


		} catch (err) {

			ns.alert(err + "weaken issue");
			ns.killall();
		}

	}
	//ns.alert(writePortArr);
	var writePortArr = JSON.stringify(hackTargetArr);
	//ns.alert(writePortArr);
	ns.clearPort(2);
	ns.print(await ns.tryWritePort(2, hackTargetArr));
}