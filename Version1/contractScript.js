/** @param {NS} ns **/
export async function main(ns) {
// attempt(answer, filename, host, opts)	Attemps a coding contract. 
// attempt(answer: string[] | number, filename: string, host?: string, opts?: CodingAttemptOptions): boolean | string;

// getContractType(filename, host)	Get the type of a coding contract.
// getContractType(filename: string, host?: string): string;

// getData(filename, host)	Get the input data.
// getData(filename: string, host?: string): any;




//#region largest prime factor contract

// Find Largest Prime Factor	
// Given a number, find its largest prime factor. A prime factor
// is a factor that is a prime number.


/**
 * largestPrimeFactor contract solver
 * 
 * @param data {number} data from contract to solve.
 * @returns answer {number}
 */
async function largestPrimeFactor(data){
    let answer = 1;
    let primeArr = [];

    for(let i = 2; i <= data/2; i++)
    {
      
        if(data % i == 0)
        {
            if(largestPrimeHelperFunc(data) == true)
            {
                primeArr.push(i)
            }
        }
    }

   
    for(let i = 0; i < primeArr.length; i++)
    {
        if(primeArr[i] > max)
        {
            answer = primeArr[i];
        }
    }
      
    return answer;
}

/**
 * check if number is a prime number 
 * 
 * @param data {number} number to evaluate.
 * @returns {boolean} true if number is prime.
 */
async function largestPrimeHelperFunc(data){
    if (data <= 1){
        return false;
    }

    for(let i = 2; i <= data / 2; i++) 
    {
        if(data % i == 0) {
           return false;
        }
    }

    return true;
}
//#endregion

//#region Subarray with Maximum Sum contract

// Subarray with Maximum Sum	
// Given an array of integers, find the contiguous subarray (containing
// at least one number) which has the largest sum and return that sum.

/**
 * subarray maxiumum sum contract
 * 
 * @param data {number[]} contract data will be array with subarrays containing numbers
 * @returns answer {number} contract result, largest sum from subarrays
 */
async function subarrayMaximumSum(data){
let answer = 0;

for(let i = 0; i < data.length; i++){
    let tempSum = 0;
    for(let j = 0; j < data[i].length; j++){
        
       tempSum += data[i][j];

    }
    if(tempSum > answer){
        answer = tempSum;
    }
}

return answer
}

//#endregion

//#region Total ways to sum contract

// Total Ways to Sum	
// Given a number, how many different ways can that number be written as
// a sum of at least two positive integers?


/**
 * total ways to sum contract
 * 
 * @param data {number} number to solve total ways to sum
 * @returns answer {number} total number of possible answers
 */
async function totalWaysToSum(data){
    let answer = Math.pow(2,(data-1));
    

    return answer;
}

//#endregion

//#region spiral matrix contract

// Spiralize Matrix	
// Given an array of array of numbers representing a 2D matrix, return the
// elements of that matrix in clockwise spiral order.

// Example: The spiral order of

// [1, 2, 3, 4]
// [5, 6, 7, 8]
// [9, 10, 11, 12]

// is [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

/**
 * spiralize matrix contract
 * 
 * @param {number[][]} data 
 * @returns {number[]} answer
 */
async function spiralizeMatrix(data){
    var w = data[0].length;
	var h = data.length;
	var answer = [];
	var rx = w - 1; // right column
	var lx = 0; // left column
	var ty = 0; // top row
	var by = h - 1; // bottom row
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
	return answer;
}
    
        
//#endregion



}