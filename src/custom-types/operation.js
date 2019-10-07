import { MSGTYPE_CMD } from '../_constants';
import Message from './message';

export default class Operation extends Message {
  constructor(message, return_ids) {
    super(MSGTYPE_CMD);
    this.message = message;
    this.return_ids = return_ids;
  }
}
