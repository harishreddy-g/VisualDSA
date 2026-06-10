export const sortingInfo = {
  'Bubble Sort': { complexity: 'O(n²)', space: 'O(1)', pseudocode: ['for i = 0 to n-1', '  for j = 0 to n-i-2', '    if a[j] > a[j+1]', '      swap(a[j], a[j+1])'] },
  'Selection Sort': { complexity: 'O(n²)', space: 'O(1)', pseudocode: ['for i = 0 to n-1', '  minIndex = i', '  for j = i+1 to n-1', '    if a[j] < a[minIndex]', '      minIndex = j', '  swap(a[i], a[minIndex])'] },
  'Insertion Sort': { complexity: 'O(n²)', space: 'O(1)', pseudocode: ['for i = 1 to n-1', '  key = a[i]', '  j = i - 1', '  while j >= 0 and a[j] > key', '    a[j+1] = a[j]', '    j--', '  a[j+1] = key'] },
  'Merge Sort': { complexity: 'O(n log n)', space: 'O(n)', pseudocode: ['mergeSort(left, right)', '  if left < right', '    mid = (left + right) / 2', '    mergeSort(left, mid)', '    mergeSort(mid+1, right)', '    merge(left, mid, right)'] },
  'Quick Sort': { complexity: 'O(n log n)', space: 'O(log n)', pseudocode: ['pivot = a[right]', '  partition around pivot', '  quickSort(left, pivot-1)', '  quickSort(pivot+1, right)'] },
  'Heap Sort': { complexity: 'O(n log n)', space: 'O(1)', pseudocode: ['build max heap', '  for i = n-1 to 1', '    swap(a[0], a[i])', '    heapify(0, i)'] },
};

export const searchInfo = {
  'Linear Search': {
    complexity: 'O(n)',
    pseudocode: ['for i = 0 to n-1', '  if a[i] == target', '    return i', 'return -1']
  },
  'Binary Search': {
    complexity: 'O(log n)',
    pseudocode: ['left = 0', 'right = n - 1', 'while left <= right', '  mid = (left + right) / 2', '  if a[mid] == target', '    return mid', '  else if a[mid] < target', '    left = mid + 1', '  else', '    right = mid - 1']
  },
};

export const linkedListInfo = {
  'Insert Front': { pseudocode: ['newNode.next = head', 'head = newNode'] },
  'Insert End': { pseudocode: ['if head == null', '  head = newNode', 'else', '  tail.next = newNode'] },
  'Delete Node': { pseudocode: ['find previous node', 'previous.next = current.next'] },
  'Search Node': { pseudocode: ['current = head', 'while current != null', '  if current.value == target', '    return true'] },
};

export const stackInfo = {
  Push: { pseudocode: ['stack.push(value)', 'top = stack.length - 1'] },
  Pop: { pseudocode: ['if stack is empty', '  return error', 'value = stack.pop()'] },
  Peek: { pseudocode: ['return stack[stack.length - 1]'] },
};

export const queueInfo = {
  Enqueue: { pseudocode: ['queue.push(value)', 'rear = queue.length - 1'] },
  Dequeue: { pseudocode: ['if queue is empty', '  return error', 'value = queue.shift()'] },
  Front: { pseudocode: ['return queue[0]'] },
  Rear: { pseudocode: ['return queue[queue.length - 1]'] },
};

export const treeInfo = {
  'BST Insert': { pseudocode: ['if node == null', '  return new Node(value)', 'if value < node.value', '  node.left = insert(node.left, value)', 'else', '  node.right = insert(node.right, value)'] },
  'BST Delete': { pseudocode: ['find node', 'replace with inorder successor or predecessor'] },
  'BST Search': { pseudocode: ['if node == null', '  return false', 'if value == node.value', '  return true'] },
  Inorder: { pseudocode: ['visit left', 'visit root', 'visit right'] },
  Preorder: { pseudocode: ['visit root', 'visit left', 'visit right'] },
  Postorder: { pseudocode: ['visit left', 'visit right', 'visit root'] },
};

export const graphInfo = {
  BFS: { pseudocode: ['queue = [start]', 'visited = {start}', 'while queue not empty', '  node = queue.shift()', '  visit neighbors'] },
  DFS: { pseudocode: ['stack = [start]', 'visited = {start}', 'while stack not empty', '  node = stack.pop()', '  visit neighbors'] },
};

export function randomArray(size = 10) {
  return Array.from({ length: size }, () => 8 + Math.floor(Math.random() * 72));
}

export function generateLinkedListSteps(operation, nodes, value) {
  const next = [...nodes];
  if (operation === 'Insert Front') next.unshift(value);
  if (operation === 'Insert End') next.push(value);
  if (operation === 'Delete Node') next.splice(next.indexOf(value), 1);

  return [{ operation, nodes: next, message: operation === 'Delete Node' ? `Delete ${value} from the linked list.` : `${operation} completed.` }];
}

export function generateStackSteps(operation, stack, value) {
  const current = [...stack];
  if (operation === 'Push') current.push(value);
  if (operation === 'Pop' && current.length) current.pop();
  return [{ operation, stack: current, message: operation === 'Push' ? `Push ${value}.` : operation === 'Pop' ? 'Pop the top value.' : 'Peek at the top value.' }];
}

export function generateQueueSteps(operation, queue, value) {
  const current = [...queue];
  if (operation === 'Enqueue') current.push(value);
  if (operation === 'Dequeue' && current.length) current.shift();
  return [{ operation, queue: current, message: operation === 'Enqueue' ? `Enqueue ${value}.` : operation === 'Dequeue' ? 'Remove the front item.' : 'Inspect the front and rear.' }];
}

