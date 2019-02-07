import React, { Component, Fragment } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GridContainer, ItemGrid } from 'components';
import DisplaySettings from './SettingsCards/DisplaySettings';
import { changeLanguage } from 'redux/localization';
import withLocalization from 'components/Localization/T';
import { changeTRP, changeTheme, changeSideBarLoc, changeDiscoverSenti, saveSettingsOnServ, finishedSaving } from 'redux/settings';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Toolbar from 'components/Toolbar/Toolbar';
import { Laptop } from 'variables/icons';

//Add Section Calibrated/Uncalibrated data
class Settings extends Component {
	constructor(props) {
		super(props)
		props.setHeader('settings.pageTitle', false, '', 'settings')
	}
	tabs = [
		{ id: 0, title: '', label: <Laptop />, url: `#display` },
	]
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			this.props.s('snackbars.settingsSaved')
			this.props.finishedSaving()
		}
	}

	render() {
		const { t } = this.props
		const { language, sideBar, changeSideBarLoc, trp, changeTRP, theme, changeTheme, changeDiscoverSenti, discSentiVal, changeLanguage } = this.props
		return (
			<Fragment>
				<Toolbar
					noSearch
					history={this.props.history}
					match={this.props.match}
					tabs={this.tabs}
				/>
				<GridContainer>
					<ItemGrid xs={12} noMargin id={'display'}>
						<DisplaySettings
							trp={trp}
							changeTRP={changeTRP}
							theme={theme}
							changeTheme={changeTheme}
							language={language}
							changeLanguage={changeLanguage}
							sideBar={sideBar}
							changeSideBarLoc={changeSideBarLoc}
							discSentiVal={discSentiVal}
							changeDiscoverSenti={changeDiscoverSenti}
							t={t}
						/>
					</ItemGrid>
				</GridContainer>
			</Fragment>

		)
	}
}

const mapStateToProps = state => {
	const s = state.settings
	return {
		saved: s.saved,
		settings: s,
		language: state.localization.language,
		theme: s.theme,
		trp: s.trp,
		sideBar: s.sideBar,
		discSentiVal: s.discSentiVal,
		calibration: s.calibration,
		
		count: s.count,
		calNotifications: s.calNotifications,
		
		chartType: s.chartType,

		alerts: s.alerts,
		didKnow: s.didKnow
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeDiscoverSenti: val => dispatch(changeDiscoverSenti(val)),
		changeLanguage: code => dispatch(changeLanguage(code)),
		changeTRP: nr => dispatch(changeTRP(nr)),
		changeTheme: t => dispatch(changeTheme(t)),
		changeSideBarLoc: loc => dispatch(changeSideBarLoc(loc)),

		// changeCalType: type => dispatch(changeCalType(type)),
		// changeCount: count => dispatch(changeCount(count)),
		// changeCalNotif: type => dispatch(changeCalNotif(type)),

		// changeAlerts: t => dispatch(changeAlerts(t)),
		// changeDidKnow: t => dispatch(changeDidKnow(t)),

		// changeChartType: type => dispatch(changeChartType(type)),

		saveSettings: () => dispatch(saveSettingsOnServ()),
		finishedSaving: () => dispatch(finishedSaving())
	}
}
const Setting = compose(withLocalization(), withSnackbar())(Settings)
export default connect(mapStateToProps, mapDispatchToProps)(Setting)
