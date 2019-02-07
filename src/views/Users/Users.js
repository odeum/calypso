import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import UserTable from 'components/User/UserTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { deleteUser } from 'variables/dataUsers';
import { People, Business } from 'variables/icons';
import { filterItems, handleRequestSort } from 'variables/functions';

class Users extends Component {
	constructor(props) {
		super(props)

		this.state = {
			users: [],
			userHeader: [],
			loading: true,
			route: 0,
			order: 'desc',
			orderBy: 'firstName',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader('users.pageTitle', false, '', 'users')
	}
	userHeader = () => {
		const { t } = this.props
		return	[
			{ id: 'avatar', label: '' },
			{ id: 'firstName', label: t('users.fields.name') },
			{ id: 'phone', label: t('users.fields.phone') },
			{ id: 'email', label: t('users.fields.email') },
			{ id: 'org.name', label: t('users.fields.organisation') },
			{ id: 'group', label: t('users.fields.group') },
			{ id: 'lastLoggedIn', label: t('users.fields.lastSignIn'), type: 'date' },
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
			await this.getData()
			// this.setState({ users: this.props.users })
		}
	}
	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}
	handleRequestSort = (event, property, way) => {
		console.log(event, property, way)
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property.id, order, this.props.users, property.type)
		this.setState({ users: newData, order, orderBy: property.id })
	}

	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
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
			default:
				break;
		}
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.props.reload()
	}
	handleDeleteUsers = async (selected) => {
		await selected.forEach(async u => {
			await deleteUser(u)
		})
		await this.props.reload()
		this.snackBarMessages(1)
	}
	renderUsers = () => {
		const { t } = this.props
		const { loading, order, orderBy, filters, users } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <UserTable
				data={users}
				tableHead={this.userHeader()}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={this.handleFilterStartDate}
				handleRequestSort={this.handleRequestSort}
				handleDeleteUsers={this.handleDeleteUsers}
				order={order}
				orderBy={orderBy}
				filters={filters}
				t={t}
			/>}
		</GridContainer>
	}

	render() {
		// const { users, filters } = this.state
		return (
			<Fragment>
				{this.renderUsers()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Users)