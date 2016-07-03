import * as user from './user';
import * as utils from './utils';
import * as message from './message';
import * as topic from './topic';
import * as home from './home';
import * as chat from './chat';

export default {
	...user,
	...utils,
	...message,
	...topic,
	...home,
	...chat
};


