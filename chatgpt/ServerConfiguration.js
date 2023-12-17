/** @param {NS} ns */
// add changes to weaken the server by the max amount of threads needed to hack the server. currently it weakens by current value not potential max value
export async function main(ns) {
	
	class ServerConfig {
		constructor(ns, ServerHost) {
			const serverDetails = ns.getServer(ServerHost);
			
			this.serverHost = ServerHost;
			this.serverMaxRam = serverDetails.maxRam;
			this.serverUsedRam = serverDetails.usedRam;
			this.serverAvailableRam = this.serverMaxRam - this.serverUsedRam;
			this.serverAdminRights = serverDetails.hasAdminRights;
			this.serverMinDifficulty = serverDetails.minDifficulty;
			this.serverDifficulty = serverDetails.hackDifficulty;
			this.serverMaxMoney = serverDetails.moneyMax;
			this.serverGrowth = serverDetails.serverGrowth;
			this.serverRequiredHacking = serverDetails.requiredHackingSkill;
			this.serverHackAnalyze = Math.ceil(Math.max(0.95 / ns.hackAnalyze(this.serverHost)), 1);
			
			const cpuCores = serverDetails.cpuCores;
			if (cpuCores > 0 && this.serverGrowth >= 1 && this.serverMaxMoney >= 1) {
				this.serverGrowthAnalyze = Math.ceil(Math.max(ns.growthAnalyze(this.serverHost, this.serverMaxMoney / (this.serverMaxMoney * 0.05), cpuCores), 1));
				this.serverGrowthAnalyzeSecurity = Math.ceil(ns.growthAnalyzeSecurity(this.serverGrowthAnalyze, this.serverHost, cpuCores));
			}
			else if (this.serverGrowth >= 1 && this.serverMaxMoney >= 1) {
				this.serverGrowthAnalyze = Math.ceil(Math.max(ns.growthAnalyze(this.serverHost, this.serverMaxMoney / (this.serverMaxMoney * 0.05)), 1));
				this.serverGrowthAnalyzeSecurity = Math.ceil(ns.growthAnalyzeSecurity(this.serverGrowthAnalyze, this.serverHost));
			}
			
			this.serverHackAnalyzeSecurity = ns.hackAnalyzeSecurity(this.serverHackAnalyze, this.serverHost);
			const weakenAnalyzeFactor = ns.weakenAnalyze(1,cpuCores);
			this.serverWeakenAnalyzeHack = Math.ceil(Math.max((this.serverHackAnalyzeSecurity + this.serverDifficulty - this.serverMinDifficulty) / weakenAnalyzeFactor, 1));
			this.serverWeakenAnalyzeGrowth = Math.ceil(Math.max((this.serverGrowthAnalyzeSecurity + this.serverDifficulty - this.serverMinDifficulty) / weakenAnalyzeFactor, 1));
			//ns.tprint(`Server: ${this.serverHost}, min diff: ${this.serverMinDifficulty}, Server Diff: ${this.serverDifficulty}`);
			this.serverBatchRamCost = Math.ceil(this.serverHackAnalyze * 1.7 + this.serverGrowthAnalyze * 1.75 + this.serverWeakenAnalyzeHack * 1.75 + this.serverWeakenAnalyzeGrowth * 1.75);
			
			this.serverWeakenTime = ns.getWeakenTime(this.serverHost);
			this.serverHackTime = this.serverWeakenTime - ns.getHackTime(this.serverHost);
			this.serverGrowTime = this.serverWeakenTime - ns.getGrowTime(this.serverHost);
			this.serverHackValue = (this.serverMaxMoney * this.serverGrowth) / (this.serverWeakenTime + this.serverGrowTime + this.serverHackTime);
			
			this.serverHasContract = ns.ls(this.serverHost, ".cct").length > 0;
		}
	}
	
	let serverList = JSON.parse(ns.peek(1));
	let serverConstructedList = [];
	
	for (const i of serverList) {
		try {
			const serverConfig = new ServerConfig(ns, i);
			ns.print(serverConfig);
			serverConstructedList.push(serverConfig);
		}
		catch (ex) {
			ns.print(`Error in server ${i}: ${ex} `, Date.now());
		}
	}
	
	ns.clearPort(2);
	ns.tryWritePort(2, JSON.stringify(serverConstructedList));
}
