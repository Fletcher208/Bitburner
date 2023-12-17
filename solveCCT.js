/** @param {NS} ns **/
export async function main(ns, server, contract) {

	ns.clearLog();
	
	ns.disableLog("ALL");
	let serverList = JSON.parse(ns.peek(2));

	//Adds all servers to serverList


	
		for (let i = 0; i < serverList.length; i++) {
			if (!serverList[i].serverHasContract) {
				continue;
			}
			let server = serverList[i].serverHost;
			let cctList = ns.ls(server, ".cct");

			for (let x = 0; x < cctList.length; x++) {
				let contract = cctList[x];
				let title = ns.codingcontract.getContractType(contract, server);
				if(title == "Compression II: LZ Decompression"){
					ns.tail();
					ns.print(contract, server);
					break;
				}
				let ans = await solve(server, contract, title);
				if (String(ans).includes("No solution")) {
					ns.print(ans + ' for ' + title + ' on ' + server);
				} else {
					let atmp = ns.codingcontract.attempt(ans, contract, server, { returnReward: true });
					if (atmp == '') {
						ns.alert("Failed CCT: " + title + ' on ' + server);
						ns.scriptKill('solveCCT', "home");
					} else {
						ns.print(title + ' ' + atmp);
					}
				}
			}

		}
	


	function solve(server, cct, title) {
		let data = ns.codingcontract.getData(cct, server);

		if (title == "Find Largest Prime Factor") {
			let n = data;
			let i = 2;
			while (i <= n) {
				if (n % i == 0) {
					n /= i;
				} else {
					i++;
				}
			}
			return i;
		}

		if (title == "Algorithmic Stock Trader I") {
			let maxProfit = 0;
			let days = data.length;
			for (let i = 0; i < days - 2; i++) {
				let day = data[i];
				for (let j = i + 1; j < days; j++) {
					if (data[j] - data[i] > maxProfit) {
						maxProfit = data[j] - data[i];
					}
				}
			}
			return maxProfit;
		}

		if (title == "Algorithmic Stock Trader II") {
			let totalProfit = 0;
			let days = data.length;
			for (let i = 0; i < days - 1; i++) {
				let day = data[i];
				let nextDay = data[i + 1];
				if (nextDay - day > 0) {
					totalProfit += nextDay - day;
				}
				else {
					continue;
				}
			}
			return totalProfit;
		}

		if (title == "Algorithmic Stock Trader III") {
			let maxProfit = 0;
			let txCount = 2;
			let prices = data;
			let dayCount = prices.length;

			if (txCount > dayCount / 2) { // You can trade every day so its just AST2
				for (let i = 1; i < dayCount; ++i) {
					maxProfit += Math.max(prices[i] - prices[i - 1], 0);
				}
			}
			else { // Its not lmao
				const hold = [];
				const trade = [];

				for (let i = 0; i <= txCount; ++i) {
					hold[i] = Number.MIN_SAFE_INTEGER;
					trade[i] = 0;
				}

				let dayPrice;
				for (let i = 0; i < dayCount; ++i) {
					dayPrice = prices[i];
					for (let j = txCount; j > 0; --j) {
						trade[j] = Math.max(trade[j], hold[j] + dayPrice);
						hold[j] = Math.max(hold[j], trade[j - 1] - dayPrice);
					}
				}
				maxProfit = trade[txCount];
			}
			return maxProfit;
		}

		if (title == "Algorithmic Stock Trader IV") {
			let maxProfit = 0;
			let txCount = data[0];
			let prices = data[1];
			let dayCount = prices.length;

			if (txCount > dayCount / 2) { // You can trade every day so its just AST2
				for (let i = 1; i < dayCount; ++i) {
					maxProfit += Math.max(prices[i] - prices[i - 1], 0);
				}
			}
			else { // Its not lmao
				const hold = [];
				const trade = [];

				for (let i = 0; i <= txCount; ++i) {
					hold[i] = Number.MIN_SAFE_INTEGER;
					trade[i] = 0;
				}

				let dayPrice;
				for (let i = 0; i < dayCount; ++i) {
					dayPrice = prices[i];
					for (let j = txCount; j > 0; --j) {
						trade[j] = Math.max(trade[j], hold[j] + dayPrice);
						hold[j] = Math.max(hold[j], trade[j - 1] - dayPrice);
					}
				}
				maxProfit = trade[txCount];
			}
			return maxProfit;
		}

		if (title == "Merge Overlapping Intervals") {
			data = data.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1] }); // Sort that bitch
			let output = [], last;

			data.forEach(function (r) {
				if (!last || r[0] > last[1])
					output.push(last = r);
				else if (r[1] > last[1])
					last[1] = r[1];
			});
			return output;
		}

		if (title == "Unique Paths in a Grid I") {
			let cols = data[0];
			let rows = data[1];
			let paths = reduce(cols, rows);

			function reduce(x, y) {
				if (Math.min(x, y) <= 1) { // 1 path for a line
					return 1;
				}
				else {
					return reduce(x - 1, y) + reduce(x, y - 1); // Paths for going right + going down				
				}
			}
			return paths;
		}

		if (title == "Unique Paths in a Grid II") {
			let cols = data[0].length;
			let rows = data.length;
			let paths = reduce(rows - 1, cols - 1);

			function reduce(x, y) {
				if (x < 0 || y < 0 || data[x][y] == 1) { // A wall, no path
					return 0;
				}
				else if (x == 0 && y == 0) { // At the goal
					return 1;
				}
				else {
					return reduce(x - 1, y) + reduce(x, y - 1); // Paths for going Up + going Left				
				}
			}
			return paths;
		}

		if (title == "Array Jumping Game") {
			let ans = 0;
			let tarPos = data.length - 1;
			jump(0);

			function jump(x) {
				//ns.print("jump at pos " + x + " value " + data[x]);
				for (let i = x + data[x]; i > x; i--) { // Check each number in range in decending order
					if (x + i >= tarPos) { // it hits the end
						ans = 1;
						break;
					}
					else {
						jump(x + i);
						if (ans == 1) {
							break;
						}
					}
				}
			}
			return ans;
		}

		if (title == "Total Ways to Sum") {
			let sumTotal = 0;
			sum(data, data - 1);
			function sum(x, cap) {
				if (x == 0) {
					sumTotal++;
					return;
				}
				for (let i = Math.min(x, cap); i > 0; i--) {
					sum(x - i, i);
				}
			}
			return sumTotal;
		}

		if (title == "Subarray with Maximum Sum") {
			let sumTotal = 0;
			let len = data.length;

			for (let i = 0; i < len; i++) { // Start pos
				let startPos = data[i];
				for (let j = i; j < len; j++) { // End pos
					let sum = 0;
					for (let k = i; k <= j; k++) { // Add each number from i to j
						sum += data[k];
					}
					startPos = Math.max(sum, startPos);
				}
				sumTotal = Math.max(sumTotal, startPos);
			}
			return sumTotal;
		}

		if (title == "Sanitize Parentheses in Expression") {

			let left = 0;
			let right = 0;
			const res = [];

			for (let i = 0; i < data.length; ++i) {
				if (data[i] === "(") {
					++left;
				} else if (data[i] === ")") {
					left > 0 ? --left : ++right;
				}
			}
			dfs(0, 0, left, right, data, "", res);

			function dfs(pair, index, left, right, s, solution, res) {
				if (s.length === index) {
					if (left === 0 && right === 0 && pair === 0) {
						for (let i = 0; i < res.length; i++) {
							if (res[i] === solution) {
								return;
							}
						}
						res.push(solution);
					}
					return;
				}
				if (s[index] === "(") {
					if (left > 0) {
						dfs(pair, index + 1, left - 1, right, s, solution, res);
					}
					dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
				} else if (s[index] === ")") {
					if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
					if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
				} else {
					dfs(pair, index + 1, left, right, s, solution + s[index], res);
				}
			}
			return res;
		}

		if (title == "Generate IP Addresses") {
			let ipArray = [];

			for (let i = 1; i < 4; i++) {
				let sub1 = data.slice(0, i) + '.' + data.slice(i); // Place first dot
				for (let j = i + 2; j < i + 5; j++) {
					let sub2 = sub1.slice(0, j) + '.' + sub1.slice(j); // Place second dot
					for (let k = j + 2; k < j + 5; k++) {
						let sub3 = sub2.slice(0, k) + '.' + sub2.slice(k); // Place third dot
						for (let l = 0; l < 4; l++) { // Check each octet
							let octet = sub3.split('.')[l];
							if (octet <= 255 && octet.length < 4 && (octet[0] != 0 || parseInt(octet) == 0)) {
								if (l == 3) { // last octet is good
									ipArray.push(sub3);
								}
								continue; // This octet is fine, keep checking
							}
							else { break; } // One bad octet = bad IP address
						}
					}
				}
			}
			return ipArray;
		}

		if (title == "Find All Valid Math Expressions") {
			const num = data[0];
			const target = data[1];

			function helper(res, path, num, target, pos, evaluated, multed) {
				if (pos === num.length) {
					if (target === evaluated) {
						res.push(path);
					}
					return;
				}
				for (let i = pos; i < num.length; ++i) {
					if (i != pos && num[pos] == "0") { // No leading 0's allowed unless it == 0
						break;
					}
					const cur = parseInt(num.substring(pos, i + 1));

					if (pos === 0) {
						helper(res, path + cur, num, target, i + 1, cur, cur);
					} else {
						helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
						helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
						helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
					}
				}
			}
			const result = [];
			helper(result, "", num, target, 0, 0, 0);
			return result;
		}

		if (title == "Minimum Path Sum in a Triangle") {
			let sum = delta(0, 0);

			function delta(level, pos) {
				if (level + 1 < data.length) {
					return data[level][pos] + Math.min(delta(level + 1, pos), delta(level + 1, pos + 1));
				}
				else {
					return data[level][pos];
				}
			}
			return sum;
		}

		if (title == "Spiralize Matrix") {
			let w = data[0].length;
			let h = data.length;
			let ans = [];
			let rx = w - 1; // right column
			let lx = 0; // left column
			let ty = 0; // top row
			let by = h - 1; // bottom row

			while (ans.length < w * h) {
				// right
				for (let i = lx; i <= rx; i++) {
					ans.push(data[ty][i]);
				}
				ty++;
				//down
				for (let i = ty; i <= by; i++) {
					ans.push(data[i][rx]);
				}
				rx--;
				//left
				for (let i = rx; i >= lx; i--) {
					ans.push(data[by][i]);
				}
				by--;
				//up
				for (let i = by; i >= ty; i--) {
					ans.push(data[i][lx]);
				}
				lx++;
			}
			ans.splice(w * h);// In case of 1 * x matricies
			return ans;
		}

		else {
			return "No solution";
		}

	}



}