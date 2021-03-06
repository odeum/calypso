import React, { Component } from 'react'
import { InfoCard, ItemGrid, Info, Caption, CircularLoader } from 'components'
import { Table, TableHead, TableBody, TableRow, TableCell, Hidden, withStyles } from '@material-ui/core'
import { People } from '@material-ui/icons'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import Gravatar from 'react-gravatar'
import { pF, dateFormat } from 'variables/functions'
import moment from 'moment'

import { getCurrentLicense } from 'variables/dataUsers';

class OrgUsers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			licenseTypes: {}
		}
	}

	componentDidMount = async () => {
		if (this.props.users) {
			let types = {};
			await Promise.all(
				this.props.users.map(async (n, i) => {
					let license = await getCurrentLicense(n.id);
					if (license && license.length) {
						types[n.id] = license[0].type;
					}
				})
			);

			this.setState({ licenseTypes: types, loading: false });
		}
	}

	groups = () => {
		const { t } = this.props

		return [
			{
				id: '137180100000026',
				name: t('users.groups.accountManager'),
			},
			{
				id: '137180100000023',
				name: t('users.groups.superUser'),

			},
			{
				id: '137180100000025',
				name: t('users.groups.user'),
			}
		]
	}

	getGroupName = (userGroups) => {
		userGroups = Object.keys(userGroups);
		return this.groups().map((n, i) => {
			if (userGroups.includes(n.id)) {
		 		return n.name
		 	} else {
				 return ''
			 }
		})
	}

	getLicenseType = (userId) => {
		if (this.state.licenseTypes[userId]) {
			let type = this.state.licenseTypes[userId];
			return type.charAt(0).toUpperCase() + type.slice(1);
		} else {
			return '';
		}
	}

	render() {
		const { loading } = this.state;
		const { users, classes, t } = this.props

		return !loading ?
			<InfoCard
				title={'Users'}
				avatar={<People />}
				noExpand
				noPadding
				content={
					<Table>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>{t('users.headers.name')}</TableCell>
								<TableCell>{t('users.headers.phone')}</TableCell>
								<TableCell>{t('users.headers.email')}</TableCell>
								<TableCell>{t('users.headers.permissions')}</TableCell>
								<TableCell>{t('users.headers.license')}</TableCell>
								<TableCell>{t('users.headers.latestlogin')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody style={{ padding: "0 24px" }}>
							{users ? users.map((n, i) => {
								const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('users.fields.neverLoggedIn')
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/management/user/' + n.id, prevURL: `/management/org/${this.props.org.id}` }) }}
										// tabIndex={-1}
										key={i}
										style={{ cursor: 'pointer', padding: '0 20px' }}
									>
										<Hidden lgUp>
											<TC className={classes.orgUsersTD} checkbox content={<ItemGrid container zeroMargin justify={'center'}>
												{n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />}
											</ItemGrid>}/>
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{`${n.firstName} ${n.lastName}`}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : t('users.fields.noOrg')} - ${n.email}`}
														</Caption>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											}/>
									
										</Hidden>
										<Hidden mdDown>
											<TC className={classes.orgUsersTD} checkbox content={<ItemGrid container zeroMargin justify={'center'}>
												{n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />}
											</ItemGrid>} />
											{/* <TC label={n.userName} /> */}
											<TC FirstC label={`${n.firstName} ${n.lastName}`} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone) : n.phone}</a>} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</a>} />
											<TC label={this.getGroupName(n.groups)} />
											<TC label={this.getLicenseType(n.id)} />
											<TC label={lastLoggedIn} />
										</Hidden>
									</TableRow>

								)
							}) : null}
						</TableBody>
					</Table>
				}/>
			: <CircularLoader />;
	}
}

export default withStyles(devicetableStyles)(OrgUsers)