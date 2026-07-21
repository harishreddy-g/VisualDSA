import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Problem from '../models/Problem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    functionName: 'twoSum',
    starterCode: {
      JavaScript: 'function twoSum(nums, target) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    functionName: 'search',
    starterCode: {
      JavaScript: 'function search(nums, target) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1 },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}'."],
    functionName: 'isValid',
    starterCode: {
      JavaScript: 'function isValid(s) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { s: '()' }, expected: true },
      { input: { s: '()[]{}' }, expected: true },
      { input: { s: '(]' }, expected: false },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: '' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    functionName: 'maxSubArray',
    starterCode: {
      JavaScript: 'function maxSubArray(nums) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
      { input: { nums: [1] }, expected: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    description: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: '' },
      { input: 'list1 = [], list2 = []', output: '[]', explanation: '' },
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    functionName: 'mergeTwoLists',
    starterCode: {
      JavaScript: 'function mergeTwoLists(list1, list2) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: [1, 1, 2, 3, 4, 4] },
      { input: { list1: [], list2: [] }, expected: [] },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    tags: ['Array', 'DFS', 'Graph'],
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: '' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', "grid[i][j] is '0' or '1'."],
    functionName: 'numIslands',
    starterCode: {
      JavaScript: 'function numIslands(grid) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { grid: [['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']] }, expected: 1 },
      { input: { grid: [['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']] }, expected: 3 },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Recursion'],
    description: 'The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nThat is:\n- `F(0) = 0`, `F(1) = 1`\n- `F(n) = F(n - 1) + F(n - 2)`, for `n > 1`\n\nGiven `n`, calculate `F(n)`.',
    examples: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
      { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' },
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' },
    ],
    constraints: ['0 <= n <= 30'],
    functionName: 'fib',
    starterCode: {
      JavaScript: 'function fib(n) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int fib(int n) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int fib(int n) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { n: 2 }, expected: 1 },
      { input: { n: 3 }, expected: 2 },
      { input: { n: 4 }, expected: 3 },
      { input: { n: 10 }, expected: 55 },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', output: 'true', explanation: 's is an empty string after removing non-alphanumeric characters. An empty string reads the same forward and backward.' },
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    functionName: 'isPalindrome',
    starterCode: {
      JavaScript: 'function isPalindrome(s) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { s: 'A man, a plan, a canal: Panama' }, expected: true },
      { input: { s: 'race a car' }, expected: false },
      { input: { s: ' ' }, expected: true },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step' },
    ],
    constraints: ['1 <= n <= 45'],
    functionName: 'climbStairs',
    starterCode: {
      JavaScript: 'function climbStairs(n) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { n: 2 }, expected: 2 },
      { input: { n: 3 }, expected: 3 },
      { input: { n: 5 }, expected: 8 },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'Easy',
    tags: ['Array', 'Bit Manipulation'],
    description: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.',
    examples: [
      { input: 'nums = [2,2,1]', output: '1', explanation: '' },
      { input: 'nums = [4,1,2,1,2]', output: '4', explanation: '' },
      { input: 'nums = [1]', output: '1', explanation: '' },
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element in the array appears twice except for one element which appears only once.'],
    functionName: 'singleNumber',
    starterCode: {
      JavaScript: 'function singleNumber(nums) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { nums: [2, 2, 1] }, expected: 1 },
      { input: { nums: [4, 1, 2, 1, 2] }, expected: 4 },
      { input: { nums: [1] }, expected: 1 },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'String'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with `O(1)` extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
    functionName: 'reverseString',
    starterCode: {
      JavaScript: 'function reverseString(s) {\n  // Modify s in-place and return it\n  return s;\n}\n',
      Java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { s: ['h', 'e', 'l', 'l', 'o'] }, expected: ['o', 'l', 'l', 'e', 'h'] },
      { input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] }, expected: ['h', 'a', 'n', 'n', 'a', 'H'] },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
  {
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    tags: ['String', 'Trie'],
    description: 'Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `""`.',
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: '' },
      { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: 'There is no common prefix among the input strings.' },
    ],
    constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of only lowercase English letters.'],
    functionName: 'longestCommonPrefix',
    starterCode: {
      JavaScript: 'function longestCommonPrefix(strs) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { strs: ['flower', 'flow', 'flight'] }, expected: 'fl' },
      { input: { strs: ['dog', 'racecar', 'car'] }, expected: '' },
      { input: { strs: ['interview', 'inter', 'internal'] }, expected: 'inter' },
    ],
    languages: ['JavaScript', 'Java', 'C++'],
  },
];

export const seedProblems = async () => {
  const existing = await Problem.find();
  const needsSeed = existing.length === 0 || existing.length < problems.length || existing.some((item) => !item.slug);

  if (needsSeed) {
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log(`Seeded ${problems.length} problems`);
  }

  return Problem.find();
};

if (process.argv[1]?.includes('seed.js')) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      await Problem.deleteMany({});
      await Problem.insertMany(problems);
      console.log(`Seeded ${problems.length} problems`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
