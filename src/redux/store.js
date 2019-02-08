import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { settings } from './settings'
import { localization } from './localization'
import { favorites } from './favorites'
import { appState } from './appState'
import thunk from 'redux-thunk';

let reducers = combineReducers({ settings, localization, favorites, appState })
let composeMiddleware = compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)
export const store = createStore(reducers, composeMiddleware)