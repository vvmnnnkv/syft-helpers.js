import TorchSize from '../../src/custom-types/torch-size';
import { runReplacers, SIMPLIFY_REPLACERS } from '../../src/serde';

export const torchSizeShape = [2];
export const torchSize2 = new TorchSize(torchSizeShape);

export const simplifiedTorchSize = runReplacers(
  `(10, (${torchSizeShape}))`,
  SIMPLIFY_REPLACERS
);
