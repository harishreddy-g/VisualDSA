export const problemBank = [
  {
    order: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    pattern: 'Hash Map',
    track: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    visualizer: '/visualizers/searching',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] equals 9.' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
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
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['A nested loop works, but it repeats information.', 'Store each value you have seen with its index.', 'For each number, ask whether target - number was seen earlier.'],
    approach: {
      title: 'One-pass hash map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Walk once through the array while storing visited values. The moment the complement exists in the map, return both indices.',
    },
  },
  {
    order: 2,
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    pattern: 'Frequency Counter',
    track: 'Arrays & Hashing',
    tags: ['String', 'Hash Table'],
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: '' },
      { input: 's = "rat", t = "car"', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    functionName: 'isAnagram',
    starterCode: {
      JavaScript: 'function isAnagram(s, t) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { s: 'anagram', t: 'nagaram' }, expected: true },
      { input: { s: 'rat', t: 'car' }, expected: false },
      { input: { s: 'aacc', t: 'ccac' }, expected: false },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['If lengths differ, the answer is immediately false.', 'Count each character in the first string.', 'Subtract counts while scanning the second string.'],
    approach: {
      title: 'Character frequency map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Because the alphabet is bounded, count characters from one string and cancel them with the other.',
    },
  },
  {
    order: 3,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    pattern: 'Hash Set',
    track: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    description: 'Given an integer array `nums`, return `true` if any value appears at least twice. Return `false` if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: '' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    functionName: 'containsDuplicate',
    starterCode: {
      JavaScript: 'function containsDuplicate(nums) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expected: true },
      { input: { nums: [1, 2, 3, 4] }, expected: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expected: true },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['Sorting makes duplicates adjacent but costs O(n log n).', 'A set can tell you whether a value has already appeared.', 'Return as soon as you see a repeated value.'],
    approach: {
      title: 'Seen set',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Scan once and keep a set of values already seen. A second appearance proves a duplicate exists.',
    },
  },
  {
    order: 4,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    pattern: 'Two Pointers',
    track: 'Two Pointers',
    tags: ['String', 'Two Pointers'],
    visualizer: '/visualizers/linked-list',
    description: 'A phrase is a palindrome if, after converting uppercase letters into lowercase letters and removing non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" reads the same both ways.' },
      { input: 's = "race a car"', output: 'false', explanation: '' },
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
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['You do not need to build a cleaned string.', 'Move one pointer from the left and one from the right.', 'Skip characters that are not letters or digits.'],
    approach: {
      title: 'Bidirectional scan',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Compare the next valid character from both ends and stop when the pointers cross.',
    },
  },
  {
    order: 5,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    pattern: 'Binary Search',
    track: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    visualizer: '/visualizers/searching',
    description: 'Given a sorted integer array `nums` and an integer `target`, return the index of `target`. If `target` does not exist, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '' },
    ],
    constraints: ['1 <= nums.length <= 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    functionName: 'search',
    starterCode: {
      JavaScript: 'function search(nums, target) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1 },
      { input: { nums: [5], target: 5 }, expected: 0 },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['Use the sorted property.', 'Keep a closed search window: left and right.', 'Discard half of the remaining values after each comparison.'],
    approach: {
      title: 'Halve the search space',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Compare target to the middle value and move the left or right boundary inward.',
    },
  },
  {
    order: 6,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    pattern: 'Stack',
    track: 'Stack',
    tags: ['String', 'Stack'],
    visualizer: '/visualizers/stack',
    description: 'Given a string `s` containing only `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nOpen brackets must be closed by the same type and in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^4', "s consists only of parentheses characters."],
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
      { input: { s: '([)]' }, expected: false },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['Closing brackets must match the most recent unmatched opening bracket.', 'That last-in-first-out behavior is exactly a stack.', 'Push openings and pop when a valid closing bracket appears.'],
    approach: {
      title: 'Bracket stack',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Use a stack to remember open brackets. Every close bracket must match the stack top.',
    },
  },
  {
    order: 7,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    pattern: 'Sliding Window',
    track: 'Sliding Window',
    tags: ['Array', 'Sliding Window'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a stock on day `i`.\n\nChoose one day to buy and a later day to sell. Return the maximum profit. If no profit is possible, return `0`.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1 and sell at 6.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable transaction exists.' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    functionName: 'maxProfit',
    starterCode: {
      JavaScript: 'function maxProfit(prices) {\n  // Write your code here\n}\n',
      Java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
      { input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
      { input: { prices: [2, 4, 1] }, expected: 2 },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['You only need the best buy price seen so far.', 'For each day, ask how much profit selling today would make.', 'Update the lowest price before moving on.'],
    approach: {
      title: 'Track the minimum price',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Scan prices once, keeping the cheapest earlier buy and the best profit so far.',
    },
  },
  {
    order: 8,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    pattern: 'Dynamic Programming',
    track: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming'],
    description: 'Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum.' },
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
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['A negative running sum hurts future subarrays.', 'At each index, decide whether to extend the previous subarray or start fresh.', 'Keep both current best ending here and global best.'],
    approach: {
      title: "Kadane's algorithm",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Maintain the best subarray ending at the current index and the best value seen overall.',
    },
  },
  {
    order: 9,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    pattern: 'Dynamic Programming',
    track: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can climb either 1 or 2 steps. Return the number of distinct ways to reach the top.',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
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
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['The number of ways to reach step n depends on n-1 and n-2.', 'This is the Fibonacci recurrence in disguise.', 'You only need the previous two values.'],
    approach: {
      title: 'Bottom-up DP',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Build from the base cases using two rolling variables.',
    },
  },
  {
    order: 10,
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    pattern: 'Linked List',
    track: 'Linked List',
    tags: ['Linked List', 'Recursion'],
    visualizer: '/visualizers/linked-list',
    description: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge them into one sorted list and return the merged list.',
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: '' },
      { input: 'list1 = [], list2 = []', output: '[]', explanation: '' },
    ],
    constraints: ['0 <= list length <= 50', '-100 <= Node.val <= 100', 'Both lists are sorted.'],
    functionName: 'mergeTwoLists',
    starterCode: {
      JavaScript: 'function mergeTwoLists(list1, list2) {\n  // In this app, lists are represented as arrays.\n}\n',
      Java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: [1, 1, 2, 3, 4, 4] },
      { input: { list1: [], list2: [] }, expected: [] },
      { input: { list1: [], list2: [0] }, expected: [0] },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['Compare the current heads of both lists.', 'Move the pointer from whichever list has the smaller value.', 'A dummy head simplifies edge cases.'],
    approach: {
      title: 'Two pointer merge',
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(1)',
      explanation: 'Repeatedly append the smaller current node, then attach the remaining tail.',
    },
  },
  {
    order: 11,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    pattern: 'Graph Traversal',
    track: 'Graphs',
    tags: ['Array', 'DFS', 'Graph'],
    visualizer: '/visualizers/graphs',
    description: "Given an `m x n` binary grid where `1` is land and `0` is water, return the number of islands.\n\nAn island is formed by connecting adjacent lands horizontally or vertically.",
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
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['Each island starts at an unvisited land cell.', 'Use DFS or BFS to mark all connected land.', 'Count how many searches you start.'],
    approach: {
      title: 'Flood fill',
      timeComplexity: 'O(m*n)',
      spaceComplexity: 'O(m*n)',
      explanation: 'Scan the grid. When you find unvisited land, count one island and flood-fill its connected component.',
    },
  },
  {
    order: 12,
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    pattern: 'Tree DFS',
    track: 'Trees',
    tags: ['Tree', 'DFS', 'Binary Tree'],
    visualizer: '/visualizers/trees',
    description: 'Given the root of a binary tree, invert the tree and return its root.\n\nIn this app, trees are represented as level-order arrays where `null` means no node.',
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: '' },
      { input: 'root = [2,1,3]', output: '[2,3,1]', explanation: '' },
    ],
    constraints: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    functionName: 'invertTree',
    starterCode: {
      JavaScript: 'function invertTree(root) {\n  // In this app, root is a level-order array.\n}\n',
      Java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n    }\n}\n',
      'C++': 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your code here\n    }\n};\n',
    },
    testCases: [
      { input: { root: [4, 2, 7, 1, 3, 6, 9] }, expected: [4, 7, 2, 9, 6, 3, 1] },
      { input: { root: [2, 1, 3] }, expected: [2, 3, 1] },
      { input: { root: [] }, expected: [] },
    ],
    languages: ['JavaScript', 'Java', 'C', 'C++', 'Python'],
    hints: ['Every node only needs its children swapped.', 'You can solve this recursively or with a queue.', 'Swap left and right for the current node, then process children.'],
    approach: {
      title: 'Recursive swap',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      explanation: 'Visit every node once and swap its left and right child pointers.',
    },
  },
];

