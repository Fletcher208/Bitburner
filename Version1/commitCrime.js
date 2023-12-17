/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		ns.print(ns.getPlayer().location);
		
		
		ns.tail();

		if (!ns.isBusy() && ns.getPlayer().location == "The Slums" && ns.scriptRunning("managerHack.js", "home")) {

			ns.commitCrime("Homicide");

		} else {
			await ns.sleep(1000);
		}


	}


}