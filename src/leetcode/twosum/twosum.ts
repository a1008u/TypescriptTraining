export function twoSum(nums: number[], target: number): number[] {
  return nums
    .map((n) => {
      if (target - n === n) {
        return -1;
      }
      return target - n;
    })
    .filter((tn) => nums.includes(tn))
    .map((t) => nums.indexOf(t))
    .sort();
}
