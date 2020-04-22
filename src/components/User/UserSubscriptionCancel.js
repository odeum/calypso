import React, { Component } from 'react';
import { Paper, withStyles, Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import moment from 'moment';

import { GridContainer, ItemGrid, CircularLoader } from 'components';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { postSubscriptionChange, getNextPayDate } from 'variables/dataUsers';

class UserSubscriptionCancel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			cancelChecked: false,
			userId: this.props.match.params.id,
			loading: true,
			nextPayment: null
		}
	}

	componentDidMount = async () => {
		const { setHeader, location } = this.props;
		let prevURL = location.prevURL ? location.prevURL : '/management/users';
		setHeader('users.subscription.header', true, prevURL, 'users');

		let nextPayData = await getNextPayDate(this.state.userId);

		if (nextPayData && nextPayData.length) {
			this.setState({ 'nextPayment': nextPayData[0] });
		}

		this.setState({ 'loading': false });
	}

	handleChange = (event) => {
		this.setState({ 'cancelChecked': event.target.checked });
	}

	cancel = () => {
		this.props.history.goBack();
	}

	save = async () => {
		this.setState({ 'loading': true });

		let status = await postSubscriptionChange(this.state.userId, 'free');

		if (status === 200) {
			this.props.history.goBack();
		} else {
			this.setState({ 'loading': false });
		}
	}

	render() {
		const { classes, t } = this.props;
		const { loading, nextPayment } = this.state;

		return !loading ?
			<GridContainer>
				<Paper className={classes.paper}>
					<GridContainer>
						<ItemGrid xs={12}>
							<Typography variant="h5">
								{t('users.subscription.cancel')}
							</Typography>
						</ItemGrid>
						<ItemGrid xs={12}>
							<FormGroup row>
								<FormControlLabel
									control={<Checkbox
										checked={this.state.cancelChecked}
										onChange={this.handleChange}
										inputProps={{ 'aria-label': 'primary checkbox' }}
									/>}
									label={<Typography variant="body1" style={{ fontSize: 16 }}>
										{t('users.subscription.cancelaccept')}
									</Typography>}
								/>
							</FormGroup>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Typography variant="body1" style={{ fontSize: 16, fontStyle: 'italic' }}>
								{t('users.subscription.cancelwhen')} ({moment(nextPayment.deadline).format('DD. MMMM YYYY')})
							</Typography>
						</ItemGrid>

						<ItemGrid item xs={12}>
							<Button variant="contained" style={{ color: '#000', marginRight: 20 }} onClick={this.cancel}>{t('actions.cancel2')}</Button>
							<Button variant="contained" color="primary" style={{ color: '#fff' }} onClick={this.save} disabled={!this.state.cancelChecked}>{t('users.subscription.cancel')}</Button>
						</ItemGrid>

					</GridContainer>
				</Paper>
			</GridContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(UserSubscriptionCancel));