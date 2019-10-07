import Plan from '../../src/custom-types/plan';
import Tuple from 'immutable-tuple';
import { firstPointerTensor, secondPointerTensor } from './pointer-tensor';
import Operation from '../../src/custom-types/operation';

export const simplifiedPlan = `
(19, 
  (
    (
      (29, (1, (
        (6, (
          (5, (b'__add__',)), 
          (21, (${firstPointerTensor.id}, ${firstPointerTensor.idAtLocation}, ${
  firstPointerTensor.locationId
}, None, (10, (2,)), ${
  firstPointerTensor.garbageCollectData ? 'True' : 'False'
})),
          (6, (
            (21, (${firstPointerTensor.id}, ${
  firstPointerTensor.idAtLocation
}, ${firstPointerTensor.locationId}, None, (10, (2,)), ${
  firstPointerTensor.garbageCollectData ? 'True' : 'False'
})),
          )),
          (0, ())
        )), 
        (53361601662,)
      ))), 
      (29, (1, (
        (6, (
          (5, (b'torch.abs',)), 
          None, 
          (6, (
            (21, (${secondPointerTensor.id}, ${
  secondPointerTensor.idAtLocation
}, ${secondPointerTensor.locationId}, None, None, ${
  secondPointerTensor.garbageCollectData ? 'True' : 'False'
})),
          )),
          (0, ())
        )),
        (68554228008,)
      )))
    ), 
    85156589176, 
    (1, (30300883787,)), 
    (6, (68554228008,)), 
    (1, ()), 
    (5, (b'plan_double_abs',)), 
    None, 
    None, 
    True
  )
)
`;

export const operations = [
  new Operation(
    Tuple('__add__', firstPointerTensor, Tuple(firstPointerTensor), new Map()),
    Tuple(53361601662)
  ),
  new Operation(
    Tuple('torch.abs', null, Tuple(secondPointerTensor), new Map()),
    Tuple(68554228008)
  )
];
export const id = 85156589176;
export const args = [30300883787];
export const results = Tuple(68554228008);
export const states = [];
export const name = 'plan_double_abs';
export const tags = null;
export const description = null;
export const isBuilt = true;

export const detailedPlan = new Plan(
  operations,
  id,
  args,
  results,
  states,
  name,
  tags,
  description,
  isBuilt
);
