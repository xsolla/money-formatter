export const getTextContent = htmlString => htmlString.match(/>(.+)<\//)[1];

// Generate all posible permutations with repetitions
const getPermutations = (elements) => {
  const permutations = [];
  function permutate(arr) {
    if (arr.length === elements.length) {
      permutations.push(arr);
      return;
    }
    for (let i = 0; i < elements.length; i += 1) {
      permutate(arr.concat([elements[i]]));
    }
  }
  permutate([]);
  return permutations;
};

export const errorArgs = getPermutations([null, undefined]);
