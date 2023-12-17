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
		//ns.disableLog("getServerMaxRam");
		//ns.disableLog("getServerUsedRam");
		//ns.print(ns.getPurchasedServers());
		let checkList = ns.getPurchasedServers();
		checkList.push("home");

		let totalAvailableRam = 0;
		for (const i of checkList) {

			maxServerRam += ns.getServerMaxRam(i);
			if (ns.getServerMaxRam(i) - ns.getServerUsedRam(i) == ns.getServerMaxRam(i)) {
				emptyServerMaxRam += ns.getServerMaxRam(i);
				emptyServer.push(i);
			}
			
			this.maxRam += ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
			
		}
		//ns.print(emptyServerMaxRam," ", this.ramNeeded, " ", maxServerRam," checkServerAvailable" );
		if (emptyServerMaxRam > this.ramNeeded) {
			//ns.print("if 34");
			for (const i of emptyServer) {
				totalAvailableRam += ns.getServerMaxRam(i);
				if(i == "home" && ns.getServerMaxRam(i) > 1024){
					this.serverList.push([i, ns.getServerMaxRam(i)*0.9]);
				}
				else if (this.ramNeeded < totalAvailableRam) {
					this.serverList.push([i, ns.getServerMaxRam(i)]);
					break;
				}
				else {
					this.serverList.push([i, ns.getServerMaxRam(i)]);
				}
				//ns.print(i);
			}
		}
		else if (this.maxRam > this.ramNeeded) {
			//ns.print("else if 48");
			for (const i of checkList) {
				
				this.availableRam = ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
				if(i == "home" && ns.getServerMaxRam(i) > 1024){
					this.availableRam = (ns.getServerMaxRam(i)*0.9) - ns.getServerUsedRam(i);
				}
				totalAvailableRam += this.availableRam;
				//ns.print(this.availableRam, " available Ram " , i," ", this.ramNeeded, " ", totalAvailableRam);
				if (this.availableRam > 2) {
					
					if (this.ramNeeded < totalAvailableRam) {
						this.serverList.push([i, this.availableRam]);
						//ns.print("line 58", this.serverList, "\n");
						break;
					}
					else {
						this.serverList.push([i, this.availableRam]);
					}
				}
				//ns.print(this.serverList, "\n");
			}
		}

		else {
			//ns.print("else 66");
			this.availableServer = 0;
			for (const i of checkList) {

				this.availableRam = ns.getServerMaxRam(i) - ns.getServerUsedRam(i);
				if(i == "home" && this.availableRam < ns.getServerMaxRam(i) * 0.9  && ns.getServerMaxRam(i) > 1024){
					continue;
				}
				else if(i == "home"){
					this.serverList.push([i, this.availableRam*0.9]);
				}
				this.serverList.push([i, this.availableRam]);
			}

		}
	}




}
export async function main(ns) {

	let ramNeeded = JSON.parse(ns.peek(3));
	try {


		const serverObject = new ServerObject(ns, ramNeeded);
		ns.print(serverObject.serverList);


		ns.clearPort(4);
		ns.tryWritePort(4, JSON.stringify(serverObject.serverList));

	}
	catch (ex) {
		ns.print(ex, " ", Date.now());
	}
}