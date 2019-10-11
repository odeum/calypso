import React, { Component } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import indexRoutes from 'routes/index.js'
// import { MuiThemeProvider } from '@material-ui/core/styles'
import 'assets/css/material-dashboard-react.css'
import TProvider from 'components/Localization/TProvider'

import 'core-js/features/set'; 
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';
import { MuiThemeProvider } from '@material-ui/core';
import { lightTheme } from 'variables/themes';

var countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))
countries.registerLocale(require('i18n-iso-countries/langs/da.json'))

const hist = createBrowserHistory();


class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<TProvider>
					<MuiThemeProvider theme={lightTheme}>
						<Router history={hist}>
							<Switch>
								{indexRoutes.map((prop, key) => {
									return <Route path={prop.path} component={prop.component} key={key} exact={prop.exact ? true : false} />;
								})}
							</Switch>
						</Router>
					</MuiThemeProvider>
				</TProvider>
			</Provider>
		)
	}
}


export default App