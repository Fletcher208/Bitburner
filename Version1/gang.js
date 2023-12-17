/** @param {NS} ns **/
export async function main(ns) {
	let gangActivitySwitch = ns.args[0];
	let setTask = "";

	switch (gangActivitySwitch) {
		case 1:
			setTask = "Train Combat";
			break;

		case 2:
			setTask = "Terrorism";
			break;

		case 3:
			setTask = "Traffick Illegal Arms";
			break;

		case 4:
			setTask = "Territory Warfare";
			break;


	}

	for (const i of ns.gang.getMemberNames()) {

		ns.gang.setMemberTask(i, setTask);
	}

}