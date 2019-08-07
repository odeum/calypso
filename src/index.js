// import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import registerServiceWorker from './serviceWorker';

registerServiceWorker()
var rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)

if (module.hot) {
	// Whenever a new version of App.js is available
	module.hot.accept('./App', function () {
		// Require the new version and render it instead
		var NextApp = require('./App').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}