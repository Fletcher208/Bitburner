/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    var scanTargetsNew = [];
    var scanTargets = ns.scan("home");
    const hackScript = "hackScript.js";
    const growScript = "growScript.js";
    const weakenScript = "weakenScript.js";
    var scriptID = 0;
    var serverRamOptions = [];
    var ramTier = 2;
    var totalServerRam = 0;
    var highestRamServer = 0;
    
    for (var i = 0; i < ns.getPurchasedServers().length; i++) {
        if (highestRamServer < ns.getServerMaxRam(ns.getPurchasedServers()[i])) {
            highestRamServer = ns.getServerMaxRam(ns.getPurchasedServers()[i]);
        }

    }
    
    for (var i = 0; i <= 20; i++) {
        serverRamOptions.push(Math.pow(2, i));
        if (Math.pow(2, ramTier) < highestRamServer) {
            ramTier++;
        }
    }

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
    
    while (true) {
        var purchasedServerList = ns.getPurchasedServers();
        purchasedServerList.push("home");

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

        // find good hacking targets
        var hackList = [];
        var hackingValue = 0;
        for (var i = 0; i < scanTargets.length; i++) {
            try {
                if (ns.getServer(scanTargets[i]).moneyMax != 0 && ns.getServer(scanTargets[i]).serverGrowth > 1) {
                    hackingValue = (ns.getServerMaxMoney(scanTargets[i]) * ns.getServerGrowth(scanTargets[i])) / (ns.getWeakenTime(scanTargets[i]) + ns.getGrowTime(scanTargets[i]) + ns.getHackTime(scanTargets[i]));
                    if (!hackList.includes(scanTargets[i]) && ns.hasRootAccess(scanTargets[i])) {
                        hackList.push([scanTargets[i], hackingValue]);
                    }
                }
            }
            catch (err) {
                ns.alert(err + " " + scanTargets[i].toString() + " " + ns.getServer(scanTargets[i]).moneyMax.toString());
            }
        }

        hackList.sort((a, b) => b[1] - a[1]);

        //splice to top 5
        for (var i = 0; i < hackList.length; i++) {

            if (i > 5) {

                hackList.splice(i);
            }
        }
        //ns.print(hackList);

        var hackTargetArr = [];
        for (var i = 0; i < purchasedServerList.length; i++) {
            for (var j = 0; j < hackList.length; j++) {

                //hack
                try {
                    var hackChance = ns.hackAnalyzeChance(hackList[j][0]);
                    var hackThreadCount = 1;
                    var threadsCalculated = 1;
                    while (true) {

                        if (ns.hackAnalyze(hackList[j][0]) * ns.getServerMaxMoney(hackList[j][0]) * threadsCalculated < ns.getServerMaxMoney(hackList[j][0]) * 0.90 && ns.hackAnalyze(hackList[j][0]) != 0) {
                            hackThreadCount = threadsCalculated;

                        }
                        else {
                            break;
                        }
                        threadsCalculated += 5;
                    }
                    hackThreadCount *= (1 - hackChance + 1);
                    var hackTime = ns.getHackTime(hackList[j][0]);
                    hackTargetArr.push([hackScript, purchasedServerList[i], hackThreadCount, hackList[j][0], hackTime]);

                } catch (err) {

                    ns.alert(err + "hack issue" + purchasedServerList[i] + " " + hackList[j][0]);
                    ns.killall();
                }

                //grow
                try {

                    var growBy = ns.getServerMaxMoney(hackList[j][0]) / (ns.getServerMaxMoney(hackList[j][0]) * 0.15);
                    var growTime = ns.getGrowTime(hackList[j][0]);
                    var growThreadCount = ns.growthAnalyze(hackList[j][0], growBy);
                    hackTargetArr.push([growScript, purchasedServerList[i], growThreadCount, hackList[j][0], growTime]);

                } catch (err) {

                    ns.alert(err + "grow issue" + purchasedServerList[i] + " " + hackList[j][0]);
                    ns.killall();
                }

                //weaken
                // weaken removes 0.05 security per thread
                try {

                    var hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadCount);
                    var growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadCount);
                    var weakenThreads = (hackSecurityIncrease + growSecurityIncrease + ns.getServerSecurityLevel(hackList[j][0]) - ns.getServerMinSecurityLevel(hackList[j][0])) / 0.05;
                    var weakenTime = ns.getWeakenTime(hackList[j][0]);

                    hackTargetArr.push([weakenScript, purchasedServerList[i], weakenThreads, hackList[j][0], weakenTime]);


                } catch (err) {

                    ns.alert(err + "weaken issue");
                    ns.killall();
                }
                await serverBuySell();
                await hackTarget();
            }
            scriptID++;
        }


        async function allUsedServerRam(hostName) {
            var totalUsedRam = 0;

            for (var i = 0; i < hostName.length; i++) {
                totalUsedRam += ns.getServerUsedRam(hostName[i]);
            }

            return totalUsedRam;
        }

        async function hackTarget() {
            if(purchasedServerList.includes("home") == false){
                purchasedServerList.push("home");
            }


            for (var i = hackTargetArr.length - 1; i >= 0; i--) {
                var removeSleepTime = 0;

                for (var j = 0; j < purchasedServerList.length; j++) {
                    try {
                        var usedServerRam = await allUsedServerRam(purchasedServerList);

                        if (hackTargetArr[i][0] == hackScript && i + 2 < hackTargetArr.length) {
                            var sleepTime = Math.ceil(hackTargetArr[i + 2][4] - hackTargetArr[i][4] + 150);
                        } else if (hackTargetArr[i][0] == growScript && i - 1 >= 0) {
                            var sleepTime = Math.ceil(hackTargetArr[i + 1][4] - hackTargetArr[i][4] + 100);
                        } else {
                            sleepTime = 0;
                        }
                        

                        if (sleepTime - removeSleepTime < 0) {
                            sleepTime = 0;
                            removeSleepTime = 0;
                        }

                        var availableRam = ns.getServerMaxRam(purchasedServerList[j]) - ns.getServerUsedRam(purchasedServerList[j]);
                        var totalHackRam = ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][2];
                        if (availableRam < totalHackRam) {
                            var partialThreads = Math.floor(availableRam / ns.getScriptRam(hackTargetArr[i][0], "home"));
                            if (partialThreads > 0) {
                                try {
                                    if (ns.exec(hackTargetArr[i][0], purchasedServerList[j], partialThreads, hackTargetArr[i][3], sleepTime - removeSleepTime, scriptID) == 0) {
                                        ns.print(hackTargetArr[i][0] + " " + purchasedServerList[j] + " " + partialThreads + " " + hackTargetArr[i][3] + " partial");
                                    }
                                }
                                catch (err) {
                                    ns.alert(err);
                                }
                                await ns.sleep(1);
                                hackTargetArr[i][2] -= partialThreads;
                            }
                        }
                        availableRam = ns.getServerMaxRam(purchasedServerList[j]) -  ns.getServerUsedRam(purchasedServerList[j]);
                        totalHackRam = ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][2];

                        if (availableRam > totalHackRam && hackTargetArr[i][2] > 1) {

                            if (ns.exec(hackTargetArr[i][0], purchasedServerList[j], hackTargetArr[i][2], hackTargetArr[i][3], sleepTime - removeSleepTime, scriptID) == 0) {
                                //ns.print(hackTargetArr[i][0] + " " + purchasedServerList[j]+ " " +hackTargetArr[i][2]+ " " + hackTargetArr[i][3] + " " + ns.getServerMaxRam(purchasedServerList[j]) + " " + ns.getServerUsedRam(purchasedServerList[j]) + " " + hackTargetArr[i][2] + " full")
                                ns.print(availableRam + " " + totalHackRam + " " + purchasedServerList[j]);
                            }

                            await ns.sleep(1);

                            break;
                        }
                        if (j == purchasedServerList.length) {
                            j = 0;

                        }

                        if (ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][2] > totalServerRam - usedServerRam && totalServerRam * 0.8 < usedServerRam) {
                            await ns.sleep(1000);
                            removeSleepTime += 1000;
                            // ns.print("sleep");

                        }
                    } catch (err) {

                        ns.alert(err + "execute issue " + partialThreads + " " + ns.getServerMaxRam(purchasedServerList[j]) + " " + purchasedServerList[j] + " ");
                        ns.killall();
                    }
                }

                for (var j = 0; j < scanTargets.length; j++) {

                    if (ns.fileExists("hackScript.js", scanTargets[j]) == true && scanTargets[j] != "home" && ns.getServer(scanTargets[j]).hasAdminRights) {

                        try {
                            var usedHostRam = await allUsedServerRam(scanTargets);

                            if (hackTargetArr[i][0] == hackScript && i + 2 < hackTargetArr.length) {
                                var sleepTime = Math.ceil(hackTargetArr[i + 2][4] - hackTargetArr[i][4] + 150);
                            } else if (hackTargetArr[i][0] == growScript && i - 1 >= 0) {
                                var sleepTime = Math.ceil(hackTargetArr[i + 1][4] - hackTargetArr[i][4] + 100);
                            } else {
                                sleepTime = 0;
                            }

                            if (sleepTime - removeSleepTime < 0) {
                                sleepTime = 0;
                                removeSleepTime = 0;
                            }


                            var availableRam = ns.getServerMaxRam(scanTargets[j]) - ns.getServer(scanTargets[j]).ramUsed;
                            var totalHackRam = ns.getScriptRam(hackTargetArr[i][0], "home") * hackTargetArr[i][2];
                            if (availableRam < totalHackRam) {
                                var partialThreads = Math.floor(availableRam / ns.getScriptRam(hackTargetArr[i][0], "home"));
                                if (partialThreads > 0) {
                                    try {
                                        if (ns.exec(hackTargetArr[i][0], scanTargets[j], partialThreads, hackTargetArr[i][3], sleepTime - removeSleepTime, scriptID) == 0) {
                                            ns.print(hackTargetArr[i][0] + " " + scanTargets[j] + " " + partialThreads + " " + hackTargetArr[i][3] + " partial");
                                        }
                                    }
                                    catch (err) {
                                        ns.alert(err);
                                    }
                                    await ns.sleep(1);
                                    hackTargetArr[i][2] -= partialThreads;
                                }
                            }


                            if (availableRam > totalHackRam && hackTargetArr[i][2] > 1) {

                                if (ns.exec(hackTargetArr[i][0], scanTargets[j], hackTargetArr[i][2], hackTargetArr[i][3], sleepTime - removeSleepTime, scriptID) == 0) {
                                    //ns.print(hackTargetArr[i][0] + " " + purchasedServerList[j]+ " " +hackTargetArr[i][2]+ " " + hackTargetArr[i][3] + " " + ns.getServerMaxRam(purchasedServerList[j]) + " " + ns.getServerUsedRam(purchasedServerList[j]) + " " + hackTargetArr[i][2] + " full")
                                    ns.print(availableRam + " " + totalHackRam);
                                }

                                await ns.sleep(1);

                                break;
                            }
                            if (j == scanTargets.length) {
                                j = 0;

                            }
                        } catch (err) {

                            ns.alert(err + "execute issue " + partialThreads + " " + ns.getServerMaxRam(scanTargets[j]) + " " + scanTargets[j] + " ");
                            ns.killall();
                        }
                    }
                }
            }
            hackTargetArr.length = 0;
        }

        async function serverBuySell() {
            var increaseRamTier = 0;
            totalServerRam = 0;
            //ns.print(ramTier + " " + serverRamOptions.length);
            if (ramTier != serverRamOptions.length) {

                for (var i = 0; i < ns.getPurchasedServerLimit(); i++) {


                    if (ns.getPurchasedServerCost(serverRamOptions[ramTier]) < ns.getPlayer().money && ns.serverExists("Pserv-" + i + "-" + serverRamOptions[ramTier]) == false && ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
                        ns.purchaseServer("Pserv-" + i + "-" + serverRamOptions[ramTier], serverRamOptions[ramTier]);
                        // ns.print("purchase");

                    }

                    for (var j = 0; j < ns.getPurchasedServers().length; j++) {
                        if (ns.getServerMaxRam(ns.getPurchasedServers()[j]) == serverRamOptions[ramTier]) {
                            increaseRamTier++;
                            //ns.print(increaseRamTier);
                        }
                    }

                    if (increaseRamTier == 25) {
                        ramTier++;
                    }


                    // ns.print(ns.getServerMaxRam(ns.getPurchasedServers()[i]) + " " + i);
                    if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit() && ns.getServerMaxRam(ns.getPurchasedServers()[i]) < serverRamOptions[ramTier]) {
                        ns.killall(ns.getPurchasedServers()[i]);
                        ns.deleteServer(ns.getPurchasedServers()[i]);
                        //ns.print("delete");

                    }
                    increaseRamTier = 0;
                }
            }

            purchasedServerList = ns.getPurchasedServers();
            purchasedServerList.push("home");


            for (var i = 0; i < purchasedServerList.length; i++) {
                if (ns.fileExists("hackScript.js", purchasedServerList[i]) == false) {

                    await ns.scp("hackScript.js", "home", purchasedServerList[i]);
                    await ns.scp("growScript.js", "home", purchasedServerList[i]);
                    await ns.scp("weakenScript.js", "home", purchasedServerList[i]);
                }
            }
            for (var i = 0; i < purchasedServerList.length; i++) {

                totalServerRam += ns.getServerMaxRam(purchasedServerList[i]);

            }
        }
    } // main loop end
}