export const roadmapTracks = [
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    description: 'Learn counting, lookup tables, and constant-time membership checks.',
    tags: ['Array', 'Hash Table', 'String'],
    visualizer: '/visualizers/searching',
    problemSlugs: ['contains-duplicate', 'valid-anagram', 'two-sum'],
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    description: 'Use opposite-end or same-direction pointers to avoid nested loops.',
    tags: ['Two Pointers', 'String'],
    visualizer: '/visualizers/linked-list',
    problemSlugs: ['valid-palindrome'],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Turn sorted order into logarithmic decisions.',
    tags: ['Binary Search', 'Array'],
    visualizer: '/visualizers/searching',
    problemSlugs: ['binary-search'],
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'Model nested structure, matching, and last-in-first-out workflows.',
    tags: ['Stack', 'String'],
    visualizer: '/visualizers/stack',
    problemSlugs: ['valid-parentheses'],
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    description: 'Maintain a moving window instead of recomputing ranges.',
    tags: ['Sliding Window', 'Array'],
    visualizer: '/visualizers/queue',
    problemSlugs: ['best-time-to-buy-and-sell-stock'],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'Practice pointer movement and sentinel-node patterns.',
    tags: ['Linked List', 'Recursion'],
    visualizer: '/visualizers/linked-list',
    problemSlugs: ['merge-two-sorted-lists'],
  },
  {
    id: 'trees',
    title: 'Trees',
    description: 'Build recursive intuition for hierarchical data.',
    tags: ['Tree', 'DFS', 'Binary Tree'],
    visualizer: '/visualizers/trees',
    problemSlugs: ['invert-binary-tree'],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Use BFS and DFS to explore connected components.',
    tags: ['Graph', 'DFS', 'BFS'],
    visualizer: '/visualizers/graphs',
    problemSlugs: ['number-of-islands'],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Reuse overlapping subproblems instead of recomputing them.',
    tags: ['Dynamic Programming', 'Math'],
    visualizer: '/visualizers/sorting/Merge%20Sort',
    problemSlugs: ['climbing-stairs', 'maximum-subarray'],
  },
];

const localBySlug = new Map(problemBank.map((problem) => [problem.slug, problem]));

export function getLocalProblem(slug) {
  return localBySlug.get(slug) || null;
}

export function mergeProblemData(problem) {
  if (!problem?.slug) return problem;
  const local = getLocalProblem(problem.slug);
  return local ? { ...local, ...problem, hints: problem.hints || local.hints, approach: problem.approach || local.approach, pattern: problem.pattern || local.pattern, track: problem.track || local.track, visualizer: problem.visualizer || local.visualizer } : problem;
}

export function mergeProblemLists(remoteProblems = []) {
  const merged = new Map(problemBank.map((problem) => [problem.slug, problem]));
  remoteProblems.forEach((problem) => {
    merged.set(problem.slug, mergeProblemData(problem));
  });
  return [...merged.values()].sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
}

export function getAllTags(problems = problemBank) {
  return [...new Set(problems.flatMap((problem) => problem.tags || []))].sort();
}

export function getAllTracks(problems = problemBank) {
  return [...new Set(problems.map((problem) => problem.track).filter(Boolean))];
}

export function getStoredSlugs(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function setStoredSlugs(key, slugs) {
  localStorage.setItem(key, JSON.stringify([...new Set(slugs)]));
}
