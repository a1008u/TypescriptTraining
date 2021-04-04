export function bubblesort(nums: number[]): number[] {
  for (let i = 0; i < nums.length; i++) {
    const targetIndex = nums.length - i - 1;
    for (let key = 0; key < targetIndex; key++) {
      if (nums[key] > nums[key + 1]) {
        const temp = nums[key];
        nums[key] = nums[key + 1];
        nums[key + 1] = temp;
      }
    }
  }
  return nums;
}

export function bubblesort2(nums: number[]): number[] {
  nums
    .map((_, i) => nums.length - i - 1)
    .forEach((targetIndex) => {
      for (let key = 0; key < targetIndex; key++) {
        if (nums[key] > nums[key + 1]) {
          const temp = nums[key];
          nums[key] = nums[key + 1];
          nums[key + 1] = temp;
        }
      }
    });
  return nums;
}
