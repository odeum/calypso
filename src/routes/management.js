
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Management from 'views/Management/Management';


const management = (props) => {
	return (<Route path={`${props.match.url}`} render={() => <Management {...props} />} />
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(management)