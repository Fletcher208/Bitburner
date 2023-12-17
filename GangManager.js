/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	let hackingAugs = ["BitWire","Neuralstimulator","DataJack"];
	for(const i of ns.gang.getMemberNames()){
		let upgrades = ns.gang.getMemberInformation(i).upgrades
		let missingUpgrades = [];
		for(const j of ns.gang.getEquipmentNames()){
			if(!upgrades.includes(j) && ns.gang.getEquipmentType(j) != "Rootkit"){
				missingUpgrades.push(j);
			}
		}
		
		for(const j of missingUpgrades){
			
			if(ns.gang.getEquipmentCost(j) < ns.getPlayer().money && !hackingAugs.includes(j)){
				ns.gang.purchaseEquipment(i,j);
			}
		}
		//ns.print(ns.gang.getAscensionResult(i));
		
		

		
	}
	// ns.gang.getMemberNames -
	// ns.gang.getMemberInformation -
	// ns.gang.setMemberTask
	// ns.gang.getAscensionResult
	// ns.gang.ascendMember
	// ns.gang.getEquipmentNames -
	// ns.gang.getEquipmentType -
	// ns.gang.getEquipmentCost
	// ns.gang.purchaseEquipment

}