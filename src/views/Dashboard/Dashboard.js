import { Button, withStyles } from '@material-ui/core';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import imgs from 'assets/img/Squared'
import { Caption, ItemG } from 'components';
import GridContainer from 'components/Grid/GridContainer';
import withLocalization from 'components/Localization/T';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import pj from '../../../package.json';
import MediaCard from 'components/Cards/MediaCard.js';
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
		const { t } = this.props
		return (
			<Fragment>
				<GridContainer>
					<ItemG container justify={'center'} xs={12} sm={6} md={3}>
						<MediaCard
							img={imgs.users}
							header={t('dialogs.dashboard.title.createUser')}
							content={t('dialogs.dashboard.message.createUser')}
							// leftAction={this.renderAction('actions.learnMore', '/')}
							rightAction={this.renderAction('actions.createUser', '/management/users/new', true)}
						/>
					</ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={3}>
						<MediaCard
							img={imgs.hosting}
							header={t('dialogs.dashboard.title.createOrg')}
							content={t('dialogs.dashboard.message.createOrg')}
							rightAction={this.renderAction('actions.createOrg', 'management/orgs/new', true)}
						/>
					</ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={3}>
						<MediaCard
							img={imgs.users}
							header={t('dialogs.dashboard.title.manageUsers')}
							content={t('dialogs.dashboard.message.manageUsers')}
							rightAction={this.renderAction('actions.manage', '/management/orgs', true)}
						/>
					</ItemG>
					<ItemG container justify={'center'} xs={12} sm={6} md={3}>
						<MediaCard
							img={imgs.hosting}
							header={t('dialogs.dashboard.title.manageOrgs')}
							content={t('dialogs.dashboard.message.manageOrg')}
							rightAction={this.renderAction('actions.manage', '/management/orgs', true)}
						/>
					</ItemG>
					
				</GridContainer>
				<ItemG styles={{ flex: 1 }} container justify={'center'} xs={12}>
					<Caption>
						Calypso User Management {pj.version}
					</Caption>
				</ItemG>
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