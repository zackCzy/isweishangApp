import * as types from '../constants/ActionTypes';


const initialState = {
	hasNotRead: [],
	hasRead: [],
	unreadMessageCount: 0,
	conversation:[]
};


export default function (state = initialState, action) {
	const { payload, error, meta = {} } = action;
	const { sequence = {},userId='0' } = meta;
	if (sequence.type === 'start' || error) {
		return state;
	}

	switch (action.type) {
		case types.GET_RONGIM_LIST:
			return {
				...state,
				conversation:payload
			}
		case types.GET_MESSAGES_LIST:
			return {
				...state,
				unreadMessageCount: payload.hasnot_read_messages.length,
				hasRead: payload.has_read_messages,
				hasNotRead: payload.hasnot_read_messages
			};
		case types.GET_REDUCER_FROM_ASYNC_STORAGE:
			return {
				...state,
				...payload.message || initialState
			};
		case types.GET_UNREAD_MESSAGE_COUNT:
			return {
				...state,
				unreadMessageCount: payload
			};

		case types.MARK_AS_READ:
			return {
				...state,
				hasNotRead: [],
				hasRead: state.hasNotRead.concat(state.hasRead),
				unreadMessageCount: 0
			};
		case types.CLEAR_MESSAGE_UNREAD:
			state.conversation[userId]['unreadMessageCount']=0;
			return {
				...state
			}
		case types.LOGOUT:
			return initialState;
		default :
			return state;
	}
}
