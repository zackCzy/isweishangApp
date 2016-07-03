/**
 * Created by zack on 16/5/25.
 */
import {createAction} from 'redux-actions';
import * as markdown from 'markdown';
import * as types from '../constants/ActionTypes';
import * as BannelService from '../services/BannelService';
import * as storageService from '../services/storage';

export const getHomeBannel = createAction(types.GET_HOME_BANNEL, BannelService.getHomeBannel, (data)=> {
	return {
		data
	};
});

export const firstOpenApp =createAction(types.FIRST_OPEN,()=>{
	storageService.setItem("home",{
		first:true
	});
	return {
		first:true
	}
})