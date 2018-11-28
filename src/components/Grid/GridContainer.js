import { Grid, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames'
const style = theme => ({
	grid: {
		[theme.breakpoints.down('md')]: {
			padding: '10px 10px 30px 10px',
		},
		[theme.breakpoints.down('sm')]: {
			padding: '8px 8px 30px 8px'
		},
		padding: '30px',
		width: 'auto'
	}
})

function GridContainer({ ...props }) {
	const { classes, children, className, ...rest } = props;
	const gridClasses = cx({
		[' ' + className]: className,
		[classes.grid]: true,
	});
	return (
		<Grid container {...rest} className={gridClasses}>
			{children}
		</Grid>
	);
}

GridContainer.defaultProps = {
	className: ''
};

GridContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.node,
	className: PropTypes.string
};

export default withStyles(style)(GridContainer);
