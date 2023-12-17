/** @param {NS} ns **/
export async function main(ns) {

	var highestRamServer = 0;
	var serverRamOptions = [];
	//ns.tail();
	ns.disableLog("ALL");
	if (typeof (ns.peek(5)) != 'number') {
		ns.clearPort(5);
	}

	var ramTier = ns.peek(5) === "NULL PORT DATA" ? 2 : ns.peek(5);

	for (var i = 0; i < ns.getPurchasedServers().length; i++) {
		if (highestRamServer < ns.getServerMaxRam(ns.getPurchasedServers()[i])) {
			highestRamServer = ns.getServerMaxRam(ns.getPurchasedServers()[i]);
		}
	}

	for (var i = 0; i < 19; i++) {
		serverRamOptions.push(Math.pow(2, i));
		if (Math.pow(2, ramTier) < highestRamServer) {
			ramTier++;
		}
	}

	for (var i = serverRamOptions.length; i--;) {

		if(ns.getPurchasedServerCost(serverRamOptions[i]) < ns.getPlayer().money && highestRamServer < serverRamOptions[i]){
			ramTier = i;
			ns.print(ramTier);
			break;
		}
	}

	var increaseRamTier = 0;

	//ns.print(ramTier, " line 30");
	//ns.print(ns.getPurchasedServerCost(serverRamOptions[ramTier]) + " " + ns.getPlayer().money + " " + serverRamOptions.length + " " + ramTier + " " + ns.getPurchasedServers().length);
	//ns.print(ns.getPurchasedServerCost(serverRamOptions[ramTier]) + " " + serverRamOptions.length + " " + ramTier);
	if (ramTier < serverRamOptions.length) {
		loop1:
		while (ns.getPurchasedServerCost(serverRamOptions[ramTier]) < ns.getPlayer().money && ramTier < serverRamOptions.length) {
			for (var i = 0; i < ns.getPurchasedServerLimit(); i++) {
				if (ramTier >= serverRamOptions.length) {
					break loop1;
				}
				//ns.print(ramTier, " ", serverRamOptions.length, "line 37");
				await ns.sleep(50);
				ns.print(ns.getPurchasedServerCost(serverRamOptions[ramTier]), " ", ns.serverExists("Pserv-" + i + "-" + serverRamOptions[ramTier]), " line 39");
				if (ns.getPurchasedServerCost(serverRamOptions[ramTier]) < ns.getPlayer().money && ns.serverExists("Pserv-" + i + "-" + serverRamOptions[ramTier]) == false && ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
					ns.print(ns.purchaseServer("Pserv-" + i + "-" + serverRamOptions[ramTier], serverRamOptions[ramTier]) + " purchased server");
				}


				for (var j = 0; j < ns.getPurchasedServers().length; j++) {
					if (ns.getServerMaxRam(ns.getPurchasedServers()[j]) == serverRamOptions[ramTier]) {
						increaseRamTier++;
						//ns.print(increaseRamTier);
					}
				}
				ns.print(increaseRamTier);

				//ns.print(ramTier, " ", serverRamOptions.length);
				if (increaseRamTier >= 24) {
					ramTier++;
				}


				//ns.print(ns.getPurchasedServers().length, " ", ns.getPurchasedServerLimit(), " ", ns.getServerMaxRam(ns.getPurchasedServers()[i]), " ", serverRamOptions[ramTier])
				if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
					if (ns.getServerMaxRam(ns.getPurchasedServers()[i]) < serverRamOptions[ramTier]) {
						ns.killall(ns.getPurchasedServers()[i]);
						ns.print(ns.deleteServer(ns.getPurchasedServers()[i]) + " deleted " + ns.getPurchasedServers()[i]);
					}
				}
				increaseRamTier = 0;
			}

		}
	}
	ns.clearPort(5);
	await ns.tryWritePort(5, ramTier);


	for (var i = 0; i < ns.getPurchasedServers().length; i++) {
		if (ns.fileExists("HackScript.js", ns.getPurchasedServers()[i]) == false) {

			ns.print(ns.scp("HackScript.js", ns.getPurchasedServers()[i], "home"));
			ns.scp("GrowScript.js", ns.getPurchasedServers()[i], "home");
			ns.scp("WeakenScript.js", ns.getPurchasedServers()[i], "home");
			//ns.print("test");
		}
	}

}