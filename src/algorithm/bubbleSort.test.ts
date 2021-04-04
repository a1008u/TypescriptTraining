import { bubblesort, bubblesort2 } from "./bubbleSort";

test("test1", () => {
  const nums = [4, 3, 2, 6, 8, 5];
  const answer_num = [2, 3, 4, 5, 6, 8];
  expect(bubblesort(nums)).toEqual(answer_num);
});

test("test2", () => {
  const nums = [4, 3, 2, 6, 8, 5];
  const answer_num = [2, 3, 4, 5, 6, 8];
  expect(bubblesort2(nums)).toEqual(answer_num);
});
