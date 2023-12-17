/** @param {NS} ns **/
export async function main(ns) {
	const hackScript = "HackScript.js";
	const growScript = "GrowScript.js";
	const weakenScript = "WeakenScript.js";
	var hackList = JSON.parse(ns.peek(2));
	ns.print(hackList);
	var hackTargetArr = [];

	for (var j = 0; j < hackList.length; j++) {
		ns.print(hackList[j]);
		//hack
		try {
			var hackChance = ns.hackAnalyzeChance(hackList[j]);
			var hackThreadCount = 1;
			hackThreadCount *= (1 - hackChance + 1);
			hackThreadCount = Math.ceil(0.95 / ns.hackAnalyze(hackList[j]) * hackThreadCount);
			ns.print(hackThreadCount, ns.hackAnalyzeThreads(hackList[j],0.95*ns.getServerMaxMoney(hackList[j]))+" hack threads");
			var hackTime = ns.getHackTime(hackList[j]);
			hackTargetArr.push([hackScript, hackThreadCount, hackList[j], hackTime]);

		} catch (err) {
			ns.print(hackTargetArr);
			ns.alert(err + " hack issue " + hackList[j]);
			ns.killall();
		}

		//grow
		try {
			var growBy = ns.getServer(hackList[j]).moneyMax / (ns.getServer(hackList[j]).moneyMax * 0.10);
			var growTime = ns.getGrowTime(hackList[j]);
			var growThreadCount = Math.ceil(ns.growthAnalyze(hackList[j], growBy));
			ns.print(growThreadCount, growBy + "grow");
			hackTargetArr.push([growScript, growThreadCount, hackList[j], growTime]);

		} catch (err) {

			ns.alert(err + "grow issue " + hackList[j]);
			ns.killall();
		}

		//weaken
		// weaken removes 0.05 security per thread
		try {

			var hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadCount);
			var growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadCount);
			var weakenThreads = (hackSecurityIncrease + growSecurityIncrease + ns.getServer(hackList[j]).hackDifficulty - ns.getServer(hackList[j]).minDifficulty) / ns.weakenAnalyze(1);
			ns.print(weakenThreads);
			var weakenTime = ns.getWeakenTime(hackList[j]);
			hackTargetArr.push([weakenScript, weakenThreads, hackList[j], weakenTime]);


		} catch (err) {

			ns.alert(err + "weaken issue");
			ns.killall();
		}

	}
	//ns.alert(writePortArr);
	var writePortArr = JSON.stringify(hackTargetArr);
	//ns.alert(writePortArr);
	ns.clearPort(3);
	ns.print(await ns.tryWritePort(3, writePortArr));
}