import vm from 'vm';
import { spawnSync } from 'child_process';

const compareOutput = (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected);

const hasCommand = (command) => {
  const result = spawnSync(process.platform === 'win32' ? 'where' : 'which', [command], {
    encoding: 'utf8',
    timeout: 3000,
  });

  return !result.error && result.status === 0;
};

const runCommand = (command, args, input = '') => spawnSync(command, args, {
  encoding: 'utf8',
  input,
  timeout: 8000,
});

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

export const runPython = (code, functionName, testCases = []) => {
  if (!hasCommand('python')) {
    return {
      unavailable: true,
      message: 'Python is not installed in this environment.',
      results: [],
    };
  }

  const results = [];

  for (let i = 0; i < testCases.length; i += 1) {
    const { input, expected } = testCases[i];
    const argNames = Object.keys(input);
    const assignments = argNames.map((name) => `${name} = data["${name}"]`).join('\n');
    const script = [
      'import json, sys',
      'data = json.loads(sys.argv[1])',
      assignments,
      code,
      `result = ${functionName}(${argNames.join(', ')})`,
      'print(json.dumps(result))',
    ].join('\n');

    try {
      const proc = runCommand('python', ['-c', script, JSON.stringify(input)]);
      if (proc.error || proc.status !== 0) {
        throw new Error((proc.stderr || proc.error?.message || 'Python execution failed').trim());
      }

      const output = proc.stdout.trim();
      let actual = null;
      try {
        actual = output ? JSON.parse(output) : null;
      } catch {
        actual = output;
      }

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

  return {
    unavailable: false,
    results,
  };
};

const supportedLanguages = new Set(['JavaScript', 'Java', 'C', 'C++', 'Python']);

export const evaluateSubmission = (language, code, functionName, testCases) => {
  if (!supportedLanguages.has(language)) {
    return {
      status: 'Pending',
      message: `Unsupported language: ${language}. Supported languages are JavaScript, Java, C, C++, and Python.`,
      results: [],
    };
  }

  if (language === 'JavaScript') {
    const results = runJavaScript(code, functionName, testCases);
    const passed = results.every((r) => r.passed);

    return {
      status: passed ? 'Accepted' : 'Wrong Answer',
      message: passed ? 'All test cases passed!' : 'Some test cases failed.',
      results,
    };
  }

  if (language === 'Python') {
    const pythonRun = runPython(code, functionName, testCases);
    if (pythonRun.unavailable) {
      return {
        status: 'Pending',
        message: pythonRun.message,
        results: [],
      };
    }

    const passed = pythonRun.results.every((r) => r.passed);
    return {
      status: passed ? 'Accepted' : 'Wrong Answer',
      message: passed ? 'All test cases passed!' : 'Some test cases failed.',
      results: pythonRun.results,
    };
  }

  return {
    status: 'Pending',
    message: 'Submission accepted for review. JavaScript and Python run locally in this demo. Java, C, and C++ submissions are accepted for manual/API validation when a compiler is available.',
    results: [],
  };
};
