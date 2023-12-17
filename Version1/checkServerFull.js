/** @param {NS} ns **/
export async function main(ns) {

	var totalUsedRam = 0;
	var totalServerRam = 0;

		for (const i of ns.getPurchasedServers()) {
			totalUsedRam += ns.getServer(i).ramUsed;
		}

		for (const i of ns.getPurchasedServers()) {

			totalServerRam += ns.getServer(i).maxRam;
			
		}

		if(totalServerRam*0.95 < totalUsedRam){
			ns.clearPort(4);
			await ns.tryWritePort(4,1);
		}
		else{
			ns.clearPort(4);
			await ns.tryWritePort(4,0);
		}

}