import vm from 'vm';

const compareOutput = (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected);

export const runJavaScript = (code, functionName, testCases) => {
  const results = [];

  for (let i = 0; i < testCases.length; i += 1) {
    const { input, expected } = testCases[i];
    try {
      const context = { ...input, result: undefined };
      vm.createContext(context);

      const argNames = Object.keys(input);
      const wrapped = `
        ${code}
        result = ${functionName}(${argNames.join(', ')});
      `;

      vm.runInContext(wrapped, context, { timeout: 2000 });
      const actual = context.result;

      results.push({
        case: i + 1,
        passed: compareOutput(actual, expected),
        expected,
        actual,
        input,
      });
    } catch (error) {
      results.push({
        case: i + 1,
        passed: false,
        expected,
        actual: null,
        input,
        error: error.message,
      });
    }
  }

  return results;
};

export const evaluateSubmission = (language, code, functionName, testCases) => {
  if (language !== 'JavaScript') {
    return {
      status: 'Pending',
      message: 'Only JavaScript submissions are executed in this demo. Switch to JavaScript to run tests.',
      results: [],
    };
  }

  const results = runJavaScript(code, functionName, testCases);
  const passed = results.every((r) => r.passed);

  return {
    status: passed ? 'Accepted' : 'Wrong Answer',
    message: passed ? 'All test cases passed!' : 'Some test cases failed.',
    results,
  };
};
