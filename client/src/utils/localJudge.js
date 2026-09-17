function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function compareOutput(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function runJavaScriptLocally(code, functionName, testCases = []) {
  if (!functionName) {
    return {
      status: 'Wrong Answer',
      message: 'This problem is missing a function name.',
      results: [],
    };
  }

  const results = testCases.map((testCase, index) => {
    const input = clone(testCase.input || {});
    const argNames = Object.keys(input);
    const args = argNames.map((name) => input[name]);

    try {
      const runner = new Function(
        ...argNames,
        `"use strict";\n${code}\nreturn ${functionName}(${argNames.join(', ')});`
      );
      const returned = runner(...args);
      const actual = typeof returned === 'undefined' && args.length === 1 ? args[0] : returned;
      const expected = testCase.expected;

      return {
        case: index + 1,
        passed: compareOutput(actual, expected),
        expected,
        actual,
        input,
      };
    } catch (error) {
      return {
        case: index + 1,
        passed: false,
        expected: testCase.expected,
        actual: null,
        input,
        error: error.message,
      };
    }
  });

  const accepted = results.length > 0 && results.every((result) => result.passed);
  return {
    status: accepted ? 'Accepted' : 'Wrong Answer',
    message: accepted ? 'All local test cases passed.' : 'Some local test cases failed.',
    results,
    source: 'local',
  };
}

export function createLocalAnalysis(problem) {
  const approach = problem?.approach;
  if (!approach) {
    return {
      timeComplexity: 'O(?)',
      spaceComplexity: 'O(?)',
      explanation: 'No curated analysis is available for this problem yet.',
      approaches: [],
      codeReview: 'Compare your solution with the problem pattern and test edge cases.',
      source: 'local',
    };
  }

  return {
    timeComplexity: approach.timeComplexity,
    spaceComplexity: approach.spaceComplexity,
    explanation: approach.explanation,
    approaches: [
      {
        name: approach.title,
        complexity: `${approach.timeComplexity} time, ${approach.spaceComplexity} space`,
        description: approach.explanation,
      },
    ],
    codeReview: `Target pattern: ${problem.pattern || problem.track || 'DSA pattern'}. Make sure the implementation matches the expected return shape.`,
    source: 'local',
  };
}
