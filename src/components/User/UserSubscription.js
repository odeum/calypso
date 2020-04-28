
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Paper, withStyles, Typography, Card, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import NumberFormat from 'react-number-format';

import { GridContainer, ItemGrid, CircularLoader } from 'components';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import UserSubscriptionList from 'components/User/UserSubscriptionList';
import UserSubscriptionForm from 'components/User/UserSubscriptionForm';
import { getLicenseTypes, getCurrentLicense, getNextPayDate } from 'variables/dataUsers';

class UserSubscription extends Component {
	constructor(props) {
		super(props)

		this.state = {
			newsubscription: '',
			tabValue: 0,
			loading: true,
			newSubscriptionDialogOpen: false,
			userId: this.props.match.params.id,
			licenseTypes: [],
			currentLicense: {},
			nextPayment: null,
			subscriptions: [],
			createSubscription: false
		}
	}

	componentDidMount = async () => {
		const { setHeader, location } = this.props;
		let prevURL = location.prevURL ? location.prevURL : '/management/users';

		setHeader('users.subscription.header', true, prevURL, 'users');

		await this.loadData();

		const getParams = new URLSearchParams(window.location.search); 
		if (getParams.get('new') === '1') {
			this.setState({ 'newSubscriptionDialogOpen': true, newsubscription: 'premium' });
		}
	}

	handleChange = (event) => {
		this.setState({ 'newsubscription': event.target.value });

		if (event.target.value !== this.state.currentLicense.type) {
			if (event.target.value === 'premium') {
				this.setState({ 'newSubscriptionDialogOpen': true });
			} else if (event.target.value === 'free') {
				this.props.history.push({ pathname: `/management/user/${this.props.match.params.id}/subscription/cancel`, prevURL: `/management/user/${this.props.match.params.id}/subscription` });
			}
		}
	}

	handleTabChange = (event, newValue) => {
		this.goToTab(newValue);
	}

	goToTab = (tabValue) => {
		this.setState({ 'tabValue': tabValue });
	}

	handleDialogClose = () => {
		this.setState({ 'newSubscriptionDialogOpen': false });
	}

	updateInvoiceInfo = () => {
		this.handleDialogClose();

		this.setState({ 'tabValue': 1, createSubscription: true });
	}

	loadData = async () => {
		this.setState({ 'loading': true });

		let licenseTypeData = await getLicenseTypes();

		if (licenseTypeData) {
			this.setState({ 'licenseTypes': licenseTypeData });
		}

		let currentLicenseData = await getCurrentLicense(this.state.userId);

		if (currentLicenseData && currentLicenseData.length) {
			this.setState({ 'currentLicense': currentLicenseData[0] });
		}

		let nextPayData = await getNextPayDate(this.state.userId);

		if (nextPayData && nextPayData.length) {
			this.setState({ 'nextPayment': nextPayData[0] });
		}

		this.goToTab(0);

		this.setState({ 'loading': false });
	}

	render() {
		const { loading, currentLicense } = this.state;
		const { classes, t } = this.props;

		return !loading ?
			<>
				<GridContainer>
					<Paper className={classes.paper}>
						<GridContainer>
							<ItemGrid container xs={2}>
								<Card className={classes.cursubinfobox}>
									<Typography variant="body1" style={{ fontSize: 16, marginBottom: 20 }}>
										{t('users.subscription.cursubtext')}
									</Typography>
									<Typography variant="h5">
										{currentLicense.type.charAt(0).toUpperCase() + currentLicense.type.slice(1)}
										<br />
										<NumberFormat value={currentLicense.price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'DKK '} suffix={',-'} /> {currentLicense.type === 'premium' ? 'årligt' : ''}
									</Typography>
									<FormControl variant="outlined" className={classes.formControl}>
										<InputLabel id="demo-simple-select-outlined-label">{t('users.subscription.changesubscription')}</InputLabel>
										<Select
											id="demo-simple-select-outlined"
											value={this.state.newsubscription}
											onChange={this.handleChange}
											label={t('users.subscription.changesubscription')}
										>
											{this.state.licenseTypes.map(type => {
												return <MenuItem key={type.type} value={type.type}>{type.type.charAt(0).toUpperCase() + type.type.slice(1)}</MenuItem>
											})}
										</Select>
									</FormControl>
								</Card>
							</ItemGrid>
							<ItemGrid container xs={2}>
								{this.state.nextPayment && this.state.nextPayment.type !== 'free' ?
									<Card className={classes.cursubinfobox}>
										<Typography variant="body1" style={{ fontSize: 16, marginBottom: 20 }}>
											{t('users.subscription.nextpaymentdate')}
										</Typography>
										<Typography variant="h5">
											{moment(this.state.nextPayment.deadline).format('DD. MMMM YYYY')}
										</Typography>
									</Card>
									: ""}
							</ItemGrid>
							<ItemGrid container xs={8}>
							</ItemGrid>
						</GridContainer>
						<GridContainer>
							<Tabs value={this.state.tabValue} onChange={this.handleTabChange} style={{ marginLeft: 15, marginBottom: 20 }}>
								<Tab label={t('users.subscription.header')} />
								<Tab label={t('users.subscription.invoiceinfo')} />
							</Tabs>
							
							<ItemGrid container xs={12}>
								{this.state.tabValue === 0 ? <UserSubscriptionList t={t} userId={this.state.userId} /> : ""}
								{this.state.tabValue === 1 ? <UserSubscriptionForm value={this.state.tabValue} t={t} userId={this.state.userId} createSubscription={this.state.createSubscription} reloadData={this.loadData} /> : ""}
							</ItemGrid>
						</GridContainer>
					</Paper>
				</GridContainer>

				<Dialog onClose={this.handleDialogClose} aria-labelledby="simple-dialog-title" open={this.state.newSubscriptionDialogOpen}>
					<DialogTitle id="simple-dialog-title" disableTypography={true}><Typography variant="h4">{t('users.subscription.newsubscription')}</Typography></DialogTitle>
					<DialogContent>
						<Typography variant="subtitle1">{t('users.subscription.newsubscriptiondesc')}</Typography>

						<Button variant="contained" color="primary" style={{ color: '#fff', marginTop: 30 }} onClick={this.updateInvoiceInfo}>{t('users.subscription.updateinvoiceinfo')}</Button>
					</DialogContent>
				</Dialog>
			</>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(UserSubscription));