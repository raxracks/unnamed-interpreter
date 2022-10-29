const { readFileSync } = require("fs");
const symbols = {};
const labels = {};
const code = [];

let stack = [];
let i = 0;
let retI = [Infinity];

//
// Parameter Functions
//
function getsym() {
  return symbols[code[++i]];
}

function getstack() {
  return stack;
}

function len() {
  return parseParam(++i).length;
}

function idx() {
  return parseParam(++i)[parseParam(++i)];
}

function stacktop() {
  return stack[stack.length - 1];
}

const paramFunctions = { getsym, getstack, len, idx, stacktop };

function parseParam() {
  if (paramFunctions[code[i]]) return paramFunctions[code[i]]();
  else return code[i];
}

//
// Normal Ops
//
function push() {
  stack.push(parseParam(++i));
}

function pop() {
  return stack.pop();
}

function pops() {
  symbols[code[++i]] = pop();
}

function label() {
  labels[parseParam(++i)] = i;
}

function sym() {
  symbols[parseParam(++i)] = parseParam(++i);
}

function jmp() {
  retI.push(i + 1);
  i = labels[code[++i]];
}

function je() {
  if (stack.pop() === stack.pop()) jmp();
  else i++;
}

function jne() {
  if (stack.pop() !== stack.pop()) jmp();
  else i++;
}

function jlt() {
  if (stack.pop() < stack.pop()) jmp();
  else i++;
}

function jgt() {
  if (stack.pop() > stack.pop()) jmp();
  else i++;
}

function jle() {
  if (stack.pop() <= stack.pop()) jmp();
  else i++;
}

function jge() {
  if (stack.pop() >= stack.pop()) jmp();
  else i++;
}

function dumps() {
  symbols[parseParam(++i)] = stack;
}

function res() {
  stack = symbols[parseParam(++i)];
}

function print() {
  process.stdout.write(parseParam(++i).toString());
}

function exit() {
  process.exit(+parseParam(++i));
}

function clears() {
  stack = [];
}

function ret() {
  i = retI.pop();
}

//
// Math Ops
//
function add() {
  stack.push(stack.pop() + stack.pop());
}

function sub() {
  stack.push(stack.pop() - stack.pop());
}

function mul() {
  stack.push(stack.pop() * stack.pop());
}

function div() {
  stack.push(stack.pop() / stack.pop());
}

function mod() {
  stack.push(stack.pop() % stack.pop());
}

function pow() {
  stack.push(Math.pow(stack.pop(), stack.pop()));
}

function inc() {
  stack.push(stack.pop() + 1);
}

function dec() {
  stack.push(stack.pop() - 1);
}

//
// All ops in object
//
const ops = {
  push,
  pop,
  pops,
  label,
  sym,
  jmp,
  jne,
  je,
  jlt,
  jgt,
  jle,
  jge,
  dumps,
  res,
  print,
  exit,
  clears,
  ret,

  add,
  sub,
  mul,
  div,
  mod,
  pow,
  inc,
  dec,
};

function unescape(string) {
  return string
    .replaceAll("\\b", "\b")
    .replaceAll("\\t", "\t")
    .replaceAll("\\n", "\n")
    .replaceAll("\\f", "\f")
    .replaceAll("\\r", "\r")
    .replaceAll("\\'", "'")
    .replaceAll('\\"', '"');
}

function load(filename) {
  let c = readFileSync(filename, { encoding: "utf-8" });
  let val = "";

  for (let i = 0; i < c.length; i++) {
    if (c[i] === '"') {
      i++;
      while (c[i] !== '"') {
        val += c[i++];
      }

      if (val) code.push(unescape(val));
      val = "";

      continue;
    }

    if (c[i] === ";") {
      while (!/\n/.test(c[i])) {
        c[i++];
      }

      continue;
    }

    if (/[0-9]/.test(c[i])) {
      while (/[0-9]|\./.test(c[i])) {
        val += c[i++];
      }

      if (val) code.push(+unescape(val));
      val = "";

      continue;
    }

    if (/\s|\n/.test(c[i])) {
      if (val) code.push(unescape(val));
      val = "";

      continue;
    }

    val += c[i];
  }

  if (val) code.push(unescape(val));
}

function findLabels() {
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "label") {
      labels[code[++i]] = i++;
    } else continue;
  }
}

load(process.argv[2]);
findLabels();

for (i = 0; i < code.length; i++) {
  ops[code[i]]();
}
