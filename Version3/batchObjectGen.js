import { ServerObject } from "CheckServerAvailability.js";
export class BatchObjectGen {

	/** @param {NS} ns **/
	constructor(ns) {

		const hackScriptRam = 1.7;
		const growScriptRam = 1.75;
		const weakenScriptRam = 1.75;
		ns.disableLog("ALL");


		/**
		 * Batch Object - used for the batchScript.js
		 * 
		 * @param script {string[]}  Script type eg hack, grow, weaken.
		 * @param host {string[]} where the script runs from.
		 * @param threads {number[]} amount of threads to the run script with.
		 * @param target {string[]} The target to run the batch sequence against.
		 * @param sleepAmount {number[]} Set the timing so the sequence finalises at the same time.
		 * @param scriptID {number[]} unique identifier.
		 * @param ramCost {number[]} how much the batch will cost.
		 */


		this.script = [];
		this.threads = [];
		this.target = "";
		this.sleepAmount = [];
		this.ramCost = 0;
		this.hosts = [];
		
		let targetList = JSON.parse(ns.peek(2));
		this.target = targetList[0];
		ns.print(this.target);

		var batch = ([hackScript(this.target), growScript(this.target), weakenScript(this.target, hackScript(this.target)[2], "HackScript.js"), weakenScript(this.target, growScript(this.target)[2], "GrowScript.js")]);

		for (let i = 0; i < batch.length; i++) {
			this.script[batch[i][0]] = batch[i][1];
			this.threads[batch[i][0]] = batch[i][2];
			this.ramCost += batch[i][3];
		}

		let serverObject = new ServerObject(ns, this.ramCost);
		this.availableServer = serverObject.availableServer;
		this.hosts = serverObject.serverList;

		this.sleepAmount[0] = 0;
		this.sleepAmount[1] = Math.ceil(ns.getWeakenTime(this.target) - ns.getGrowTime(this.target)) + 150;
		this.sleepAmount[2] = 200
		this.sleepAmount[3] = Math.ceil(ns.getWeakenTime(this.target) - ns.getHackTime(this.target)) + 250;

		let script = [];
		let threads = [];
		let sleepTime = [];
		let hosts = [];

		//ns.print(this.script.length+" ");
		let threadCost = 0;

		//ns.print(this.threads," ", batch[0]);
		for (let i = 0; i < this.hosts.length; i++) {

			let usedRam = 0;
			for (let j = 0; j < this.script.length; j++) {

				let availableRam = Math.ceil(ns.getServerMaxRam(this.hosts[i]) - ns.getServerUsedRam(this.hosts[i]) - usedRam);
				if (this.threads[j] <= 2) {
					continue;
				}
				if (availableRam <= 2) {
					break;
				}

				script.push(this.script[j])
				sleepTime.push(this.sleepAmount[j]);
				hosts.push(this.hosts[i]);

				if (this.script[j] == "HackScript.js") {
					threadCost = 1.7;
				}
				else {
					threadCost = 1.75;
				}




				if (availableRam <= this.threads[j]) {
					usedRam = availableRam;



					let threadCount = Math.floor(usedRam / threadCost) - 1;
					this.threads[j] -= threadCount;
					if (Math.floor(usedRam / threadCost) - 1 <= 0) {
						threadCount = 1;
					}
					threads.push(threadCount);
					//ns.print(this.script[j] ," ", this.hosts[i]," ",threadCount," ",this.threads[j], " ", availableRam, " if\n");

					break;
					//ns.print(usedRam, " Used ram ", threadCost, " Thread Cost " ,usedRam/threadCost);
				}
				else {
					usedRam += Math.ceil(this.threads[j] * threadCost);
					//ns.print(batch[j][3], " else batch ram");
					threads.push(Math.floor(this.threads[j] / threadCost));
					//ns.print(this.script[j] ," ", this.hosts[i]," "," ",this.threads[j], " ", availableRam , " Else\n");

					this.threads[j] = 0;

				}


				//ns.print(this.hosts[i], " ", this.script[j], " ", batch[j][3]," ",threads, " ", availableRam, " in loop");
			}
		}
		if (this.availableServer == 1) {
			//ns.print(this.hosts, " Hosts");
			this.script = script;
			this.hosts = hosts;
			this.sleepAmount = sleepTime;
			this.threads = threads;
			//ns.print(this.script,this.threads, this.hosts, this.sleepAmount ," available server  true")
		}

		//ns.print(script, threads,hosts, sleepTime," final print");


		function hackScript(target) {
			var index = 3;
			var script = "HackScript.js";
			var threads = Math.ceil(0.95 / ns.hackAnalyze(target));
			var ramCost = Math.floor(threads * hackScriptRam);
			var hackScriptArr = [index, script, threads, ramCost];
			//ns.print(hackScriptArr," hackscript", target, threads, ns.hackAnalyze(target));
			return hackScriptArr;
		}

		function growScript(target) {
			let index = 1;
			let script = "GrowScript.js";
			let growBy = ns.getServer(target).moneyMax / (ns.getServer(target).moneyMax * 0.05);
			let threads = Math.ceil(ns.growthAnalyze(target, growBy, ns.getServer(target).cpuCores));
			let ramCost = Math.floor(threads * growScriptRam);
			let growScriptArr = [index, script, threads, ramCost];

			return growScriptArr;
		}
		ns.formulas.hacking.growPercent

		function weakenScript(target, analyzeThreads, script) {
			let thisScript = "WeakenScript.js";
			let securityIncrease = 0;
			let index = 0;
			//ns.print(analyzeThreads);
			if (script == "HackScript.js") {
				index = 0;
				securityIncrease = ns.hackAnalyzeSecurity(analyzeThreads, target);
				//ns.print("hack");
			}
			if (script == "GrowScript.js") {
				index = 2;
				securityIncrease = ns.growthAnalyzeSecurity(analyzeThreads);
				//ns.print("grow" + index + " " + securityIncrease);
			}

			let threads = Math.ceil((securityIncrease + ns.getServer(target).hackDifficulty - ns.getServer(target).minDifficulty) / ns.weakenAnalyze(1));
			let ramCost = Math.floor(threads * weakenScriptRam);
			let weakenScriptArr = [index, thisScript, threads, ramCost];

			return weakenScriptArr;

		}
	}
}