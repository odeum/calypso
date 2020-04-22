
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import User from 'views/Users/User';
import EditUser from 'components/User/EditUser';
import UserSubscription from 'components/User/UserSubscription';
import UserSubscriptionCancel from 'components/User/UserSubscriptionCancel';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';


const user = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/subscription/cancel`} render={(rp) => <UserSubscriptionCancel {...rp} {...props}/>} />
			<Route path={`${props.match.url}/subscription`} render={(rp) => <UserSubscription {...rp} {...props}/>} />
			<Route path={`${props.match.url}/edit`} render={(rp) => <EditUser {...rp} {...props}/>} />
			<Route path={`${props.match.url}`} render={() => <User {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(user)