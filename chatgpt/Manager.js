/** @param {NS} ns */
export async function main(ns) {
	ns.print("Initializing Manager script...");
	ns.clearPort(10);
	while (true) {
		try {
			
			let decision = ns.peek(20);
			decision = (decision === "NULL PORT DATA") ? "doNothing" : JSON.parse(decision);
			let taskQueue = getTaskQueue(ns);

			ns.print(decision);

			ns.print(taskQueue.length);
			if (taskQueue.length == 0) {
				await executePrimaryTasks(ns, decision);
				await ns.sleep(50);
			} else {
				taskQueue = await executeQueuedTasks(ns, taskQueue, decision);
				ns.clearPort(10);
				ns.writePort(10, JSON.stringify(taskQueue));
				await ns.sleep(1000);
			}
		} catch (error) {
			ns.tail();
			ns.print(`Error: ${error}`);
			await ns.sleep(10000);
		}
		await ns.sleep(50);
	}
}


function getTaskQueue(ns) {
	let taskQueue = [];
	try {
		const portData = ns.peek(10);
		ns.print(portData);
		if (portData && portData !== "NULL PORT DATA") {
			taskQueue = JSON.parse(portData);
		}
	} catch (ex) {
		ns.print(ex, "\n");
		ns.clearPort(10);
	}
	return taskQueue;
}


async function executePrimaryTasks(ns, decision) {
	let scripts = ["chatgpt/purchaseServer.js", "chatgpt/MapServers.js", "chatgpt/ServerConfiguration.js", "chatgpt/BatchHack.js", "chatgpt/DecisionMatrix.js"];
	let addQueue = [];

	if (decision === "saveMoney") {
		ns.print(decision);
	}
	else if (!ns.run("chatgpt/purchaseServer.js")) {
		addQueue.push(scripts[0]);
		ns.print("purchaseServer");
	}
	if (!ns.run("chatgpt/MapServers.js")) {
		addQueue.push(scripts[1]);
		ns.print("MapServers");
	}
	if (!ns.run("chatgpt/ServerConfiguration.js")) {
		addQueue.push(scripts[2]);
		ns.print("ServerConfiguration");
	}
	await ns.sleep(50);
	if (ns.scriptRunning("chatgpt/BatchHack.js", "home")) {
		ns.print("BatchHack is already running");
	} else if (!ns.run("chatgpt/BatchHack.js")) {
		addQueue.push(scripts[3]);
		ns.print("BatchHack queued for execution");
	}
	if (!ns.run("chatgpt/DecisionMatrix.js")) {
		addQueue.push(scripts[4]);
		ns.print("DecisionMatrix");
	}

	ns.writePort(10, JSON.stringify(addQueue));

}

async function executeQueuedTasks(ns, taskQueue) {
	let failedTasks = [];
	for (const task of taskQueue) {
		await ns.sleep(50);
		if (ns.scriptRunning(task, "home")) {
			ns.print(`${task} is already running`);
		}
		else if (!ns.run(task)) {
			failedTasks.push(task);
			ns.print(taskQueue);
		}
	}
	return failedTasks;
}
