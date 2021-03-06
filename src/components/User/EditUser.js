import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { editUser, getUser } from 'variables/dataUsers';
import { getAllOrgs } from 'variables/dataOrgs';
import { GridContainer, ItemGrid, Warning, Danger, TextF, CircularLoader, ItemG } from 'components';
import { Paper, Collapse, withStyles, MenuItem, Select, FormControl, InputLabel, Grid, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Save, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons'
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { isFav, updateFav } from 'redux/favorites';
import MomentUtils from '@date-io/moment';
// import moment from 'moment'
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment'
import { getSettings } from 'redux/settings';

class EditUser extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openExtended: false,
			mail: false,
			extended: {
				bio: "",
				position: "",
				location: "",
				// recoveryEmail: "",
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
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		const { setHeader, location } = this.props
		let prevURL = location.prevURL ? location.prevURL : '/management/users'
		setHeader('users.editUser', true, prevURL, 'users')
		if (this._isMounted) {
			await this.getUser()
			await this.getOrgs()
		}
	}
	getUser = async () => {
		let id = this.props.match.params.id
		if (id) {
			let user = await getUser(id).then(rs => {
				if (rs === null)
					this.props.history.push({
						pathname: '/404',
						prevURL: window.location.pathname
					})
				return rs
			})
			let g = 0
			let userGroups = Object.keys(user.groups)
			userGroups.sort((a, b) => a > b ? 1 : -1)
			if (userGroups.find(x => x === '137180100000026'))
				g = '137180100000026'
			if (userGroups.find(x => x === '137180100000025'))
				g = '137180100000025'
			if (userGroups.find(x => x === '137180100000023'))
				g = '137180100000023'

			this.setState({
				selectedGroup: g,
				user: {
					...user,
					groups: Object.keys(user.groups).map(g => ({ id: g, name: user.groups[g].name, appId: user.groups[g].appId }))
				},
				mail: user.aux.calypso ? user.aux.calypso.mail : false,
				extended: user.aux.calypso ? user.aux.calypso.extendedProfile ? 
					user.aux.calypso.extendedProfile : this.state.extended : this.state.extended
			
			})
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	getOrgs = async () => {
		let orgs = await getAllOrgs().then(rs => rs)
		this.setState({
			orgs: orgs,
			loading: false
		})
	}
	handleEditUser = async () => {
		const { user, openExtended } = this.state
		let groups = {}
		this.state.user.groups.forEach(x => {
			groups[x.id] = {
				...x
			}
		})
		let newUser = {
			...this.state.user,
			aux: {
				...this.state.user.aux,
				calypso: {
					...this.state.user.aux.calypso,
					mail: this.state.mail
				}
			},
			userName: user.email,
			groups: groups
		}
		if (!newUser.aux.calypso) { 
			newUser.aux.calypso = {}
		}
		if (openExtended) {
			newUser.aux.calypso.extendedProfile = this.state.extended
		}

		await editUser(newUser).then(rs => rs ?
			this.close() :
			this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('orgs.validation.networkError') })
		)
	}
	close = async () => {
		// console.log(rs)
		const { isFav, updateFav } = this.props
		const { user } = this.state
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.id}`
		}
		await this.props.getSettings()
		if (isFav(favObj)) {
			updateFav(favObj)
		}
		this.setState({ created: true, creating: false })
		const { s, history } = this.props
		s('snackbars.userUpdated', { user: `${user.firstName} ${user.lastName}` })
		history.push(`/management/user/${user.id}`)
	}

	handleChange = prop => e => {
		this.setState({
			user: {
				...this.state.user,
				[prop]: e.target.value
			}
		})
	}
	handleValidation = () => {
		let errorCode = [];
		const { email } = this.state.user
		if (email === '') {
			errorCode.push(4)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
		})
		if (errorCode.length === 0)
			return true
		else
			return false
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 0:
				return t('users.validation.nouserName')
			case 1:
				return t('users.validation.nofirstName')
			case 2:
				return t('users.validation.nolastName')
			case 3:
				return t('users.validation.nophone')
			case 4:
				return t('users.validation.noemail')
			case 5:
				return t('users.validation.noorg')
			case 6:
				return t('users.validation.nogroup')
			default:
				return ''
		}

	}

	handleLangChange = e => {
		this.setState({
			user: {
				...this.state.user,
				aux: {
					...this.state.user.aux,
					odeum: {
						...this.state.user.aux.odeum,
						language: e.target.value
					}
				}
			}
		})
	}
	handleGroupChange = e => {
		const { user } = this.state
		let groups = user.groups
		groups = groups.filter(x => !this.groups().some(y => x.id === y.id))
		let g = this.groups()[this.groups().findIndex(x => x.id === e.target.value)]
		groups.push(g)
		this.setState({
			selectedGroup: e.target.value,
			user: {
				...this.state.user,
				groups: groups
			}
		})
	}
	handleOrgChange = e => {
		this.setState({
			user: {
				...this.state.user,
				org: {
					id: e.target.value
				}
			}
		})
	}
	renderOrgs = () => {
		const { classes, t, accessLevel } = this.props
		const { orgs, user, error } = this.state
		const { org } = user
		return accessLevel.apiorg.editusers ? <FormControl className={classes.formControl}>
			<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
				{t('users.fields.organisation')}
			</InputLabel>
			<Select
				error={error}
				fullWidth={false}
				color={'primary'}
				value={org.id}
				onChange={this.handleOrgChange}>
				{orgs ? orgs.map(org => (
					<MenuItem
						key={org.id}
						value={org.id}
					>
						{org.name}
					</MenuItem>
				)) : null}
			</Select>
		</FormControl> : null
	}
	renderLanguage = () => {
		const { t, classes } = this.props
		const { error, user } = this.state
		let languages = [
			{ value: 'en', label: t('settings.languages.en') },
			{ value: 'da', label: t('settings.languages.da') }
		]
		return <FormControl className={classes.formControl}>
			<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
				{t('users.fields.language')}
			</InputLabel>
			<Select
				error={error}
				fullWidth={false}
				color={'primary'}
				value={user.aux.odeum.language}
				onChange={this.handleLangChange}>
				{languages.map(l => (
					<MenuItem
						key={l.value}
						value={l.value}
					>
						{l.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	}
	groups = () => {
		const { accessLevel, t } = this.props
		return [
			{
				id: '137180100000026',
				appId: '1220',
				name: t('users.groups.accountManager'),
				show: accessLevel.apiorg.editusers ? true : false
			},
			{
				id: '137180100000023',
				appId: '1220',
				name: t('users.groups.superUser'),
				show: accessLevel.apisuperuser ? true : false

			},
			{
				id: '137180100000025',
				appId: '1220',
				name: t('users.groups.user'),
				show: true
			}
		]
	}
	renderAccess = () => {
		const { t, classes, accessLevel } = this.props
		const { error, selectedGroup, user } = this.state
		let rend = false
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			rend = true
		}
		return rend ? <FormControl className={classes.formControl}>
			<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
				{t('users.fields.accessLevel')}
			</InputLabel>
			<Select
				error={error}
				fullWidth={false}
				color={'primary'}
				value={selectedGroup}
				onChange={this.handleGroupChange}>
				{this.groups().map(g => g.show ? (
					<MenuItem
						key={g.id}
						value={g.id}>
						{g.name}
					</MenuItem>
				) : null)}
			</Select>
		</FormControl> : null
	}
	handleExtendedBirthdayChange = prop => e => {
		const { error } = this.state
		if (error) {
			this.setState({
				error: false,
				errorMessage: []
			})
		}
		this.setState({
			extended: {
				...this.state.extended,
				[prop]: e
			}
		})
	}
	handleExtendedNewsletter = () => {
		this.setState({
			mail: !this.state.mail
		})
	}
	handleExtendedChange = prop => e => {
		const { error } = this.state
		if (error) {
			this.setState({
				error: false,
				errorMessage: []
			})
		}
		this.setState({
			extended: {
				...this.state.extended,
				[prop]: e.target.value
			}
		})
	}
	renderExtendedProfile = () => {
		const { openExtended, error, extended } = this.state
		const { classes, t } = this.props
		return <Collapse in={openExtended}>
			<ItemGrid container xs={12} md={6}>
				<TextF
					id={'bio'}
					label={t('users.fields.bio')}
					value={extended.bio}
					multiline
					rows={4}
					className={classes.textField}
					handleChange={this.handleExtendedChange('bio')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} md={6}>
				<TextF
					id={'position'}
					label={t('users.fields.position')}
					value={extended.position}
					className={classes.textField}
					handleChange={this.handleExtendedChange('position')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} md={6}>
				<TextF
					id={'location'}
					label={t('users.fields.location')}
					value={extended.location}
					className={classes.textField}
					handleChange={this.handleExtendedChange('location')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			{/* <ItemGrid container xs={12} md={6}>
				<TextF
					id={'recoveryEmail'}
					label={t('users.fields.recoveryEmail')}
					value={extended.recoveryEmail}
					className={classes.textField}
					handleChange={this.handleExtendedChange('recoveryEmail')}
					margin='normal'
					error={error}
				/>
			</ItemGrid> */}
			<ItemGrid container xs={12} md={6}>
				<TextF
					id={'linkedInURL'}
					label={t('users.fields.linkedInURL')}
					value={extended.linkedInURL}
					className={classes.textField}
					handleChange={this.handleExtendedChange('linkedInURL')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} md={6}>
				<TextF
					id={'twitterURL'}
					label={t('users.fields.twitterURL')}
					value={extended.twitterURL}
					className={classes.textField}
					handleChange={this.handleExtendedChange('twitterURL')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} md={6}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<DatePicker
						autoOk
						label={t('users.fields.birthday')}
						clearable
						format='ll'
						value={extended.birthday}
						onChange={this.handleExtendedBirthdayChange('birthday')}
						animateYearScrolling={false}
						color='primary'
						disableFuture
						rightArrowIcon={<KeyboardArrowRight />}
						leftArrowIcon={<KeyboardArrowLeft />}
					/>
				</MuiPickersUtilsProvider>
			</ItemGrid>

		</Collapse>
	}
	render() {
		const { error, errorMessage, user, created, loading } = this.state
		const { classes, t } = this.props
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})
		return !loading ?
			<GridContainer justify={'center'}>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<ItemGrid xs={12}>
							<Collapse in={this.state.error}>
								<Warning>
									<Danger>
										{errorMessage}
									</Danger>
								</Warning>
							</Collapse>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'firstName'}
								label={t('users.fields.firstName')}
								value={user.firstName}
								className={classes.textField}
								handleChange={this.handleChange('firstName')}
								margin='normal'
								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'lastName'}
								label={t('users.fields.lastName')}
								value={user.lastName}
								className={classes.textField}
								handleChange={this.handleChange('lastName')}
								margin='normal'
								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'email'}
								label={t('users.fields.email')}
								value={user.email}
								className={classes.textField}
								handleChange={this.handleChange('email')}
								margin='normal'
								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'phone'}
								label={t('users.fields.phone')}
								value={user.phone}
								className={classes.textField}
								handleChange={this.handleChange('phone')}
								margin='normal'
								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							{this.renderLanguage()}
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							{this.renderOrgs()}
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							{this.renderAccess()}
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.mail}
										onChange={this.handleExtendedNewsletter}
										color="primary"
									/>
								}
								label={t('users.fields.newsletter')}
							/>
						</ItemGrid>
						<ItemG xs={12}>
							{this.renderExtendedProfile()}
						</ItemG>

						<ItemGrid container xs={12} md={12}>
							<Button color={'primary'} onClick={() => this.setState({ openExtended: !this.state.openExtended })}>{t('actions.extendProfile')}</Button>
						</ItemGrid>
					</form>
					<ItemGrid xs={12} container justify={'center'}>
						<Collapse in={this.state.creating} timeout='auto' unmountOnExit>
							<CircularLoader notCentered />
						</Collapse>
					</ItemGrid>
					<Grid container justify={'center'}>
						<div className={classes.wrapper}>
							<Button
								variant='contained'
								color='primary'
								style={{ color: '#fff' }}
								className={buttonClassname}
								disabled={this.state.creating || this.state.created}
								onClick={this.handleEditUser}>
								{this.state.created ?
									<Fragment>{t('snackbars.redirect')}</Fragment>
									: <Fragment><Save className={classes.leftIcon} />{t('users.editUser')}</Fragment>}
							</Button>
						</div>
					</Grid>

				</Paper>

			</GridContainer> : <CircularLoader />

	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getSettings: async () => dispatch(await getSettings()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(EditUser))
