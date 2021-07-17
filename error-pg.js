const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  throw new Error("Invalid parameters");
};

try {
  console.log(sum(1));
} catch (error) {
  console.log("An error occured");
  console.log(error);
}
console.log("This works");
