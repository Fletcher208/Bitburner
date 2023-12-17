export class ServerObject {
	/** @param {NS} ns **/
	constructor(ns, ramNeeded) {

		this.ramNeeded = ramNeeded;
		this.maxRam = 0;
		this.usedRam = 0;
		this.availableRam = 0;
		this.serverList = [];
		this.availableServer = true;



		let totalAvailableRam = 0;
		for (const i of ns.getPurchasedServers()) {
			if (checkServerInUse(i) == true) {
				continue;
			}
			this.maxRam += ns.getServerMaxRam(i);
		}
		if (this.maxRam > this.ramNeeded) {

			for (const i of ns.getPurchasedServers()) {

				this.availableRam = ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
				totalAvailableRam += this.availableRam;

				if (this.ramNeeded < totalAvailableRam) {
					this.serverList.push(i);
					break;
				}
				else {
					this.serverList.push(i);
				}
			}
		}

		else {
			this.availableServer = false;
		}


		async function checkServerInUse(server) {

			let currentServerUsedRam = ns.getServerUsedRam(server);


			await ns.sleep(500);
			if (currentServerUsedRam > ns.getServerUsedRam(server)) {
				return true;
			}
			else {
				return false;
			}

		}
	}
}