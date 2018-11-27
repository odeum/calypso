import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from 'views/Dashboard/Dashboard';
import { Dashboard, LibraryBooks, SettingsRounded, People, DeviceHub, Star } from 'variables/icons';
import NotFound from 'layouts/404/NotFound';
import Loadable from 'react-loadable';
import AsyncLoader from 'components/Loader/AsyncLoader';
import { DataUsage } from 'variables/icons';
const AsyncFavorites = Loadable({
	loader: () => import('routes/favorites'),
	loading: AsyncLoader
})
const AsyncManagement = Loadable({
	loader: () => import('routes/management'),
	loading: AsyncLoader
})
const AsyncUser  = Loadable({
	loader: () => import('routes/user'),
	loading: AsyncLoader
})
const AsyncOrg = Loadable({
	loader: () => import('routes/org'),
	loading: AsyncLoader
})
const AsyncSettings = Loadable({
	loader: () => import('views/Settings/Settings'),
	loading: AsyncLoader
})
const dashboardRoutes = [
	{
		path: '/dashboard',
		sidebarName: 'sidebar.dashboard',
		navbarName: 'Senti Dashboard',
		icon: Dashboard,
		component: DashboardPage,
		menuRoute: 'dashboard'
	},
	{
		path: '/favorites',
		sidebarName: 'sidebar.favorites',
		icon: Star,
		component: AsyncFavorites,
		menuRoute: 'favorites'
	},
	{
		path: '/management/user/:id',
		component: AsyncUser,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/management/org/:id',
		component: AsyncOrg,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/management',
		sidebarName: 'sidebar.users',
		icon: People,
		component: AsyncManagement,
		menuRoute: 'users',
	},
	{
		path: '/settings',
		sidebarName: 'sidebar.settings',
		icon: SettingsRounded,
		hideFromSideBar: true,
		component: AsyncSettings,
		menuRoute: 'settings'
	},
	{
		path: '/404',
		sidebarName: 'Error',
		component: NotFound,
		hideFromSideBar: true,
	},
	{
		path: '*',
		component: () => <Redirect from={window.location.pathname} to={window.location.pathname === '/' ? '/dashboard' : '/404'} />,
		hideFromSideBar: true
	},


];

export default dashboardRoutes;
