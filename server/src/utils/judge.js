import vm from 'vm';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

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

const withTempDirectory = (callback) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-dsa-'));
  try {
    return callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
};

const javaString = (value) => JSON.stringify(value).replace(/\\u2028|\\u2029/g, '');

const javaLiteral = (value, code, name) => {
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : `${value}d`;
  if (typeof value === 'string') return javaString(value);
  if (!Array.isArray(value)) throw new Error(`Unsupported Java input: ${name}`);

  const nested = value.some(Array.isArray);
  const charGrid = nested && value.every((row) => Array.isArray(row) && row.every((item) => typeof item === 'string' && item.length === 1)) && /char\s*\[\s*\]\s*\[\s*\]/.test(code);
  const component = charGrid ? 'char' : value.length === 0 ? 'int' : Array.isArray(value[0]) ? 'int[]' : typeof value[0] === 'string' ? 'String' : typeof value[0] === 'boolean' ? 'boolean' : 'int';
  const item = (itemValue) => charGrid
    ? (Array.isArray(itemValue) ? `{${itemValue.map((character) => `'${character.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`).join(', ')}}` : `'${itemValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`)
    : javaLiteral(itemValue, code, name);
  return `new ${charGrid ? 'char[]' : component}[]{${value.map(item).join(', ')}}`;
};

const cppString = (value) => JSON.stringify(value).replace(/\\u2028|\\u2029/g, '');

const cppLiteral = (value, code, name) => {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return cppString(value);
  if (!Array.isArray(value)) throw new Error(`Unsupported C++ input: ${name}`);

  const nested = value.some(Array.isArray);
  const charGrid = nested && value.every((row) => Array.isArray(row) && row.every((item) => typeof item === 'string' && item.length === 1)) && /vector\s*<\s*vector\s*<\s*char/.test(code);
  const item = (itemValue) => charGrid
    ? (Array.isArray(itemValue) ? `vector<char>{${itemValue.map((character) => `'${character.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`).join(', ')}}` : `'${itemValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`)
    : cppLiteral(itemValue, code, name);
  const type = charGrid ? 'vector<char>' : nested ? 'vector<int>' : value.length === 0 ? 'int' : typeof value[0] === 'string' ? 'string' : typeof value[0] === 'boolean' ? 'bool' : 'int';
  return `vector<${type}>{${value.map(item).join(', ')}}`;
};

const javaSource = (code, functionName, testCases) => `
import java.lang.reflect.Array;
import java.util.*;
${code.replace(/public\s+class\s+Solution/g, 'class Solution')}
public class Main {
  static String encode(Object value) {
    if (value == null) return "null";
    if (value instanceof String) return "\\\"" + ((String) value).replace("\\\"", "\\\\\\\"") + "\\\"";
    if (value instanceof Character) return "\\\"" + value + "\\\"";
    if (value instanceof Boolean || value instanceof Number) return String.valueOf(value);
    if (value instanceof Collection) { StringBuilder s = new StringBuilder("["); boolean first = true; for (Object item : (Collection<?>) value) { if (!first) s.append(','); s.append(encode(item)); first = false; } return s.append(']').toString(); }
    if (value.getClass().isArray()) { StringBuilder s = new StringBuilder("["); for (int i = 0; i < Array.getLength(value); i++) { if (i > 0) s.append(','); s.append(encode(Array.get(value, i))); } return s.append(']').toString(); }
    return String.valueOf(value);
  }
  public static void main(String[] args) {
    int test = Integer.parseInt(args[0]);
    Solution solution = new Solution();
    switch (test) {
${testCases.map((testCase, index) => `      case ${index}: System.out.print(encode(solution.${functionName}(${Object.entries(testCase.input).map(([name, value]) => javaLiteral(value, code, name)).join(', ')}))); break;`).join('\n')}
      default: throw new IllegalArgumentException("Unknown test case");
    }
  }
}
`;

const cppSource = (code, functionName, testCases) => `
#include <bits/stdc++.h>
using namespace std;
${code}
template <typename T> void encode(const vector<T>& value) { cout << '['; for (size_t i = 0; i < value.size(); i++) { if (i) cout << ','; encode(value[i]); } cout << ']'; }
void encode(int value) { cout << value; }
void encode(bool value) { cout << (value ? "true" : "false"); }
void encode(const string& value) { cout << '\"' << value << '\"'; }
void encode(char value) { cout << '\"' << value << '\"'; }
int main(int argc, char** argv) {
  int test = stoi(argv[1]);
  Solution solution;
  switch (test) {
${testCases.map((testCase, index) => `    case ${index}: encode(solution.${functionName}(${Object.entries(testCase.input).map(([name, value]) => cppLiteral(value, code, name)).join(', ')})); break;`).join('\n')}
    default: return 2;
  }
}
`;

const runCompiled = (language, code, functionName, testCases) => {
  const compiler = language === 'Java' ? 'javac' : 'g++';
  if (!hasCommand(compiler)) return { unavailable: true, message: `${compiler} is not installed in this environment.`, results: [] };

  return withTempDirectory((directory) => {
    const sourceName = language === 'Java' ? 'Main.java' : 'main.cpp';
    const sourcePath = path.join(directory, sourceName);
    fs.writeFileSync(sourcePath, language === 'Java' ? javaSource(code, functionName, testCases) : cppSource(code, functionName, testCases));
    const compile = language === 'Java'
      ? runCommand('javac', ['-encoding', 'UTF-8', sourcePath])
      : runCommand('g++', ['-std=c++17', '-O2', sourcePath, '-o', path.join(directory, 'main')]);
    if (compile.error || compile.status !== 0) return { unavailable: false, compileError: (compile.stderr || compile.error?.message || 'Compilation failed').trim(), results: [] };

    const results = testCases.map((testCase, index) => {
      const command = language === 'Java' ? 'java' : path.join(directory, 'main');
      const args = language === 'Java' ? ['-cp', directory, 'Main', String(index)] : [String(index)];
      const execution = runCommand(command, args);
      try {
        if (execution.error || execution.status !== 0) throw new Error((execution.stderr || execution.error?.message || 'Program failed').trim());
        const actual = JSON.parse(execution.stdout.trim());
        return { case: index + 1, passed: compareOutput(actual, testCase.expected), expected: testCase.expected, actual, input: testCase.input };
      } catch (error) {
        return { case: index + 1, passed: false, expected: testCase.expected, actual: null, input: testCase.input, error: error.message };
      }
    });
    return { unavailable: false, results };
  });
};

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

  if (language === 'Java' || language === 'C++') {
    const compiledRun = runCompiled(language, code, functionName, testCases);
    if (compiledRun.unavailable) {
      return {
        status: 'Pending',
        message: compiledRun.message,
        results: [],
      };
    }
    if (compiledRun.compileError) {
      return {
        status: 'Compile Error',
        message: 'Your code could not be compiled.',
        results: [{ case: 0, passed: false, error: compiledRun.compileError }],
      };
    }

    const passed = compiledRun.results.length > 0 && compiledRun.results.every((result) => result.passed);
    return {
      status: passed ? 'Accepted' : 'Wrong Answer',
      message: passed ? 'All test cases passed!' : 'Some test cases failed.',
      results: compiledRun.results,
    };
  }

  return {
    status: 'Pending',
    message: 'Submission accepted for review.',
    results: [],
  };
};
