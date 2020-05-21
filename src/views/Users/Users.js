import React, { Component, Fragment } from 'react'
import { withStyles, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, List, ListItem, ListItemText, ListItemAvatar, Divider, Avatar } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import UserTable from 'components/User/UserTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { deleteUser, manualConfirm } from 'variables/dataUsers';
import { People, Business, Add, Delete, PersonAdd, Edit, Star, StarBorder, Mail } from 'variables/icons';
import { handleRequestSort, copyToClipboard } from 'variables/functions';
import TableToolbar from 'components/Table/TableToolbar';
import { customFilterItems } from 'variables/Filters';
import Gravatar from 'react-gravatar'

class Users extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openDelete: false,
			openConfirm: false,
			users: [],
			userHeader: [],
			anchorElMenu: null,
			loading: true,
			route: 0,
			order: 'desc',
			orderBy: 'firstName',
		}
		props.setHeader('users.pageTitle', false, '', 'users')
	}
	dUserGroup = () => {
		const { t } = this.props
		return [
			{ value: t("users.groups.137180100000023"), label: t("users.groups.137180100000023") },
			{ value: t("users.groups.137180100000026"), label: t("users.groups.137180100000026") },
			{ value: t("users.groups.137180100000025"), label: t("users.groups.137180100000025") },
		]
	}
	dSuspended = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t('users.statuses.active') },
			{ value: 1, label: t('users.statuses.suspended') },
			{ value: 2, label: t('users.statuses.suspendedUnconfirmed') },
			{ value: 3, label: t('users.statuses.suspendedReqActivation') },
		]
	}
	dHasLoggedIn = () => {
		const { t } = this.props
		return [
			{ value: true, label: t('filters.users.hasLoggedIn') },
			{ value: false, label: t('filters.users.neverLoggedIn') }
		]
	}
	// dLang = () => {
	// 	const { t } = this.props
	// 	return [
	// 		{ value: 'da', label: t('settings.languages.da') },
	// 		{ value: 'en', label: t('settings.languages.en') }
	// 	]
	// }
	dNewsletter = () => {
		const { t } = this.props
		return [
			{ value: true, label: t('actions.yes') },
			{ value: false, label: t('actions.no') }
		]
	}
	ftUsers = () => {
		const { t } = this.props
		return [
			{ key: 'firstName', name: t('users.fields.firstName'), type: 'string' },
			{ key: 'lastName', name: t('users.fields.lastName'), type: 'string' },
			{ key: 'email', name: t('users.fields.email'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'group', name: t('users.fields.group'), type: 'dropDown', options: this.dUserGroup() },
			{ key: 'lastLoggedIn', name: t('users.fields.lastSignIn'), type: 'date' },
			{ key: 'aux.calypso.mail', name: t('users.fields.newsletter'), type: 'dropDown', options: this.dNewsletter() },
			{ key: 'suspended', name: t('users.fields.status'), type: 'dropDown', options: this.dSuspended() },
			// { key: 'lastLoggedIn', name: t('filters.users.hasLogged'), type: 'diff', options: { dropdown: this.dHasLoggedIn(), values: { false: [null] } } },
			// { key: 'aux.odeum.language', name: t('users.fields.language'), type: 'dropDown', options: this.dLang() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true }
		]
	}
	handleEdit = () => {
		this.props.history.push(`/management/user/${this.state.selected[0]}/edit`)
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	options = () => {
		const { t, isFav, users } = this.props
		const { selected } = this.state
		let user = users[users.findIndex(d => d.id === selected[0])]
		let favObj
		let isFavorite = false
		if (user) {
			favObj = {
				id: user.id,
				name: `${user.firstName} ${user.lastName}`,
				type: 'user',
				path: `/management/user/${user.id}`
			}
			isFavorite = isFav(favObj)
		}
		return [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.copyEmails'), icon: Mail, func: this.handleCopyEmailsSelected },
			{ label: t('menus.confirmUsers'), icon: PersonAdd, func: this.handleOpenConfirmDialog },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete }
		]
	}
	handleCopyEmailsSelected = () => {
		const { selected } = this.state
		const { users } = this.props
		let fUsers = users.filter((el) => {
			return selected.some((f) => {
				return f === el.id
			});
		});
		let emails = fUsers.map(u => u.email).join(';')
		// this.setState({})
		// console.log(emails)
		copyToClipboard(emails)
		this.props.s('snackbars.emailsCopied')
		// this.setState({ anchorElMenu: null })

	}
	userHeader = () => {
		const { t } = this.props
		return [
			{ id: 'avatar', label: '' },
			{ id: 'firstName', label: t('users.fields.name') },
			{ id: 'phone', label: t('users.fields.phone') },
			{ id: 'email', label: t('users.fields.email') },
			{ id: 'org.name', label: t('users.fields.organisation') },
			{ id: 'group', label: t('users.fields.group') },
			{ id: 'suspended', label: t('users.fields.status') },
			{ id: 'lastLoggedIn', label: t('users.fields.lastSignIn') }
		]
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = async (prevState, prevProps) => {
		if (prevProps.users !== this.props.users) {
			if (this.state.selected.length > 0)
				this.setState({ selected: [] })
			await this.getData()
		}
	}

	filterItems = (data) => {
		const rFilters = this.props.filters
		return customFilterItems(data, rFilters)
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.props.users)
		this.setState({ users: newData, order, orderBy: property })
	}

	getData = async () => {
		if (this.props.users) {
			this.setState({
				loading: false
			}, () => this.handleRequestSort(null, 'firstName', 'asc'))
			return
		}
	}

	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
	]
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			case 2:
				s('snackbars.exported')
				break
			case 3:
				s('snackbars.confirmedAll')
				break
			case 4:
				s('snackbars.confirmedPartial')
				break
			case 5:
				s('snackbars.failed')
				break
			default:
				break;
		}
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.props.reload()
	}
	confirmUsers = async () => {
		const { users } = this.props
		const { selected } = this.state
		Promise.all(selected.map(u => {
			let user = users[users.findIndex(s => s.id === u)]
			return manualConfirm(user)
		})).then(rs => {
			if (rs.filter(f => f === true).length === rs.length)
				return this.snackBarMessages(3)
			if (rs.filter(f => f === false).length === rs.length)
				return this.snackBarMessages(5)
			if (rs.filter(f => f === false).length > 0)
				return this.snackBarMessages(4)
		})
		await this.reload()
	}
	deleteUsers = async () => {
		const { selected } = this.state
		await selected.forEach(async u => {
			await deleteUser(u)
		})
		await this.reload()
		this.snackBarMessages(1)
	}
	addNewUser = () => { this.props.history.push('/management/users/new') }

	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.filterItems(this.props.users).map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}
	handleConfirmUsers = async () => {
		await this.confirmUsers()
		this.setState({
			selected: [],
			anchorElMenu: null,
			openConfirm: false
		})
	}
	handleDeleteUsers = async () => {
		await this.deleteUsers()
		this.setState({
			selected: [],
			anchorElMenu: null,
			openDelete: false
		})
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}
	handleOpenConfirmDialog = () => {
		this.setState({ openConfirm: true, anchorElMenu: null })
	}
	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleCloseConfirmDialog = () => {
		this.setState({ openConfirm: false })
	}

	renderConfirmUser = () => {
		const { openConfirm, selected } = this.state
		const { users, t, classes } = this.props
		return <Dialog
			open={openConfirm}
			onClose={this.handleCloseConfirmDialog}>
			<DialogTitle>{t('dialogs.confirm.title')}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t('dialogs.confirm.message.users')}
				</DialogContentText>
				<List dense={true}>
					<Divider />
					{selected.map(s => {
						let u = users[users.findIndex(d => d.id === s)]
						return u ? <ListItem divider key={u.id}>
							<ListItemAvatar>
								<Avatar>
									<Gravatar default='mp' email={u.email} className={classes.img} />
								</Avatar>
							</ListItemAvatar>
							<ListItemText key={s} primary={u.firstName + ' ' + u.lastName} />
						</ListItem> : null
					})
					}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseConfirmDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleConfirmUsers} color='primary'>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { users, t, classes } = this.props

		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.users')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.users')}
				</DialogContentText>
				<List dense={true}>
					<Divider />
					{selected.map(s => {
						let u = users[users.findIndex(d => d.id === s)]
						return u ? <ListItem divider key={u.id}>
							<ListItemAvatar>
								<Avatar>
									<Gravatar default='mp' email={u.email} className={classes.img} />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={u.firstName + ' ' + u.lastName} />
						</ListItem> : null
					})
					}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteUsers} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	renderUsers = () => {
		const { t, classes, setHeader } = this.props
		const { loading, selected, order, orderBy, filters, users } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderConfirmDelete()}
				{this.renderConfirmUser()}
				<TableToolbar
					ft={this.ftUsers()}
					reduxKey={'users'}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/>
				<UserTable
					data={this.filterItems(users)}
					selected={selected}
					tableHead={this.userHeader()}
					setHeader={setHeader}
					handleSelectAllClick={this.handleSelectAllClick}
					handleRequestSort={this.handleRequestSort}
					handleDeleteUsers={this.handleDeleteUsers}
					handleCheckboxClick={this.handleCheckboxClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					t={t}
				/>
			</Paper>}
		</GridContainer>
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	renderTableToolBarContent = () => {
		const { accessLevel } = this.props
		let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		return <Fragment>
			{access ? <IconButton aria-label='Add new user' onClick={this.addNewUser}>
				<Add />
			</IconButton> : null
			}
		</Fragment>
	}
	render() {

		return (
			<Fragment>

				{this.renderUsers()}
				{/* </Paper> */}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Users)