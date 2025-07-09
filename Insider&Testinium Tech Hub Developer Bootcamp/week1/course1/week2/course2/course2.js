// Longest Collatz Sequence
// n -> n/2 (if n is even)
// n -> 3n + 1 (if n is odd)
// The sequence ends when it reaches 1.
// Find the number under 1,000,000 that produces the longest Collatz sequence.

// answer: Longest Collatz Sequence under 1,000,000: { value: 837799, length: 525 }
// [Done] exited with code=0 in 1.484 seconds

function collatzSequenceLength(limit) {
    let longestSequence=1;
    let longestValue=1;

    let startValue;
    for(startValue = 2; startValue < limit; startValue++){

        let currentValue = startValue;
        let numberOfTerms = 1;
        while(currentValue !== 1) {
            if (currentValue % 2 === 0) {
                currentValue = currentValue / 2;
            } else {
                currentValue = 3 * currentValue + 1;
            }
            numberOfTerms++;
        }
        if (numberOfTerms > longestSequence) {
            longestSequence = numberOfTerms;
            longestValue = startValue;
            console.log(`New longest sequence found: ${longestValue} with ${longestSequence} terms`);
        }
    }
    return {
        value: longestValue,
        length: longestSequence
    }
}

console.log("Longest Collatz Sequence under 1,000,000:", collatzSequenceLength(1000000));