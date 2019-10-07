/*
  TODO: Let's look at optimization potentials by using Map() (with the key being the instanceof class) for the SIMPLIFIERS and DETAILERS variables
*/

// Import our types
import Range from './custom-types/range';
import Slice from './custom-types/slice';
import Tuple from 'immutable-tuple';
import TorchTensor from './custom-types/torch-tensor';
import TorchSize from './custom-types/torch-size';
import Plan from './custom-types/plan';
import PointerTensor from './custom-types/pointer-tensor';
import Message from './custom-types/message';
import Operation from './custom-types/operation';

// Import our helpers
import { getArgs } from './_helpers';

// Import our errors
import { NO_DETAILER } from './_errors';

// Create map of type name => type code.
const proto_info = require('pysyft-proto').proto_info;
const ID = {};
for (let type of Object.keys(proto_info.TYPES)) {
  ID[type] = proto_info.TYPES[type].code;
}

// These are the replace functions we will run to convert Javascript to Python
export const SIMPLIFY_REPLACERS = [
  [/null/g, 'None'], // Convert all nulls to Nones
  [/false/g, 'False'], // Convert all false to False
  [/true/g, 'True'] // Convert all true to True
];

// These are the replace functions we will run to convert Python to Javascript
export const DETAIL_REPLACERS = [
  [/\(/g, '['], // Convert all Python tuples into a Javascript Array
  [/\)/g, ']'],
  [/b'/g, "'"], // Convert all undefined 'b' functions everywhere, remove them
  [/'/g, '"'], // Convert all single quotes to double quotes so JSON can parse correctly
  [/None/g, null], // Convert all Nones to nulls
  [/False/g, false], // Convert all False to false
  [/True/g, true], // Convert all True to true
  [/,\s*?\]/g, ']'] // Trim all Arrays with an extra comma
];

// A simple function to run the above replacers
export const runReplacers = (data, replacers) => {
  for (let i = 0; i < replacers.length; i++) {
    data = data.replace(...replacers[i]);
  }

  return data;
};

// To simplify, we must take a Javascript object and turn it into a serialized Python string that can be interpreted by PySyft
// This involves the following steps in order:
// 1. Recursively parse the data
// 2. Depending on the data type, we may run it through a simplifier function to convert that value into a string
// 3. Run the replacers, which will convert any Javascript values into Python (null, false, true, etc.)
export const simplify = data => {
  const SIMPLIFIERS = {
    dict: d =>
      `(${ID.dict}, (${Array.from(d)
        .map(([key, value]) => `(${parse(key)}, ${parse(value)})`)
        .join()}))`,
    list: d => `(${ID.list}, (${d.map(i => parse(i)).join()}))`,
    range: d => `(${ID.range}, (${d.start}, ${d.end}, ${d.step}))`,
    set: d => `(${ID.set}, (${[...d].map(i => parse(i)).join()}))`,
    slice: d => `(${ID.slice}, (${d.start}, ${d.end}, ${d.step}))`,
    str: d => `(${ID.str}, (b'${d}'))`,
    tuple: d => `(${ID.tuple}, (${d.map(i => parse(i)).join()}))`,
    torchTensor: d =>
      `(${ID['torch.Tensor']}, (${getArgs(TorchTensor)
        .map(i => parse(d[i]))
        .join()}))`,
    torchSize: d => `(${ID['torch.Size']}, (${d.size}))`,
    plan: d => {
      const args = getArgs(Plan),
        operations = d[args[0]].map(i => parse(i)),
        rest = args.slice(1).map(i => parse(d[i]));

      return `(${
        ID['syft.messaging.plan.Plan']
      }, ((${operations}), ${rest.join()}))`;
    },
    pointerTensor: d =>
      `(${ID['syft.generic.pointers.pointer_tensor.PointerTensor']}, (${getArgs(
        PointerTensor
      )
        .map(i => parse(d[i]))
        .join()}))`,
    message: d =>
      `(${ID['syft.messaging.message.Message']}, (${getArgs(Message)
        .map(i => parse(d[i]))
        .join()}))`,
    operation: d =>
      `(${ID['syft.messaging.message.Operation']}, (${d.type}, (${parse(
        d.message
      )}, (${d.return_ids.join()}))))`
  };

  const parse = d => {
    if (d === null) return 'null';

    let simplifierId = null;

    if (d instanceof Map) simplifierId = 'dict';
    else if (d instanceof Array) simplifierId = 'list';
    else if (d instanceof Range) simplifierId = 'range';
    else if (d instanceof Set) simplifierId = 'set';
    else if (d instanceof Slice) simplifierId = 'slice';
    else if (typeof d === 'string') simplifierId = 'str';
    else if (d instanceof Tuple) simplifierId = 'tuple';
    else if (d instanceof TorchTensor) simplifierId = 'torchTensor';
    else if (d instanceof TorchSize) simplifierId = 'torchSize';
    else if (d instanceof Plan) simplifierId = 'plan';
    else if (d instanceof PointerTensor) simplifierId = 'pointerTensor';
    else if (d instanceof Operation) simplifierId = 'operation';
    else if (d instanceof Message) simplifierId = 'message';

    if (simplifierId !== null) {
      return SIMPLIFIERS[simplifierId](d);
    }

    return d;
  };

  return runReplacers(parse(data), SIMPLIFY_REPLACERS);
};

// To detail, we must take a Python string serialized in PySyft and turn it into a Javascript object that we can manipulate and store
// This involves the following steps in order:
// 1. Run the replacers, which will convert any Python values into Javascript (() => [], None, True, False, etc.)
// 2. Parse the string as JSON
// 3. Recursively parse the data
// 4. Depending on the data type, we may run it through a detailer function to convert that value into the appropriate JAvascript type
export const detail = data => {
  const DETAILERS = {};
  DETAILERS[ID.dict] = d => new Map(d.map(i => i.map(j => parse(j))));
  DETAILERS[ID.list] = d => d.map(i => parse(i));
  DETAILERS[ID.range] = d => new Range(...d);
  DETAILERS[ID.set] = d => new Set(d.map(i => parse(i)));
  DETAILERS[ID.slice] = d => new Slice(...d);
  DETAILERS[ID.str] = d => d[0];
  DETAILERS[ID.tuple] = d => Tuple(...d.map(i => parse(i)));
  DETAILERS[ID['torch.Tensor']] = d => new TorchTensor(...d.map(i => parse(i)));
  DETAILERS[ID['torch.Size']] = d => new TorchSize(d);
  DETAILERS[ID['syft.messaging.plan.Plan']] = d =>
    new Plan(d[0].map(j => parse(j)), ...d.slice(1).map(i => parse(i)));
  DETAILERS[ID['syft.generic.pointers.pointer_tensor.PointerTensor']] = d =>
    new PointerTensor(...d.map(i => parse(i)));
  DETAILERS[ID['syft.messaging.message.Message']] = d =>
    new Message(...d.map(i => parse(i)));
  DETAILERS[ID['syft.messaging.message.Operation']] = d =>
    new Operation(parse(d[1][0]), Tuple(...d[1][1]));

  const parse = d => {
    if (
      Array.isArray(d) &&
      d.length === 2 &&
      typeof d[0] === 'number' &&
      Array.isArray(d[1])
    ) {
      const detailer = DETAILERS[d[0]];
      if (detailer) {
        return detailer(d[1]);
      }

      throw new Error(NO_DETAILER(d));
    }

    return d;
  };

  return parse(JSON.parse(runReplacers(data, DETAIL_REPLACERS)));
};
