function sumOfTripledEvens(array) {
    return array
      .filter(num => num % 2 === 0)
      .map(   num => num * 3 )
      .reduce(  (total, currentNum) => total + currentNum);
  }
  
  // Test it:
  console.log(sumOfTripledEvens([1, 2, 3, 4, 5])); 
  // Evens are 2, 4 -> Tripled: 6, 12 -> Sum: 18.