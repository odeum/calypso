import { Grid, IconButton, Menu, MenuItem, Toolbar, Typography, withStyles } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from 'variables/icons';
import { boxShadow } from 'assets/jss/material-dashboard-react';
import toolbarStyles from 'assets/jss/material-dashboard-react/tableToolBarStyle';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ItemGrid } from 'components';
import { ItemG } from 'components/index';
import FilterToolbar from 'components/Filter/FilterToolbar';


let selectedRender = props => {
	const { numSelected, t, anchor, setAnchor } = props;
	return <Grid container justify={'space-between'} alignItems={'center'}>
		<ItemGrid>
			<Typography variant='subtitle1'>
				{numSelected + ' ' + t('tables.selected')}
			</Typography>
		</ItemGrid>
		<ItemGrid>
			<IconButton
				aria-label={t('menus.more')}
				aria-owns={anchor ? 'long-menu' : null}
				aria-haspopup='true'
				onClick={e => setAnchor(e.target)}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				disablePortal
				disableEnforceFocus
				disableRestoreFocus
				id='long-menu'
				anchorEl={anchor}
				open={Boolean(anchor)}
				onClose={e => setAnchor(null)}
				PaperProps={{ style: { boxShadow: boxShadow } }}
			>
				{props.options().map((option, i) => {
					if (option.dontShow)
						return null
					if (option.single)
						return numSelected === 1 ? <MenuItem key={i} onClick={() => { setAnchor(null); option.func(); }}>
							<option.icon className={props.classes.leftIcon} />{option.label}
						</MenuItem> : null
					else {
						return <MenuItem key={i} onClick={() => { setAnchor(null);option.func(); }}>
							<option.icon className={props.classes.leftIcon} />{option.label}
						</MenuItem>
					}
				}
				)}
			</Menu>
		</ItemGrid>
	</Grid>
}
let defaultRender = props => {
	const { content } = props
	return <Fragment>
		<ItemG xs container alignItems={'center'}>
			{props.ft ? <FilterToolbar
				reduxKey={props.reduxKey}
				filters={props.ft}
				t={props.t}
			/> : null}
		</ItemG>
		<ItemG xs={2} container justify={'flex-end'} alignItems={'center'}>
			{content ? content : null}
		</ItemG>
	</Fragment>
}
let TableToolbar = props => {
	const { numSelected, classes } = props;
	const [anchor, setAnchor] = useState(null)

	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}>

			<ItemG container alignItems={'center'}>
				{numSelected > 0 ? (
					selectedRender({ ...props, anchor, setAnchor })
				) :
					defaultRender(props)
				}
			</ItemG>

		</Toolbar>
	);
};


TableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
};

export default withRouter(withStyles(toolbarStyles)(TableToolbar));