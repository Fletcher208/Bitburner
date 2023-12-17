/** @param {NS} ns **/

import { ServerObject } from "./Version1/purchasedServerRam.js";
export async function main(ns) {


	let serverObject = new ServerObject(ns,100);

	ns.alert(serverObject);
}