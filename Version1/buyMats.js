/** @param {NS} ns **/
export async function main(ns) {
	let ag1Cities = ns.corporation.getDivision("ag1").cities
	let buyOrderArr = [ns.args[0], ns.args[1], ns.args[2], ns.args[3]];
	let materialList = ["Hardware", "Robots", "AI Cores", "Real Estate"];
	for (const i in ag1Cities) {
		for (let j = 0; j < materialList.length; j++) {
			ns.corporation.buyMaterial("ag1", i, materialList[j], buyOrderArr[j]);
		}
	}

}