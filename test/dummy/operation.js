import Operation from '../../src/custom-types/operation';
import { MSGTYPE_CMD } from '../../src/_constants';
import Tuple from 'immutable-tuple';

export const detailedMessage = Tuple(53361601662);
export const simplifiedMessage = `(53361601662,)`;

export const detailedReturnIds = Tuple(53361601662);
export const simplifiedReturnIds = `(53361601662,)`;

export const detailedOperation = new Operation(
  detailedMessage,
  detailedReturnIds
);
export const simplifiedOperation = `(29, (${MSGTYPE_CMD}, (${simplifiedMessage}, ${simplifiedReturnIds})))`;
