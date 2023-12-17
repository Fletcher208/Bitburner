/** @param {NS} ns */
export async function main(ns) {

	while (true) {
		let queue = [];
		ns.print(ns.peek(10));
		try{
		if(JSON.parse(ns.peek(10)) != "NULL PORT DATA"){
			queue = JSON.parse(ns.peek(10));
		}
		}
		catch(ex){
			ns.print(ex, "\n");
			ns.clearPort(10);
		}
		
		ns.print(queue.length);
		if (queue.length == 0) {
			ns.run("PurchaseServer.js")
			ns.run("MapServers.js");
			ns.run("ServerConfiguration.js");
			await ns.sleep(50);
			ns.run("simpleHack.js")
		}
		else {
			for (const i of queue) {
				if (ns.run(i) != 0) {
					queue.splice(queue.indexOf(i));
					ns.print(queue);
				}
			}
			ns.clearPort(10);
			ns.writePort(JSON.stringify(10,queue));
			await ns.sleep(1000);
		}
	}
}