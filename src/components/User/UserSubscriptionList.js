import React, { Component, Fragment } from 'react';
import { Typography, withStyles, Paper } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import moment from 'moment';
import NumberFormat from 'react-number-format';

import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { CircularLoader } from 'components';
import { getSubscriptions } from 'variables/dataUsers';

class UserSubscriptionList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			subscriptions: []
		}
	}

	componentDidMount = async () => {
		let subscriptionsData = await getSubscriptions(this.props.userId);

		if (subscriptionsData) {
			this.setState({ 'subscriptions': subscriptionsData });
		}

		this.setState({ 'loading': false });
	}

	render() {
		const { classes } = this.props;
		const { loading, subscriptions } = this.state;

		return !loading ?
			<Paper className={classes.subscriptionpaper} style={{ maxWidth: 800 }}>
				<List>
					{subscriptions.map((subscription, index) => {
						return (
							<Fragment key={index}>
								<ListItem>
									<ListItemText
										className={classes.listPrice}
										primary={<Typography variant="h5">{subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}</Typography>}
										secondary={
											<Typography variant="body1" style={{ fontSize: 16, color: '#666c74' }}>
												{moment(subscription.from).format('DD. MMM YYYY') + ' til ' + (subscription.to.length ? moment(subscription.to).format('DD. MMM YYYY') : '-')}
											</Typography>
										}
									/>
									<ListItemSecondaryAction className={classes.listPrice}>
										<NumberFormat value={subscription.price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'DKK '} suffix={',-'} />
									</ListItemSecondaryAction>
								</ListItem>
								<Divider style={{ marginLeft: 15, marginRight: 15 }} />
							</Fragment>
						)
					})}
				</List>
			</Paper>
			: <CircularLoader />;
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges
});

const mapDispatchToProps = (dispatch) => ({
	// isFav: (favObj) => dispatch(isFav(favObj)),
	// updateFav: (favObj) => dispatch(updateFav(favObj)),
	// getSettings: async () => dispatch(await getSettings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(UserSubscriptionList));