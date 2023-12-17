/** @param {NS} ns **/
export async function main(ns) {
	var hackTargetArr = JSON.parse(ns.peek(2));
	ns.print(hackTargetArr);

		var serverAllocation = ns.getPurchasedServers();
		
	
	//ns.print(serverAllocation);

	var scriptID = 0;
	const hackScript = "HackScript.js";
	const growScript = "GrowScript.js";
	//var totalServerRam = 0;
	var assetID = ns.args[0];
	var scriptID = 0;
	ns.disableLog("ALL");
	




	//ns.print(serverAllocation + " " + scriptID);


	//ns.print(hackTargetArr[0][2] + " " + hackTargetArr.length);

	for (const j of serverAllocation) {
		

		var removeSleepTime = 0;
		//ns.print(j);

		for (var i = hackTargetArr.length - 1; i >= 0; i--) {
			//ns.print(i);
			//await ns.sleep(1000);
			
			try {

				if (hackTargetArr[i][0] == hackScript) {

					var sleepTime = Math.ceil(hackTargetArr[i + 2][3] - hackTargetArr[i][3] + 600);
					//ns.print(sleepTime + " " + hackTargetArr[i + 2][3] + " " + hackTargetArr[i][3]);
				} else if (hackTargetArr[i][0] == growScript) {

					var sleepTime = Math.ceil(hackTargetArr[i + 1][3] - hackTargetArr[i][3] + 300);
					//ns.print(sleepTime + " " + hackTargetArr[i + 1][3] + " " + hackTargetArr[i][3]);
				} else {
					sleepTime = 0;
				}


				if (sleepTime - removeSleepTime < 0) {
					sleepTime = 0;
					removeSleepTime = 0;
				}

				var availableRam = ns.getServer(j).maxRam - ns.getServer(j).ramUsed;
				var totalHackRam = ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][1];
				//ns.alert(availableRam + " " + totalHackRam + " " + j);
				// if (availableRam < ns.getServer(j).maxRam * 0.7 && j == "home") {
				// 	ns.print("home continue" + i);
				// 	continue;
				// }
				
				// if (availableRam < totalHackRam) {
				// 	//ns.tail();

				// 	var partialThreads = Math.floor(availableRam / ns.getScriptRam(hackTargetArr[i][0], "home"));
				// 	//ns.print(availableRam + " " + totalHackRam + " " + partialThreads + " " + ns.getServer(j).maxRam + " " + ns.getServer(j).ramUsed + " " + j);

				// 	if (partialThreads > 0) {

				// 		try {
							
				// 			if(ns.exec(hackTargetArr[i][0], j, partialThreads, hackTargetArr[i][2], sleepTime - removeSleepTime, scriptID) == 0) {
				// 				//ns.tail();
				// 				//ns.print(hackTargetArr[i][0] + " " + j + " " + partialThreads + " " + hackTargetArr[i][2] + " " + ns.getServer(j).maxRam + " " + ns.getServer(j).ramUsed + " " + scriptID + " partial failed exec");

				// 			}
				// 		}
				// 		catch (err) {
				// 			//ns.alert(err);
				// 		}
				// 		await ns.sleep(1);
				// 		hackTargetArr[i][1] -= partialThreads;
				// 	}

				// }
				availableRam = ns.getServer(j).maxRam - ns.getServer(j).ramUsed;
				totalHackRam = ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][1];

				//ns.alert(serverAllocation[serverAllocation.length-2] + " " + j);
				//ns.alert(j + " " + serverAllocation[serverAllocation.length - 1]);
				if (availableRam > totalHackRam && hackTargetArr[i][1] > 1) {

					//ns.alert(availableRam + " " + totalHackRam + " " + hackTargetArr[i][2] + " " + hackTargetArr[i][1] + " " +  hackTargetArr[i][0]);
					try {
						
						if (ns.exec(hackTargetArr[i][0], j, hackTargetArr[i][1], hackTargetArr[i][2], sleepTime - removeSleepTime, scriptID) == 0) {
							//ns.tail();
							//ns.print(hackTargetArr[i][0] + " " + availableRam + " " + totalHackRam + " " + j + " " + ns.getServer(j).maxRam + " " + ns.getServer(j).ramUsed + " " + scriptID + " failed exec " + ns.getServer(j).hostname);
						}
					}
					catch (err) {
						ns.print(err);
					}
					await ns.sleep(1);
				}



				if (availableRam > totalHackRam && i == 0 && hackTargetArr[i][1] > 1) {
					
					i = hackTargetArr.length - 1;
					//ns.print(availableRam + " " + totalHackRam);
					//ns.alert(ns.getServer(j).maxRam*0.9 + " " + availableRam);
				}
				else if (i == 0) {
					break;
				}
				scriptID++;

			} catch (err) {

				ns.alert(err);
				ns.killall();
			}
		}


	}



}