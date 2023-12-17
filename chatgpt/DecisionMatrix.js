/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
	//ns.tail();
    let currentState = getCurrentState(ns);
    let decision = makeDecision(ns, currentState);
		

    // Write the decision to a port so that other scripts can read it
    ns.writePort(20, JSON.stringify(decision));
}

function getCurrentState(ns) {
    // Gather information about the current state of the game
    let state = {
        money: ns.getPlayer().money,
        hackingLevel: ns.getHackingLevel(),
				gameStateInformation: JSON.parse(ns.peek(2))
        // ... add other relevant information here ...
    };
    return state;
}

function makeDecision(ns, state) {
    // Determine the best strategy based on the current state

    // By default, do nothing
    let decision = "doNothing";

		if(checkHackTargetHackLevel(ns, state)){
			decision = "saveMoney";
		}

    return decision;
}
/** @param {NS} ns */
function checkHackTargetHackLevel(ns, state){
	let hackValueInfo = state.gameStateInformation.sort((a, b) => b.serverHackValue - a.serverHackValue);
	ns.print(hackValueInfo);
	for(let i of hackValueInfo){
		//ns.print(i, " " + i.serverRequiredHacking);
		if(i.serverHost != "n00dles"){
			return 0;
		}
		if(state.hackingLevel >= i.serverRequiredHacking && !ns.hasRootAccess(i.serverHost)){
			//ns.tail();
			ns.print("returned true " + i.serverHost);
			return 1;
		}
	}
	return 0;
}