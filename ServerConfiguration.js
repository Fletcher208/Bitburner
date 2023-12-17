/** @param {NS} ns */
export async function main(ns) {
	//Server configuration
	class ServerConfig {
		constructor(ns, ServerHost) {
			this.serverHost = ServerHost;
			this.serverMaxRam = 0;
			this.serverUsedRam = 0;
			this.serverAvailableRam = 0;
			this.serverAdminRights = false;
			this.serverHasContracts = false;
			this.serverMinDifficulty = 0;
			this.serverDifficulty = 0;
			this.serverMaxMoney = 0;
			this.serverGrowth = 0;
			this.serverRequiredHacking = 0;
			this.serverHackAnalyze = 0;
			this.serverGrowthAnalyze = 0;
			this.serverWeakenAnalyzeHack = 0;
			this.serverWeakenAnalyzeGrowth = 0;
			this.serverHackAnalyzeSecurity = 0;
			this.serverGrowthAnalyzeSecurity = 0;
			this.serverHackTime = 0;
			this.serverGrowTime = 0;
			this.serverWeakenTime = 0;
			this.serverBatchRamCost = 0;
			this.serverHackValue = 0;



			this.serverMaxRam = ns.getServer(this.serverHost).maxRam;
			this.serverUsedRam = ns.getServer(this.serverHost).usedRam;
			this.serverAvailableRam = this.serverMaxRam - this.serverUsedRam;
			this.serverAdminRights = ns.getServer(this.serverHost).hasAdminRights;
			this.serverMinDifficulty = ns.getServer(this.serverHost).minDifficulty;
			this.serverDifficulty = ns.getServer(this.serverHost).hackDifficulty;
			this.serverMaxMoney = ns.getServer(this.serverHost).moneyMax;
			this.serverGrowth = ns.getServer(this.serverHost).serverGrowth;
			this.serverRequiredHacking = ns.getServer(this.serverHost).requiredHackingSkill;
			this.serverHackAnalyze = Math.ceil(Math.max(0.95 / ns.hackAnalyze(this.serverHost)),1);
			if (ns.getServer(this.serverHost).cpuCores > 0 && this.serverGrowth >= 1 && this.serverMaxMoney >= 1) {
				this.serverGrowthAnalyze = Math.ceil(Math.max(ns.growthAnalyze(this.serverHost, this.serverMaxMoney / (this.serverMaxMoney * 0.05), ns.getServer(this.serverHost).cpuCores),1));
				this.serverGrowthAnalyzeSecurity = Math.ceil(ns.growthAnalyzeSecurity(this.serverGrowthAnalyze, this.serverHost, ns.getServer(this.serverHost).cpuCores));
			}
			else if (this.serverGrowth >= 1 && this.serverMaxMoney >= 1) {
				this.serverGrowthAnalyze = Math.ceil(Math.max(ns.growthAnalyze(this.serverHost, this.serverMaxMoney / (this.serverMaxMoney * 0.05)),1));
				this.serverGrowthAnalyzeSecurity = Math.ceil(ns.growthAnalyzeSecurity(this.serverGrowthAnalyze, this.serverHost));
			}
			this.serverHackAnalyzeSecurity = ns.hackAnalyzeSecurity(this.serverHackAnalyze, this.serverHost);
			this.serverWeakenAnalyzeHack = Math.ceil(Math.max((this.serverHackAnalyzeSecurity + this.serverDifficulty - this.serverMinDifficulty) / ns.weakenAnalyze(1),1));
			this.serverWeakenAnalyzeGrowth = Math.ceil(Math.max((this.serverGrowthAnalyzeSecurity + this.serverDifficulty - this.serverMinDifficulty) / ns.weakenAnalyze(1),1));
			this.serverBatchRamCost = Math.ceil(this.serverHackAnalyze * 1.7 + this.serverGrowthAnalyze * 1.75 + this.serverWeakenAnalyzeHack * 1.75 + this.serverWeakenAnalyzeGrowth * 1.75);
			this.serverWeakenTime = ns.getWeakenTime(this.serverHost);
			this.serverHackTime = this.serverWeakenTime - ns.getHackTime(this.serverHost);
			this.serverGrowTime = this.serverWeakenTime - ns.getGrowTime(this.serverHost);
			this.serverHackValue = (this.serverMaxMoney * this.serverGrowth) / (this.serverWeakenTime + this.serverGrowTime + this.serverHackTime);
			if (ns.ls(this.serverHost, ".cct").length > 0) {
				return this.serverHasContract = true;
			}
			else {
				return this.serverHasContract = false;
			}



		}
	}

	

	let serverList = JSON.parse(ns.peek(1));
	let serverConstructedList = [];
	try {

	for (const i of serverList) {
		const serverConfig = new ServerConfig(ns, i);
		ns.print(serverConfig);
		serverConstructedList.push(serverConfig);
	}
	ns.clearPort(2);
	ns.tryWritePort(2, JSON.stringify(serverConstructedList));

	}
	catch (ex) {
		ns.print(ex, " ", Date.now());
	}



}