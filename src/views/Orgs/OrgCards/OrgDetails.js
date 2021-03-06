import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info, Dropdown } from 'components';
import { Grid } from '@material-ui/core';
import { Business, Edit, Delete, StarBorder, Star } from 'variables/icons'
import { Link } from 'react-router-dom'
var countries = require('i18n-iso-countries')

class OrgDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null
		}
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}
	handleDeleteOrg = () => {
		this.handleCloseActionsDetails()
		this.props.deleteOrg()
	}
	handleEdit = () => this.props.history.push({ pathname: `/management/org/${this.props.org.id}/edit`, prevURL: `/management/org/${this.props.org.id}` })

	options = () => {
		const { t, accessLevel, classes, isFav, addToFav, removeFromFav } = this.props
		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: <Edit className={classes.leftIcon} /> },
			{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },
			{ label: t('menus.delete'), func: this.handleDeleteOrg, icon: <Delete className={classes.leftIcon} /> },

		]
		if (accessLevel.apiorg.edit)
			return allOptions
		else return [
			{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },

		]
	}

	render() {
		// const { } = this.state
		const { t, org, users } = this.props
		let owner = users ? org.aux.ownerID ? users[users.findIndex(f => f.id === org.aux.ownerID)] : null : null
		return (
			<InfoCard title={org.name}
				avatar={<Business />}
				subheader={`${t('orgs.fields.id')}: ${org.id}`}
				noExpand
				topAction={this.options().length > 0 ? <Dropdown
					menuItems={
						this.options()
					} /> : null}
				content={
					<Grid container>
						<ItemGrid>
							<Caption>
								{t('orgs.fields.address')}
							</Caption>
							<Info >
								{org.address}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('orgs.fields.zip')}
							</Caption>
							<Info>
								{org.zip}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('orgs.fields.city')}
							</Caption>
							<Info>
								{org.city}
							</Info>
						</ItemGrid>
						<ItemGrid xs={12} />
						<ItemGrid>
							<Caption>
								{t('orgs.fields.region')}
							</Caption>
							<Info>
								{org.region}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('orgs.fields.country')}
							</Caption>
							<Info>
								{org.country.length === 2 ? countries.getName(org.country, this.props.language)
									: org.country}
							</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>
								{t('orgs.fields.url')}
							</Caption>
							<Info>
								<a href={org.url} target={'_blank'} rel="noopener noreferrer">
									{org.url}
								</a>
							</Info>
						</ItemGrid>
						{owner ? <ItemGrid>
							<Caption>
								{t('orgs.fields.owner')}
							</Caption>
							<Info>
								<Link to={`/management/user/${org.aux.ownerID}`}>
									{`${owner.firstName} ${owner.lastName}`}
								</Link>
							</Info>
						</ItemGrid> : null}
						<ItemGrid>
							<Caption>
								{t('orgs.fields.CVR')}
							</Caption>
							<Info>
								{org.aux ? org.aux.cvr : null}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('orgs.fields.EAN')}
							</Caption>
							<Info>
								{org.aux ? org.aux.ean : null}
							</Info>
						</ItemGrid>
					</Grid>
				}
			/>
		)
	}
}

export default OrgDetails
