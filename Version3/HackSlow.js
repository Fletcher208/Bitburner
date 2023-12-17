/** @param {NS} ns */
export async function main(ns) {

	let batch = JSON.parse(ns.peek(6));
	let serverList = JSON.parse(ns.peek(7));
	for (const i of JSON.parse(ns.peek(3))) {
		serverList.push(i);
	}
	//serverList.push();
	serverList.push("home");
	ns.print(serverList);
	//ns.tail();

	ns.disableLog('ALL');
	try {
		for (let i = 0; i < batch.script.length; i++) {

			let threadCost = 0;
			let threads = 1;
			if (batch.script[i] == "HackScript.js") {
				threadCost = 1.7;
			}
			else {
				threadCost = 1.75;
			}

			while (batch.threads[i] > 0) {
				let j = 0;
				let serverAvailble = false;
				loop2:
				while (!serverAvailble) {

					for (j = 0; j < serverList.length; j++) {
						let availableRam = ns.getServerMaxRam(serverList[j]) - ns.getServerUsedRam(serverList[j]);
						if (availableRam > threadCost) {
							serverAvailble = true;
							threads = Math.min(Math.floor(availableRam / threadCost), batch.threads[i]);
							batch.threads[i] -= threads
							break loop2;
						}


					}

					await ns.sleep(500);

				}
				if (threads == 0) {
					threads = 1;
				}
				ns.exec(batch.script[i], serverList[j], threads, batch.target, 0, ns.getTimeSinceLastAug());
				await ns.sleep(100);
			}

		}
	}
	catch (ex) {
		ns.tail();
		ns.print(ex, " catch");
	}

}