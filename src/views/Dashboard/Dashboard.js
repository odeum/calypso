import { Button, withStyles } from '@material-ui/core';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
// import imgs from 'assets/img/Squared'
// import { Caption, ItemG } from 'components';
// import GridContainer from 'components/Grid/GridContainer';
import withLocalization from 'components/Localization/T';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import pj from '../../../package.json';
// import MediaCard from 'components/Cards/MediaCard.js';
import Org from 'views/Orgs/Org';
// const Skycons = require('skycons')(window)
import { getUser } from 'variables/dataUsers';
import cookie from 'react-cookies';

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0,
			doRender: false
		}
		props.setHeader('Calypso', false, '', 'dashboard')
	}

	componentWillMount = async () => {
		let session = cookie.load('SESSION');

		let user = await getUser(session.userID).then(rs => {
			if (rs === null)
				this.props.history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				});
			return rs;
		});

		if (user && user.org && user.org.id === 137180100000113) {
			this.props.history.push({
				pathname: '/management/user/' + session.userID,
				prevURL: window.location.pathname
			});
		} else {
			this.setState({ doRender: true });
		}
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
		const { t, location, history, setHeader, match } = this.props

		return (
			<Fragment>
				{this.state.doRender ?
					<Org t={t} location={location} history={history} setHeader={setHeader} match={match} />
					: ""}
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