/** @param {NS} ns **/
export async function main(ns) {
	var scanTargets = JSON.parse(ns.peek(1));
	var hackTargetArr = ns.peek(2);
	const hackScript = "hackScript.js";
	const growScript = "growScript.js";
	var scriptID = ns.args[0];
	try {
		for (var i = hackTargetArr.length - 1; i >= 0; i--) {
			var removeSleepTime = 0;
			for (var j = 0; j < scanTargets.length; j++) {

				if (ns.fileExists("hackScript.js", scanTargets[j]) == true && scanTargets[j] != "home" && ns.getServer(scanTargets[j]).hasAdminRights) {




					if (hackTargetArr[i][0] == hackScript && i + 2 < hackTargetArr.length) {
						var sleepTime = Math.ceil(hackTargetArr[i + 2][3] - hackTargetArr[i][3] + 150);
					} else if (hackTargetArr[i][0] == growScript && i - 1 >= 0) {
						var sleepTime = Math.ceil(hackTargetArr[i + 1][3] - hackTargetArr[i][3] + 100);
					} else {
						sleepTime = 0;
					}

					if (sleepTime - removeSleepTime < 0) {
						sleepTime = 0;
						removeSleepTime = 0;
					}


					var availableRam = ns.getServer(scanTargets[j]).maxRam - ns.getServer(scanTargets[j]).ramUsed;
					var totalHackRam = ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][1];
					if (availableRam < totalHackRam) {
						var partialThreads = Math.floor(availableRam / ns.getScriptRam(hackTargetArr[i][0], "home"));
						if (partialThreads > 0) {
							try {
								if (ns.exec(hackTargetArr[i][0], scanTargets[j], partialThreads, hackTargetArr[i][2], sleepTime - removeSleepTime, scriptID) == 0) {
									ns.print(hackTargetArr[i][0] + " " + scanTargets[j] + " " + partialThreads + " " + hackTargetArr[i][2] + " partial");
								}
							}
							catch (err) {
								ns.alert(err);
							}
							await ns.sleep(1);
							hackTargetArr[i][1] -= partialThreads;
						}
					}


					if (availableRam > totalHackRam && hackTargetArr[i][2] > 1) {

						if (ns.exec(hackTargetArr[i][0], scanTargets[j], hackTargetArr[i][1], hackTargetArr[i][2], sleepTime - removeSleepTime, scriptID) == 0) {
							ns.print(availableRam + " " + totalHackRam);
						}

						await ns.sleep(1);

						break;
					}
					if (j == scanTargets.length) {
						j = 0;

					}

				}
			}
		}
	} catch (err) {

		ns.alert(err + "execute issue " + partialThreads + " " + ns.getServer(scanTargets[j]).maxRam + " " + scanTargets[j] + " ");
		ns.killall();
	}
}