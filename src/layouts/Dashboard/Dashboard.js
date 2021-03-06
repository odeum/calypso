import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { withStyles, Snackbar, Button } from '@material-ui/core';
import { Header, Sidebar, CircularLoader } from 'components';
import cx from 'classnames'
import dashboardRoutes from 'routes/dashboard.js';
import dashboardRoutes2 from 'routes/dashboard2.js';
import appStyle from 'assets/jss/material-dashboard-react/appStyle.js';
import { MuiThemeProvider } from '@material-ui/core/styles'
import logo from 'assets/img/logo.svg'
import cookie from 'react-cookies';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux'
import { getSettings } from 'redux/settings';
import withSnackbarHandler from 'components/Localization/SnackbarHandler';
import { Close } from 'variables/icons';
import { lightTheme, darkTheme } from 'variables/themes'
import { getUser } from 'variables/dataUsers';

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mobileOpen: false,
			headerTitle: '',
			goBackButton: false,
			url: '',
			menuRoute: 0,
			routes: null,
		}
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	handleSetHeaderTitle = (headerTitle, goBackButton, url, menuRoute) => {
		if (this._isMounted) {
			if (headerTitle !== this.state.headerTitle) {
				if (typeof headerTitle === 'string') {
					if (headerTitle !== this.state.headerTitle.id) {
						this.setState({
							headerTitle: {
								id: headerTitle,
								options: null
							},
							goBackButton: goBackButton,
							url,
							menuRoute
						})
					}
				}
				else {
					this.setState({
						headerTitle: headerTitle,
						goBackButton: goBackButton,
						url,
						menuRoute
					})
				}
			}
		}
	};
	handleGoBackButton = () => {
		this.props.history.push(this.state.url)
		this.setState({ url: '' })
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.handleSetHeaderTitle('Calypso', false, '', 'dashboard')
		}

		let session = cookie.load('SESSION');
		let user = null;
		if (session && typeof session !== 'undefined') {
			user = await getUser(session.userID).then(rs => {
				if (rs === null)
					this.props.history.push({
						pathname: '/404',
						prevURL: window.location.pathname
					});
				return rs;
			});
		}

		if (user && user.org && user.org.id === 137180100000113) {
			// this.props.history.push({
			// 	pathname: '/management/user/' + session.userID,
			// 	prevURL: window.location.pathname
			// });
			this.setState({ routes: dashboardRoutes2 });
		} else {
			this.setState({ routes: dashboardRoutes });
		}

		await this.props.getSettings().then(rs => {
			if (rs) {
				if (this.props.theme === 1) {
					document.body.style = 'background: #2e2e2e;';
				}
				else {
					document.body.style = 'background: #eee';
				}
				if (navigator.platform.indexOf('Win') > -1) {
					if (!this.props.loading) {
						if (this.refs.mainPanel) {
							//eslint-disable-next-line
							const ps = new PerfectScrollbar(this.refs.mainPanel);
						}
					}
				}
			}
			else {
				this.props.history.push('/login')
			}
		})
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.headerTitle.id !== this.state.headerTitle.id && this.refs.mainPanel)
			this.refs.mainPanel.scrollTop = 0
		if (prevProps.sId !== this.props.sId && this.props.sId !== '')
			this.setState({ openSnackbar: true })
		if (this.props.theme !== prevProps.theme) { 
			if (this.props.theme === 1) {
				document.body.style = 'background: #2e2e2e;';
			}
			else { 
				document.body.style = 'background: #eee';
			}
		}
	}

	render() {
		const { classes, t, loading, sOpt, ...rest } = this.props;
		const { routes } = this.state;

		let wrapperClasses = cx({
			[classes.darkBackground]: this.props.theme !== 0 ? true : false,
			[classes.wrapper]: true,
		}
		)
		return (
			<MuiThemeProvider theme={this.props.theme === 0 ? lightTheme : darkTheme}>
				<div className={wrapperClasses}>
					<div className={classes.mainPanel} ref={'mainPanel'}>
						{routes ? 
							<>
								<Header
									routes={routes}
									handleDrawerToggle={this.handleDrawerToggle}
									goBackButton={this.state.goBackButton}
									gbbFunc={this.handleGoBackButton}
									headerTitle={this.state.headerTitle}
									t={t}
									{...rest}
								/>
								<Fragment>
									<Sidebar
										routes={routes}
										logo={logo}
										handleDrawerToggle={this.handleDrawerToggle}
										open={this.state.mobileOpen}
										color='senti'
										t={t}
										menuRoute={this.state.menuRoute}
										{...rest}
									/>
									{!loading ? <Fragment>
										<div className={classes.container} id={'container'}>
											<Switch>
												{cookie.load('SESSION') ?
													dashboardRoutes.map((prop, key) => {
														if (prop.redirect) {
															return <Redirect from={prop.path} to={prop.to} key={key} />;
														}
														return <Route path={prop.path} render={(routeProps) => <prop.component {...routeProps} setHeader={this.handleSetHeaderTitle} />} key={key} />;
													})
													: <Redirect from={window.location.pathname} to={{
														pathname: '/login', state: {
															prevURL: window.location.pathname
														}
													}} />}
											</Switch>
										</div>
										<Snackbar
											anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
											open={this.props.sOpen}
											onClose={this.props.sClose}
											onExited={this.props.handleNextS}
											ContentProps={{
												'aria-describedby': 'message-id',
											}}
											ClickAwayListenerProps={{
												mouseEvent: false,
												touchEvent: false
											}}
											autoHideDuration={3000}
											message={<span>{t(this.props.sId, this.props.sOpt)}</span>}
											action={
												<Button size={'small'} variant={'text'} onClick={this.props.sClose} >
													<Close style={{ color: 'white' }} />
												</Button>
											}
										/>
									</Fragment> : <CircularLoader />}
								</Fragment>
							</>
							: "" }
					</div>
				</div >
			</MuiThemeProvider>

		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	loading: state.settings.loading,
	theme: state.settings.theme
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbarHandler()((withLocalization()(withStyles(appStyle)(App)))))
