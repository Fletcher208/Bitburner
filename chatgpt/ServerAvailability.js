export class ServerObject {
	constructor(ns, ramNeeded) {
		this.ramNeeded = ramNeeded;
		this.initValues(ns);
		this.generateServerList(ns);


	}

	initValues(ns) {
		this.maxRam = 0;
		this.serverList = [];
		this.checkList = ns.getPurchasedServers();
		if (ns.getServerMaxRam(ns.getPurchasedServers()[0]) < 1024) {
			Array.prototype.push.apply(this.checkList, JSON.parse(ns.peek(3)));
		} else {
			this.checkList.push("home");
		}

		this.emptyServer = [];
		ns.print("Initialized values");
		ns.print(this.checkList);
	}

	generateServerList(ns) {
		let emptyServerMaxRam = 0;
		for (const i of this.checkList) {
			let serverMaxRam = ns.getServerMaxRam(i);
			if (this.isServerEmpty(ns, i)) {
				emptyServerMaxRam += serverMaxRam;
				this.emptyServer.push(i);
			}
			this.maxRam += serverMaxRam - ns.getServerUsedRam(i);
		}

		ns.print(`emptyServerMaxRam: ${emptyServerMaxRam}, maxRam: ${this.maxRam}`);
		ns.print(this.ramNeeded);

		if (emptyServerMaxRam > this.ramNeeded) {
			ns.print("Handle empty Server");
			this.handleEmptyServers(ns);

		}
		else if (this.maxRam > this.ramNeeded) {
			this.handlePartiallyUsedServers(ns);
			ns.print("Handle partial Server");
		}
		else {
			this.handleFullServers(ns);
			ns.print("Handle full Server");
		}
	}

	isServerEmpty(ns, serverName) {
		return ns.getServerMaxRam(serverName) - ns.getServerUsedRam(serverName) == ns.getServerMaxRam(serverName);
	}

	handleEmptyServers(ns) {
		let totalAvailableRam = 0;
		ns.print("enter");
		for (let i of this.emptyServer) {
			totalAvailableRam += ns.getServerMaxRam(i);
			this.updateServerList(ns, i, totalAvailableRam);
		}
		ns.print(`Handled empty servers, totalAvailableRam: ${totalAvailableRam}`);
	}

	handlePartiallyUsedServers(ns) {
		for (const i of this.checkList) {
			let availableRam = ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
			if (i == "home" && ns.getServerMaxRam(i) > 1024) {
				availableRam = (ns.getServerMaxRam(i) * 0.9) - ns.getServerUsedRam(i);
			}

			if (availableRam > 2) {
				this.updateServerList(ns, i, availableRam);
			}
		}
		ns.print(`Handled partially used servers`);
	}

	handleFullServers(ns) {
		for (const i of this.checkList) {
			let availableRam = ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
			if (i == "home" && availableRam < ns.getServerMaxRam(i) * 0.9 && ns.getServerMaxRam(i) > 1024) {
				continue;
			}
			else if (i == "home") {
				this.serverList.push([i, availableRam * 0.9]);
			}
			else {
				this.serverList.push([i, availableRam]);
			}
		}
		ns.print(`Handled full servers`);
	}

	updateServerList(ns, serverName, totalAvailableRam) {
		if (serverName == "home" && totalAvailableRam > 1024) {
			this.serverList.push([serverName, totalAvailableRam * 0.9]);
		}
		else {
			this.serverList.push([serverName, totalAvailableRam]);
		}
		ns.print(`Updated server list, serverName: ${serverName}, totalAvailableRam: ${totalAvailableRam}`);
	}
}

/** @param {NS} ns **/
export async function main(ns) {
	let ramNeeded = 10;
	ns.print(`Processing RAM needed: ${ramNeeded}`);
	try {
		const serverObject = new ServerObject(ns, ramNeeded);
		ns.print(serverObject.serverList);
		ns.clearPort(4);
		ns.tryWritePort(4, JSON.stringify(serverObject.serverList));
	}
	catch (ex) {
		ns.print(`Exception: ${ex}, Timestamp: ${Date.now()}`);
	}
}
