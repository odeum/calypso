import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
// import { getAllUsers } from 'variables/dataUsers';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';

class AssignUserDialog extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			users: [],
			selectedUser: null,
			page: 0,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		// await getAllUsers().then(rs => this._isMounted ? this.setState({ users: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	assignUser = sId => () => {
		// let sId = selectedUser
		let users = this.props.users
		let org = users[users.findIndex(o => o.id === sId)]
		this.props.callBack(org)
	}

	selectUser = pId => e => {
		e.preventDefault()
		this.setState({ selectedUser: pId })
	}
	closeDialog = () => {
		this.props.handleClose(false)
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	handleChangePage = (event, page) => {
		this.setState({ page });
	}
	render() {
		const { filters, selectedUser } = this.state
		const { users, classes, open, t } = this.props;
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return (

			<Dialog
				fullScreen
				open={open}
				onClose={this.handleClose}
			// TransitionComponent={props => <Slide direction='up' {...props} />}
			>
				<AppBar className={classes.appBar + appBarClasses}>
					<Toolbar>
						<Hidden smDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={3} container alignItems={'center'}>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('sidebar.users')}
									</Typography>
								</ItemG>
								<ItemG xs>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={users ? suggestionGen(users) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={1}>
									<Tooltip title={t('actions.cancel')}>
										<IconButton color='inherit' onClick={this.closeDialog} aria-label='Close'>
											<Close />
										</IconButton>
									</Tooltip>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden mdUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={12} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={this.closeDialog} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('sidebar.users')}
									</Typography>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={users ? suggestionGen(users) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<List>
					{users ? filterItems(users, filters).map((p, i) => (
						<Fragment key={i}>
							<ListItem button onClick={this.assignUser(p.id)} value={p.id}
								classes={{
									root: selectedUser === p.id ? classes.selectedItem : null
								}}
							>
								<ListItemText
									primaryTypographyProps={{
										className: selectedUser === p.id ? classes.selectedItemText : null
									}}
									secondaryTypographyProps={{
										classes: { root: selectedUser === p.id ? classes.selectedItemText : null }
									}}
									primary={`${p.firstName} ${p.lastName}`} />
							</ListItem>
							<Divider />
						</Fragment>
					)
					) : <CircularLoader />}

				</List>
			</Dialog>

		);
	}
}


AssignUserDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(assignStyles)(AssignUserDialog)