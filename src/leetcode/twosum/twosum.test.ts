import { twoSum } from "./twosum";

test("test1", () => {
  const nums = [2, 7, 11, 15],
    target = 9;
  const answer_num = [0, 1];
  expect(twoSum(nums, target)).toEqual(answer_num);
});

test("test2", () => {
  const nums = [3, 2, 4],
    target = 6;
  const answer_num = [1, 2];
  expect(twoSum(nums, target)).toEqual(answer_num);
});

test("test3", () => {
  const nums = [3, 3],
    target = 6;
  const answer_num = [0, 1];
  expect(twoSum(nums, target)).toEqual(answer_num);
});

test("test4", () => {
  const nums = [0, 4, 3, 0],
    target = 0;
  const answer_num = [0, 3];
  expect(twoSum(nums, target)).toEqual(answer_num);
});

test("test5", () => {
  const nums = [-3, 4, 3, 90],
    target = 0;
  const answer_num = [0, 2];
  expect(twoSum(nums, target)).toEqual(answer_num);
});
