/** @param {NS} ns */
export async function main(ns) {
let homeMaxRam = ns.getServerMaxRam("home") - ns.getScriptRam("solveCCT.js");
let usedRam = ns.getServerUsedRam("home");
let shareCost = ns.getScriptRam("share.js");
let threads = Math.floor((homeMaxRam - usedRam)/ shareCost);
ns.run("share.js",threads);
await ns.sleep(1000);
ns.run("solveCCT.js");
ns.toast(ns.getSharePower(),"success",10000);
}