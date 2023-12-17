/** @param {NS} ns **/
export async function main(ns) {
	
	var highestRamServer = 0;
	var serverRamOptions = [];
	ns.disableLog("ALL");

	var ramTier = ns.peek(5) === "NULL PORT DATA" ? 2 : ns.peek(5);
	//ns.alert( ramTier);

	for (var i = 0; i < ns.getPurchasedServers().length; i++) {
		if (highestRamServer < ns.getServerMaxRam(ns.getPurchasedServers()[i])) {
			highestRamServer = ns.getServerMaxRam(ns.getPurchasedServers()[i]);
		}

	}

	for (var i = 0; i <= 20; i++) {
		serverRamOptions.push(Math.pow(2, i));
		if (Math.pow(2, ramTier) < highestRamServer) {
			ramTier++;
		}
	}

	var increaseRamTier = 0;
	//await ns.sleep(5000);
	ns.print(ns.getPurchasedServerCost(serverRamOptions[ramTier]) + " " + serverRamOptions.length + " " + ramTier);
	if (ramTier != serverRamOptions.length) {
		while (ns.getPurchasedServerCost(serverRamOptions[ramTier]) < ns.getPlayer().money && ramTier < serverRamOptions.length) {
			//await ns.sleep(1000);
			for (var i = 0; i < ns.getPurchasedServerLimit(); i++) {



				if (ns.getPurchasedServerCost(serverRamOptions[ramTier]) < ns.getPlayer().money && ns.serverExists("Pserv-" + i + "-" + serverRamOptions[ramTier]) == false && ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
					ns.print(ns.purchaseServer("Pserv-" + i + "-" + serverRamOptions[ramTier], serverRamOptions[ramTier]) + " purchased server");
				}


				for (var j = 0; j < ns.getPurchasedServers().length; j++) {
					if (ns.getServerMaxRam(ns.getPurchasedServers()[j]) == serverRamOptions[ramTier]) {
						increaseRamTier++;

					}
				}


				if (increaseRamTier == 25) {
					ramTier++;
					//ns.tail();

				}
				//ns.alert(ramTier);



				if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit() && ns.getServerMaxRam(ns.getPurchasedServers()[i]) < serverRamOptions[ramTier]) {
					ns.killall(ns.getPurchasedServers()[i]);
					ns.print(ns.deleteServer(ns.getPurchasedServers()[i]) + " deleted " + ns.getPurchasedServers()[i]);

				}
				increaseRamTier = 0;
			}
			ns.print(ns.getPurchasedServerCost(serverRamOptions[ramTier]) + " " + ns.getPlayer().money + " " + serverRamOptions.length + " " + ramTier + " " + ns.getPurchasedServers().length);
			//await ns.sleep(500);
		}
	}
	ns.clearPort(5);
	await ns.tryWritePort(5, ramTier);


	for (var i = 0; i < ns.getPurchasedServers().length; i++) {
		if (ns.fileExists("hackScript.js", ns.getPurchasedServers()[i]) == false) {

			await ns.scp("hackScript.js", "home", ns.getPurchasedServers()[i]);
			await ns.scp("growScript.js", "home", ns.getPurchasedServers()[i]);
			await ns.scp("weakenScript.js", "home", ns.getPurchasedServers()[i]);
		}
	}

}