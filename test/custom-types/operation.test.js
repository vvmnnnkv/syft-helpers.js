import {
  detailedOperation,
  detailedMessage,
  detailedReturnIds
} from '../dummy/operation';

describe('Operation', () => {
  test('can be properly constructed', () => {
    expect(detailedOperation.message).toStrictEqual(detailedMessage);
    expect(detailedOperation.return_ids).toStrictEqual(detailedReturnIds);
  });
});
