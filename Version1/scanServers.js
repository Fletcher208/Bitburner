/** @param {NS} ns **/
export async function main(ns) {
var scanTargetsNew = [];
var scanTargets = ns.scan("home");

 var currentLength = 0;
    while (currentLength != scanTargets.length) {
        currentLength = scanTargets.length;
        for (var i = 0; i < scanTargets.length; i++) {
            if (ns.scan(scanTargets[i]) != "home" && ns.getPurchasedServers().includes(scanTargets[i]) == false) {
                scanTargetsNew = ns.scan(scanTargets[i]);
            }

            if (scanTargetsNew != null) {
                for (var j = 0; j < scanTargetsNew.length; j++) {
                    if (scanTargets.includes(scanTargetsNew[j]) == false && ns.getPurchasedServers().includes(scanTargetsNew[j]) == false) {
                        scanTargets.push(scanTargetsNew[j]);

                    }

                }
            }
            if (ns.getPurchasedServers().includes(scanTargets[i]) == true) {
                scanTargets.splice(i);

            }
        }
    }

	for (var i = 0; i < scanTargets.length; i++) {
            try {
                if (ns.hasRootAccess(scanTargets[i]) == false && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(scanTargets[i])) {

                    if (ns.getServerNumPortsRequired(scanTargets[i]) >= 5 && ns.fileExists("sqlinject.exe", "home")) {
                        ns.sqlinject(scanTargets[i]);

                    }

                    if (ns.getServerNumPortsRequired(scanTargets[i]) >= 4 && ns.fileExists("httpworm.exe", "home")) {
                        ns.httpworm(scanTargets[i]);
                    }

                    if (ns.getServerNumPortsRequired(scanTargets[i]) >= 3 && ns.fileExists("relaysmtp.exe", "home")) {
                        ns.relaysmtp(scanTargets[i]);

                    }

                    if (ns.getServerNumPortsRequired(scanTargets[i]) >= 2 && ns.fileExists("ftpcrack.exe", "home")) {
                        ns.ftpcrack(scanTargets[i]);

                    }

                    if (ns.getServerNumPortsRequired(scanTargets[i]) >= 1 && ns.fileExists("brutessh.exe", "home")) {
                        ns.brutessh(scanTargets[i]);

                    }

                    if (ns.getServerNumPortsRequired(scanTargets[i]) >= 0 && ns.getServer(scanTargets[i]).openPortCount == ns.getServer(scanTargets[i]).numOpenPortsRequired) {
                        ns.nuke(scanTargets[i]);

                    }
                }
            }
            catch (err) {
            }
        }

		for (var i = 0; i < scanTargets.length; i++) {
            if (ns.fileExists("hackScript.js", scanTargets[i]) == false && ns.getServer(scanTargets[i]).maxRam != 0 && ns.hasRootAccess(scanTargets[i])) {

                await ns.scp("hackScript.js", "home", scanTargets[i]);
                await ns.scp("growScript.js", "home", scanTargets[i]);
                await ns.scp("weakenScript.js", "home", scanTargets[i]);
            }
        }
        ns.clearLog();
    
    var writePortArr = [JSON.stringify(scanTargets)];
    ns.clearPort(1);
	ns.print(await ns.tryWritePort(1, writePortArr));


}