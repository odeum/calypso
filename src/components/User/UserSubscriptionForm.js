import React, { Component } from 'react';
import { Typography, withStyles, Paper } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Radio from '@material-ui/core/Radio';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import moment from 'moment';

import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { getUser, getInvoiceData, saveInvoiceData, postSubscriptionChange } from 'variables/dataUsers';
import { getOrg } from 'variables/dataOrgs';
import { CircularLoader } from 'components';

class UserSubscriptionForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openExtended: false,
			mail: false,
			extended: {
				bio: "",
				position: "",
				location: "",
				linkedInURL: "",
				twitterURL: "",
				birthday: moment('01011990', 'DDMMYYYY'),
			},
			user: {
				userName: '',
				firstName: '',
				lastName: '',
				phone: '',
				email: '',
				image: null,
				aux: {
					odeum: {
						language: 'da'
					},
					calypso: {
						mail: '',
						license: '',
					}
				},
				sysLang: 2,
				org: {
					id: '',
					name: 'Ingen organisation'
				},
				groups: {
					'137180100000025': {
						id: 137180100000025,
						name: props.t('users.groups.user')
					}
				}
			},
			orgs: [],
			creating: false,
			created: false,
			loading: true,
			selectedGroup: '',
			selectedLicense: '',
			invoiceData: null,
			isEditing: this.props.createSubscription
		}
	}

	componentDidMount = async () => {
		await this.getUser();

		let invoice = await getInvoiceData(this.props.userId);

		if (invoice) {
			this.setState({ invoiceData: invoice });
		}

		if (this.props.createSubscription && this.state.user.org && this.state.user.org.id !== '-1') {
			let orgData = await getOrg(this.state.user.org.id);

			if (orgData) {
				let newData = { ...this.state.invoiceData };
				newData.address = orgData.address;
				newData.city = orgData.city;
				newData.ean = orgData.aux.ean;
				newData.cvr = orgData.aux.cvr;
				newData.email = this.state.user.email;
				newData.organization = orgData.name;
				newData.postCode = orgData.zip;

				this.setState({ invoiceData: newData });
			}
		}

		this.setState({ loading: false });
	}

	getUser = async () => {
		let id = this.props.userId
		if (id) {
			let user = await getUser(id).then(rs => {
				if (rs === null)
					this.props.history.push({
						pathname: '/404',
						prevURL: window.location.pathname
					})
				return rs
			});

			this.setState({
				user: {
					...user,
				},
				mail: user.aux.calypso ? user.aux.calypso.mail : false,
				selectedLicense: user.aux.calypso && user.aux.calypso.license ? user.aux.calypso.license : '',
			});
		}
	}

	handleRadioChange = (event) => {
		let newData = { ...this.state.invoiceData };

		newData['invoiceBy'] = event.target.value;

		this.setState({ invoiceData: newData });
	}

	toggleEditMode = () => {
		this.setState({ isEditing: !this.state.isEditing });
	}

	saveFormData = async () => {
		this.setState({ loading: true });

		let status = 0;

		if (this.props.createSubscription) {
			status = await postSubscriptionChange(this.props.userId, 'premium');

			if (status === 200) {
				status = await saveInvoiceData(this.props.userId, this.state.invoiceData);
			}
		} else {
			status = await saveInvoiceData(this.props.userId, this.state.invoiceData);
		}

		if (status === 200) {
			this.setState({ isEditing: false, loading: false });

			this.props.reloadData();
		} else {
			this.setState({ loading: false });
		}
	}

	handleFieldChange = (event) => {
		event.persist();

		let newData = { ...this.state.invoiceData };

		newData[event.target.id] = event.target.value;

		this.setState({ invoiceData: newData });
	}

	render() {
		const { classes, t } = this.props;
		const { user, loading, invoiceData } = this.state;

		return !loading ? 
			<>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="h5" style={{ marginBottom: 30 }}>{t('users.groups.user')}</Typography>
					</Grid>			
					<Grid item xs={12}>
						<Paper className={classes.subscriptionpaper} style={{ marginBottom: 30, maxWidth: 800 }}>
							<List>
								<ListItem>
									<ListItemText primary={t('users.fields.name')} style={{ color: '#58606a' }} />
									<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>{user.firstName} {user.lastName}</ListItemSecondaryAction>
								</ListItem>
								<Divider style={{ marginLeft: 15, marginRight: 15 }} />
								<ListItem>
									<ListItemText primary={t('users.fields.email')} style={{ color: '#58606a' }} />
									<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>{user.email}</ListItemSecondaryAction>
								</ListItem>
								<Divider style={{ marginLeft: 15, marginRight: 15 }} />
								<ListItem>
									<ListItemText primary={t('users.fields.organisation')} style={{ color: '#58606a' }} />
									<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>{user.org.name}</ListItemSecondaryAction>
								</ListItem>
							</List>
						</Paper>
					</Grid>
				</Grid>

				<Grid container style={{ maxWidth: 800 }}>
					<Grid item xs={11}>
						<Typography variant="h5" style={{ marginBottom: 30 }}>{t('users.subscription.invoiceinfo')}</Typography>
					</Grid>
					<Grid item xs={1} align="right">
						{!this.state.isEditing ?
							<IconButton aria-label="edit" onClick={this.toggleEditMode} style={{ backgroundColor: '#38aa91', color: '#fff' }}>
								<EditIcon />
							</IconButton>
							: ""}
					</Grid>
					<Grid item xs={12}>
						<Paper className={classes.subscriptionpaper} style={{ maxWidth: 800 }}>
							<form noValidate autoComplete="off">
								<List>
									<ListItem>
										<ListItemText primary={t('users.fields.organisation')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="organization" value={invoiceData.organization} onChange={this.handleFieldChange} /> : invoiceData.organization}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />
									<ListItem>
										<ListItemText primary={t('orgs.fields.CVR')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="cvr" value={invoiceData.cvr} onChange={this.handleFieldChange} /> : invoiceData.cvr}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />
									<ListItem>
										<ListItemText primary={t('orgs.fields.address')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="address" value={invoiceData.address} onChange={this.handleFieldChange} /> : invoiceData.address}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />

									<ListItem>
										<ListItemText primary={t('orgs.fields.zip')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="postCode" value={invoiceData.postCode} onChange={this.handleFieldChange} /> : invoiceData.postCode}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />

									<ListItem>
										<ListItemText primary={t('orgs.fields.city')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="city" value={invoiceData.city} onChange={this.handleFieldChange} /> : invoiceData.city}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />

									<ListItem>
										<ListItemText primary={t('orgs.fields.att')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="attention" value={invoiceData.attention} onChange={this.handleFieldChange} /> : invoiceData.attention}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />

									<ListItem>
										<ListItemText primary={t('users.subscription.orderref')} style={{ color: '#58606a' }} />
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="orderRef" value={invoiceData.orderRef} onChange={this.handleFieldChange} /> : invoiceData.orderRef}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ marginLeft: 15, marginRight: 15 }} />
									<ListItem>
										<ListItemText primary={t('users.subscription.invoicemethod')} secondary={
											!this.state.isEditing ?
												(invoiceData.invoiceBy === 'ean') ? <span style={{ color: '#58606a' }}>{t('orgs.fields.EAN')}</span> : <span style={{ color: '#58606a' }}>{t('users.fields.email')}</span>
												: ""}
										style={{ color: '#58606a' }}
										/>
									</ListItem>
									<ListItem>
										{this.state.isEditing ?
											<ListItemIcon>
												<FormGroup row>
													<FormControlLabel
														control={<Radio
															id="email"
															edge="start"
															checked={invoiceData.invoiceBy === 'email' ? true : false}
															onChange={this.handleRadioChange}
															value="email"
														/>}
														label={<Typography variant="body1" style={{ color: '#58606a' }}>
															{t('users.fields.email')}
														</Typography>}
													/>
												</FormGroup>
											</ListItemIcon>
											: "" }
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="email" label={t('users.subscription.enteremail')} value={invoiceData.email} onChange={this.handleFieldChange} /> : "" }
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem>
										{this.state.isEditing ?
											<ListItemIcon>
												<FormGroup row>
													<FormControlLabel
														control={<Radio
															id="ean"
															edge="start"
															checked={invoiceData.invoiceBy === 'ean' ? true : false}
															onChange={this.handleRadioChange}
															value="ean"
														/>}
														label={<Typography variant="body1" style={{ color: '#58606a' }}>
															{t('orgs.fields.EAN')}
														</Typography>}
													/>
												</FormGroup>
											</ListItemIcon>
											: "" }
										<ListItemSecondaryAction style={{ color: '#58606a', fontWeight: 'normal', marginRight: 15 }}>
											{this.state.isEditing ? <TextField id="ean" label={t('users.subscription.enterean')} value={invoiceData.ean} onChange={this.handleFieldChange} /> : "" }
										</ListItemSecondaryAction>
									</ListItem>
								</List>
							</form>
						</Paper>
					</Grid>

					{this.state.isEditing ?
						<Grid item xs={12} align="right">
							<Button variant="contained" style={{ color: '#000', marginRight: 20, marginTop: 30 }} onClick={this.toggleEditMode}>{t('actions.cancel')}</Button>
							<Button variant="contained" color="primary" style={{ color: '#fff', marginTop: 30 }} onClick={this.saveFormData}>{t('actions.save')}</Button>
						</Grid>
						: ""}
				</Grid>
			</>
			: <CircularLoader />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(UserSubscriptionForm));