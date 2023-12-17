export class ServerObject {
	/** @param {NS} ns **/
	constructor(ns, ramNeeded) {

		this.ramNeeded = ramNeeded;
		this.maxRam = 0;
		this.usedRam = 0;
		this.availableRam = 0;
		this.serverList = [];
		this.availableServer = 1;
		let emptyServer = [];
		let emptyServerMaxRam = 0;
		let maxServerRam = 0;
		//ns.tail();
		ns.disableLog("getServerMaxRam");
		ns.disableLog("getServerUsedRam");
		let checkList = ns.getPurchasedServers();
		checkList.push("home");


		let totalAvailableRam = 0;
		for (const i of checkList) {
			// if ( checkServerInUse(i) == true) {
			// 	continue;
			// }
			maxServerRam += ns.getServerMaxRam(i);
			if (ns.getServerMaxRam(i) - ns.getServerUsedRam(i) == ns.getServerMaxRam(i)) {
				emptyServerMaxRam += ns.getServerMaxRam(i);
				emptyServer.push(i);
			}
			this.maxRam += ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
		}
		//ns.print(emptyServerMaxRam," ", this.ramNeeded, " ", maxServerRam," checkServerAvailable" );
		if (emptyServerMaxRam > this.ramNeeded) {
			for (const i of emptyServer) {
				totalAvailableRam += ns.getServerMaxRam(i);
				if (this.ramNeeded < totalAvailableRam) {
					this.serverList.push(i);
					break;
				}
				else {
					this.serverList.push(i);
				}
				ns.print(i);

			}
		}
		else if (this.maxRam > this.ramNeeded) {

			for (const i of checkList) {

				this.availableRam = ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
				totalAvailableRam += this.availableRam;
				if (this.availableRam > 2) {
					if (this.ramNeeded < totalAvailableRam) {
						this.serverList.push(i);
						break;
					}
					else {
						this.serverList.push(i);
					}
				}
			}
		}

		else {
			if (maxServerRam > ramNeeded) {
				this.availableServer = 2;
			}
			else {
				this.availableServer = 0;
			}
		}
	}
}