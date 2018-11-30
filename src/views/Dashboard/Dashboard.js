import { Button, withStyles } from '@material-ui/core';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { Caption, ItemG } from 'components';
import GridContainer from 'components/Grid/GridContainer';
import withLocalization from 'components/Localization/T';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import pj from '../../../package.json';
// const Skycons = require('skycons')(window)

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0
		}
		props.setHeader('Calypso', false, '', 'dashboard')
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleChange = (value) => {
		this.setState({ value })
	}

	handleChangeIndex = index => {
		this.setState({ value: index })
	}
	
	renderAction = (text, loc, right) => {
		const { t, /* history */ } = this.props
		return <Button size={'small'} color={'primary'} component={Link} to={loc} style={right ? { marginLeft: 'auto' } : null}>{t(text)}</Button>
	}

	render() {
		// const { discoverSenti, t, history } = this.props
		return (
			<Fragment>
				<GridContainer>
					<ItemG container justify={'center'} xs={12}>
						<Caption>
						 	Calypso User Management {pj.version}
						</Caption>
					</ItemG>
				</GridContainer>
			</Fragment>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
	discoverSenti: state.settings.discSentiVal
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(Dashboard)))