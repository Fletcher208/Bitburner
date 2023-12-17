/** @param {NS} ns */
export async function main(ns) {
	let arg = ns.args[0];
	let queue = [];
	if (JSON.parse(ns.peek(10) != "NULL PORT DATA")){
		queue = JSON.parse(ns.peek(10));
	}
	queue.push(arg);
	ns.writePort(10,JSON.stringify(queue));
}