export function generateTreeSteps(operation, tree, value) {
  return [{ operation, tree, message: `${operation} uses the current BST structure.` }];
}

export function generateGraphSteps(operation, nodes, edges) {
  return [{ operation, nodes, edges, message: `${operation} explores the current graph.` }];
}

function pushStep(steps, array, left, right, swapped = false, sorted = [], explanation) {
  steps.push({ array: [...array], left, right, swapped, sorted: [...sorted], explanation });
}

export function generateSortingSteps(algorithm, array) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;
  const sorted = [];

  if (algorithm === 'Bubble Sort') {
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n - i - 1; j += 1) {
        pushStep(steps, arr, j, j + 1, false, sorted, `Compare ${arr[j]} and ${arr[j + 1]}.`);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          pushStep(steps, arr, j, j + 1, true, sorted, `Swap ${arr[j + 1]} and ${arr[j]}.`);
        }
      }
      sorted.push(arr[n - i - 1]);
      pushStep(steps, arr, n - i - 1, null, false, sorted, `${arr[n - i - 1]} is now in its final position.`);
    }
  }

  if (algorithm === 'Selection Sort') {
    for (let i = 0; i < n - 1; i += 1) {
      let minIndex = i;
      for (let j = i + 1; j < n; j += 1) {
        pushStep(steps, arr, i, j, false, sorted, `Compare ${arr[j]} with current minimum ${arr[minIndex]}.`);
        if (arr[j] < arr[minIndex]) minIndex = j;
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        pushStep(steps, arr, i, minIndex, true, sorted, `Swap ${arr[minIndex]} into position ${i}.`);
      }
      sorted.push(arr[i]);
      pushStep(steps, arr, i, null, false, sorted, `${arr[i]} is sorted.`);
    }
    sorted.push(arr[n - 1]);
  }

  if (algorithm === 'Insertion Sort') {
    for (let i = 1; i < n; i += 1) {
      const key = arr[i];
      let j = i - 1;
      pushStep(steps, arr, i, j, false, sorted, `Insert ${key} into the sorted portion.`);
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        pushStep(steps, arr, j + 1, j, true, sorted, `Shift ${arr[j]} right to make room.`);
        j -= 1;
      }
      arr[j + 1] = key;
      pushStep(steps, arr, j + 1, i, false, sorted, `Place ${key} into the correct slot.`);
      sorted.push(arr[i]);
    }
  }

  if (algorithm === 'Merge Sort') {
    const merge = (left, mid, right) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
      while (i < leftArr.length && j < rightArr.length) {
        pushStep(steps, arr, left + i, mid + 1 + j, false, sorted, `Compare ${leftArr[i]} and ${rightArr[j]}.`);
        if (leftArr[i] <= rightArr[j]) arr[k++] = leftArr[i++];
        else arr[k++] = rightArr[j++];
        pushStep(steps, arr, k - 1, null, false, sorted, 'Merge the smaller value into the result.');
      }
      while (i < leftArr.length) arr[k++] = leftArr[i++];
      while (j < rightArr.length) arr[k++] = rightArr[j++];
    };

    const sort = (l, r) => {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
      pushStep(steps, arr, l, r, false, sorted, 'Merge completed for this segment.');
    };
    sort(0, n - 1);
  }

  if (algorithm === 'Quick Sort') {
    const partition = (low, high) => {
      const pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j += 1) {
        pushStep(steps, arr, j, high, false, sorted, `Compare ${arr[j]} with pivot ${pivot}.`);
        if (arr[j] < pivot) {
          i += 1;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          pushStep(steps, arr, i, j, true, sorted, 'Swap to place the smaller value before the pivot.');
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      pushStep(steps, arr, i + 1, high, true, sorted, `Place pivot ${pivot} at index ${i + 1}.`);
      return i + 1;
    };
    const sort = (low, high) => {
      if (low >= high) return;
      const p = partition(low, high);
      sort(low, p - 1);
      sort(p + 1, high);
    };
    sort(0, n - 1);
    pushStep(steps, arr, 0, n - 1, false, arr.map((_, idx) => idx), 'Quick sort completed.');
  }

  if (algorithm === 'Heap Sort') {
    const heapify = (n, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        pushStep(steps, arr, i, largest, true, sorted, 'Swap with the larger child to restore the heap.');
        heapify(n, largest);
      }
    };
    for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) heapify(n, i);
    for (let i = n - 1; i > 0; i -= 1) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      pushStep(steps, arr, 0, i, true, sorted, 'Move the largest element to the end.');
      heapify(i, 0);
      sorted.push(arr[i]);
    }
    sorted.push(arr[0]);
  }

  return steps;
}

export function generateSearchSteps(type, target, array) {
  const steps = [];
  const arr = [...array];
  let comparisons = 0;

  if (type === 'Linear Search') {
    for (let i = 0; i < arr.length; i += 1) {
      comparisons += 1;
      steps.push({ index: i, current: arr[i], target, found: arr[i] === target, comparisons, explanation: `Check index ${i} containing ${arr[i]}.` });
      if (arr[i] === target) break;
    }
  } else {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      comparisons += 1;
      steps.push({ index: mid, current: arr[mid], target, found: arr[mid] === target, comparisons, left, right, explanation: `Check middle element ${arr[mid]} at index ${mid}.` });
      if (arr[mid] === target) break;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
  }

  return steps;
}
