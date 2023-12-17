import { BatchObjectGen } from "batchObjectGen.js";
/** @param {NS} ns **/
export async function main(ns) {



	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("ALL");
	//ns.tail();



	await finalBatch();




	// function declerations

	/**
	 * run the batch script WGWH weaken grow weaken hack 
	 * script, host, threads, target, sleepAmount, scriptID
	 * 
	 * @param {object} batchObject - 
	 */
	async function finalBatch() {

		//try {

		while (true) {
			let batchObject = new BatchObjectGen(ns);
			//ns.print(ns.peek(2));
			//ns.tail();
			//ns.print(batchObject.script[0],batchObject.script[1],batchObject.script[2],batchObject.script[3])
			
			
			ns.print(batchObject);
			if (batchObject.availableServer == 1 && batchObject.hosts.length > 1) {
				try {
					ns.print("while");
					for (let j = 0; j < batchObject.script.length; j++) {
						

						let pid = Date.now() + Math.random();
						ns.exec(batchObject.script[j], batchObject.hosts[j], Math.floor(batchObject.threads[j]), batchObject.target, batchObject.sleepAmount[j], pid);
						//if (execPID == 0) {
						//	ns.print(batchObject.script[j] + " " + batchObject.hosts[j] + " " + batchObject.threads[j] + " " + batchObject.target + " " + batchObject.sleepAmount[j]);
						//	ns.print(ns.getServerUsedRam(batchObject.hosts[j]), " ", ns.getServerMaxRam(batchObject.hosts[j]), " ", batchObject.threads[j] * 1.75, " threads");

						//	await ns.sleep(10000);
						//}


						//if (execPID == ns.getRunningScript(execPID)) {
						//	ns.print(pid, " already exists");
						//}


					}
				}
				catch (ex) {
					ns.tail();
					ns.print(ex);
				}

			}
			else if (batchObject.availableServer == 1 && batchObject.hosts.length == 1) {
				let pid = Date.now() + Math.random();
				try{
				ns.exec(batchObject.script[0], batchObject.hosts[0], Math.floor(batchObject.threads[0]), batchObject.target, batchObject.sleepAmount[0], pid);
				ns.exec(batchObject.script[1], batchObject.hosts[1], Math.floor(batchObject.threads[1]), batchObject.target, batchObject.sleepAmount[1], pid);
				ns.exec(batchObject.script[2], batchObject.hosts[2], Math.floor(batchObject.threads[2]), batchObject.target, batchObject.sleepAmount[2], pid);
				ns.exec(batchObject.script[3], batchObject.hosts[3], Math.floor(batchObject.threads[3]), batchObject.target, batchObject.sleepAmount[3], pid);
				}
				catch(ex){
					await ns.sleep(1000);
					ns.print(ex);
				}
				

			}
			else if (batchObject.availableServer == 0) {
				ns.print("start hackslow");
				ns.clearPort(6);
				ns.clearPort(7);
				await ns.tryWritePort(6, JSON.stringify(batchObject));
				await ns.tryWritePort(7, JSON.stringify(ns.getPurchasedServers()));
				if (ns.scriptRunning("HackSlow.js", ns.getHostname()) == false) {

					ns.print(ns.exec("HackSlow.js", "home", 1));
				}

				break;
			}
			else {
				break;
			}
			await ns.sleep(0.1);
		}
	}
}