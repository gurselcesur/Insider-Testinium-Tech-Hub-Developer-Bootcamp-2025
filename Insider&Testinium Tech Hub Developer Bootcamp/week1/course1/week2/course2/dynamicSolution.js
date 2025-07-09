// Dynamic programming solution to find the longest Collatz sequence under a given limit
// Thanks to algorithm analysis class CS333
// Longest Collatz Sequence under 1,000,000: { value: 837799, length: 525 }
// [Done] exited with code=0 in 0.23 seconds
// Difference from the previous solution ):

function collatzSequenceLength(limit) {
    let longestSequence = 1;
    let longestValue = 1;

    const memo = {};

    for (let startValue = 2; startValue < limit; startValue++) {
        let currentValue = startValue;
        let numberOfTerms = 0;

        while (currentValue !== 1 && !memo[currentValue]) {
            if (currentValue % 2 === 0) {
                currentValue = currentValue / 2;
            } else {
                currentValue = 3 * currentValue + 1;
            }
            numberOfTerms++;
        }

        if (memo[currentValue]) {
            numberOfTerms += memo[currentValue];
        } else {
            numberOfTerms++;
        }

        memo[startValue] = numberOfTerms;

        if (numberOfTerms > longestSequence) {
            longestSequence = numberOfTerms;
            longestValue = startValue;
            console.log(`New longest sequence found: ${longestValue} with ${longestSequence} terms`);
        }
    }

    return {
        value: longestValue,
        length: longestSequence
    };
}

console.log("Longest Collatz Sequence under 1,000,000:", collatzSequenceLength(1000000));