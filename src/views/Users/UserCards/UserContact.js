import React, { Component } from 'react'
import { InfoCard, ItemG, Caption, Info } from 'components';
import { Hidden } from '@material-ui/core';
import { pF, dateFormatter } from 'variables/functions';
import { Person, Edit, Delete, LockOpen, Email, Star, StarBorder, PersonAdd, CreditCard } from 'variables/icons'
import { Link } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import { connect } from 'react-redux'
import Dropdown from 'components/Dropdown/Dropdown';
class UserContact extends Component {

	deleteUser = () => {
		this.props.deleteUser()
	}

	renderUserGroup = () => {
		const { t, user } = this.props
		if (user.groups[137180100000026])
			return t('users.groups.137180100000026')
		if (user.groups[137180100000023])
			return t('users.groups.137180100000023')
		if (user.groups[137180100000025])
			return t('users.groups.137180100000025')
	}
	renderLicense = () => {
		const { licenseType } = this.props

		if (licenseType && licenseType.length) {
			return licenseType.charAt(0).toUpperCase() + licenseType.slice(1);
		} else {
			return ''
		}
	}
	renderTopActionPriv = () => {
		const { loggedUser, user } = this.props
		const { apiorg } = loggedUser.privileges
		if (apiorg) {
			if (apiorg.editusers) {
				return this.renderTopAction()
			}
		}
		if (loggedUser.id === user.id)
			return this.renderTopAction()
		return null
	}
	canDelete = () => {
		const { accessLevel, user, loggedUser } = this.props
		let dontShow = true
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			dontShow = false
		}
		if (loggedUser.id === user.id)
			dontShow = true
		return dontShow
	}
	hasSubscriptionPrivs = () => {
		const { accessLevel, user } = this.props;
		let hasNoPrivs = true;
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			hasNoPrivs = false;
		}
		return hasNoPrivs;
	}
	hasConfirmPrivs = () => {
		const { accessLevel, user } = this.props;
		let hasNoPrivs = true;
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			hasNoPrivs = false;
		}
		return hasNoPrivs;
	}
	renderTopAction = () => {
		const { t, classes, user, history, isFav, addToFav, removeFromFav } = this.props
		return <Dropdown menuItems={
			[
				{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `${this.props.match.url}/edit`, prevURL: `/management/user/${user.id}` }) },
				{
					label: t('menus.subscription'),
					icon: <CreditCard className={classes.leftIcon} />,
					func: () => history.push({ pathname: `${this.props.match.url}/subscription`, prevURL: `/management/user/${user.id}` }),
					dontShow: this.hasSubscriptionPrivs()
				},
				{ label: t('menus.changePassword'), icon: <LockOpen className={classes.leftIcon} />, func: this.props.changePass },
				{ label: t('menus.userResendEmail'), icon: <Email className={classes.leftIcon} />, func: this.props.resendConfirmEmail, dontShow: user.suspended !== 2 },
				{
					label: t('menus.confirmUser'),
					icon: <PersonAdd className={classes.leftIcon} />,
					func: this.props.confirmUser,
					dontShow: this.hasConfirmPrivs()
					/* dontShow: user.suspended !== 3*/
				},
				{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },
				{
					label: t('menus.delete'),
					icon: <Delete className={classes.leftIcon} />,
					func: this.deleteUser,
					dontShow: this.canDelete()
				},

			]
		} />
	}
	render() {
		const { t, user, classes } = this.props
		const extended = user.aux.calypso ? user.aux.calypso.extendedProfile : null
		return (
			<InfoCard
				title={`${user.firstName} ${user.lastName}`}
				avatar={<Person />}
				topAction={this.renderTopActionPriv()}
				content={
					<ItemG container >
						<Hidden lgUp>
							<ItemG container justify={'center'}>
								{user.img ? <img src={user.img} alt='UserAvatar' className={classes.img} /> : <Gravatar size={250} default='mp' email={user.email} className={classes.img} />}
							</ItemG>
						</Hidden>
						<ItemG lg={9} md={12}>
							<ItemG>
								<Caption>{t('users.fields.email')}</Caption>
								<Info>
									<a title={t('links.mailTo')} href={`mailto:${user.email}`}>
										{user.email}
									</a>
								</Info>
							</ItemG>
							<ItemG>
								<Caption>{t('users.fields.phone')}</Caption>
								<Info>
									<a title={t('links.phoneTo')} href={`tel:${user.phone}`}>
										{user.phone ? pF(user.phone) : user.phone}
									</a>
								</Info>
							</ItemG>
							<ItemG>
								<Caption>{t('users.fields.organisation')}</Caption>
								<Info>
									<Link to={{ pathname: `/management/org/${user.org.id}`, prevURL: `/management/user/${user.id}` }}>
										{user.org ? user.org.name : t('users.noOrg')}
									</Link>
								</Info>
							</ItemG>
							<ItemG>
								<Caption>{t('users.fields.language')}</Caption>
								<Info>{user.aux.odeum.language === 'en' ? t('settings.languages.en') : user.aux.odeum.language === 'da' ? t('settings.languages.da') : ''}</Info>
							</ItemG>
							<ItemG>
								<Caption>{t('users.fields.accessLevel')}</Caption>
								<Info>{this.renderUserGroup()}</Info>
							</ItemG>
							<ItemG>
								<Caption>{t('users.headers.license')}</Caption>
								<Info>{this.renderLicense()}</Info>
							</ItemG>
						</ItemG>
						<Hidden mdDown>
							<ItemG >
								{user.img ? <img src={user.img} alt='UserAvatar' className={classes.img} /> : <Gravatar default='mp' size={250} email={user.email} className={classes.img} />}
							</ItemG>
						</Hidden>
					</ItemG>
				}
				hiddenContent={

					<ItemG container>
						<ItemG xs={12}>
							<Caption>{t('users.fields.bio')}</Caption>
							<Info>
								{extended ? extended.bio ? extended.bio : null : null}
							</Info>
						</ItemG>
						<ItemG xs={12} md={2}>
							<Caption>{t('users.fields.position')}</Caption>
							<Info>
								{extended ? extended.position ? extended.position : null : null}
							</Info>
						</ItemG>
						<ItemG xs={12} md={9}>
							<Caption>{t('users.fields.location')}</Caption>
							<Info>
								{extended ? extended.location ? extended.location : null : null}
							</Info>
						</ItemG>
						<ItemG xs={12} md={2}>
							<Caption>{t('users.fields.linkedInURL')}</Caption>
							<Info>
								{extended ? extended.linkedInURL ?
									<a target='_blank' rel="noopener noreferrer" href={`${extended.linkedInURL}`}>
										{`${user.firstName} ${user.lastName}`}
									</a>
									: null : null}
							</Info>
						</ItemG>
						<ItemG xs={12} md={8}>
							<Caption>{t('users.fields.twitterURL')}</Caption>
							<Info>
								{extended ? extended.twitterURL ?
									<a target='_blank' rel="noopener noreferrer" href={`${extended.twitterURL}`}>
										{`${user.firstName} ${user.lastName}`}
									</a>
									: null : null}
							</Info>
						</ItemG>
						<ItemG xs={10}>
							<Caption>{t('users.fields.birthday')}</Caption>
							<Info>
								{extended ? extended.birthday ? dateFormatter(extended.birthday) : null : null}
							</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('users.fields.newsletter')}</Caption>
							<Info>
								{user.aux.calypso ? user.aux.calypso.mail ? t('actions.yes') : t('actions.no') : t('actions.no')}
							</Info>
						</ItemG>
					</ItemG>
				}
			/>



		)
	}
}
const mapStateToProps = (state) => ({
	language: state.settings.language,
	loggedUser: state.settings.user,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UserContact)
