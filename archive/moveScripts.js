/** @param {NS} ns **/
export async function main(ns) {
	var purchasedServers = ns.getPurchasedServers();
	for (var i = 0; i < purchasedServers.length; i++) {
		if (ns.fileExists("hackScript.js", purchasedServers[i]) == false && ns.args[0] == 0) {
			await ns.scp(["hackScript.js", "growScript.js", "weakenScript.js"], "home", purchasedServers[i]);
		}
		else if(ns.args[0] == 1){
			ns.killall(purchasedServers[i]);
			ns.deleteServer(purchasedServers[i]);
		}

		else if(ns.args[0] == 2){
			if(ns.getServerMaxRam(purchasedServers[i]) < Math.pow(2,20)){
				ns.killall(purchasedServers[i]);
				ns.deleteServer(purchasedServers[i]);
			}
			
		}
		
		
	}
}