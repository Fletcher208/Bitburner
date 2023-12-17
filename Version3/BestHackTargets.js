/** @param {NS} ns */
export async function main(ns) {
	let scanTargets = JSON.parse(ns.peek(1));
	let hackList = [];
	let hackListSlow = [];
	let hackingValue = 0;

	for (var i = 0; i < scanTargets.length; i++) {
		try {

			if (ns.getServer(scanTargets[i]).moneyMax != 0 && ns.getServer(scanTargets[i]).serverGrowth > 1 && ns.hackAnalyze(scanTargets[i]) != 0) {
				hackingValue = (ns.getServer(scanTargets[i]).moneyMax * ns.getServer(scanTargets[i]).serverGrowth) / (ns.getWeakenTime(scanTargets[i]) + ns.getGrowTime(scanTargets[i]) + ns.getHackTime(scanTargets[i]));
				if (!hackList.includes(scanTargets[i]) && ns.getServer(scanTargets[i]).hasAdminRights) {
					hackList.push([scanTargets[i], hackingValue]);
				}
			}
			if (ns.getServer(scanTargets[i]).maxRam != 0 && ns.hasRootAccess(scanTargets[i]) == true) {
				hackListSlow.push(scanTargets[i]);
			}

		}
		catch (err) {
			ns.alert(err + " " + scanTargets[i] + " " + ns.getServer(scanTargets[i]).moneyMax);
		}
	}

	hackList.sort((a, b) => b[1] - a[1]);
	ns.print(hackList, " hacklist sorted");

	for (var i = 0; i < hackList.length; i++) {
		if (i > 5) {
			hackList.splice(i);
		}
	}
	scanTargets = [];
	for (let i = 0; i < hackList.length; i++) {
		scanTargets[i] = hackList[i][0];
	}

	var writePortArr = JSON.stringify(scanTargets);
	ns.clearPort(2);
	ns.print(writePortArr);
	ns.print(await ns.tryWritePort(2, writePortArr));

	var writePortArrSlow = JSON.stringify(hackListSlow);
	ns.clearPort(3);
	ns.print(writePortArrSlow);
	ns.print(await ns.tryWritePort(3, writePortArrSlow));

}