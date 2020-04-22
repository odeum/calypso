import { api } from './data'

//#region GET User,Users
export const getAllUsers = async () => {
	var data = await api.get('core/users').then(rs => rs.data)
	return data
}
export const getValidSession = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs)
	return data
}
export const getUser = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs.data)
	return data
}
export const createUser = async (user) => {
	let response = await api.post(`core/user`, user).then(rs => rs)
	// response.status
	return response.data ? response.data : response.status
}
export const resendConfirmEmail = async (user) => {
	let data = await api.post('core/user/resendconfirmmail', user).then(rs => rs.data)
	return data
}
export const confirmUser = async (obj) => {
	let response = await api.post(`core/user/confirm`, obj).then(rs => rs)
	return response.ok ? response.data : response.status
}
export const editUser = async (user) => {
	let data = await api.put(`core/user/${user.id}`, user).then(rs => rs.ok)
	return data
}

export const manualConfirm = async (user) => {
	let newUser = {
		...user,
		aux: {
			...user.aux,
			calypso: {
				...user.aux.calypso
			}
		},
		userName: user.email,
	}
	delete (user.group)
	if (!newUser.aux.calypso) {
		newUser.aux.calypso = {}
	}
	let res = await editUser(newUser).then(rs => rs)
	return res
}

export const deleteUser = async (user) => {
	let data = await api.delete(`core/user/${user}`).then(rs => rs.data)
	return data
}

export const getLicenseTypes = async () => {
	let data = await api.get('calypso/subscriptions').then(rs => rs.data);
	return data;
}

export const getCurrentLicense = async (userId) => {
	let data = await api.get('calypso/subscription/' + userId).then(rs => rs.data);
	return data;
}

export const postSubscriptionChange = async (userId, newLicenseType) => {
	let status = await api.post('calypso/subscription/' + userId, { type: newLicenseType }).then(rs => rs.status);
	return status;
}

export const getNextPayDate = async (userId) => {
	let data = await api.get('calypso/subscription/' + userId + '/collection/pending').then(rs => rs.data);
	return data;
}

export const getSubscriptions = async (userId) => {
	let data = await api.get('calypso/subscription/' + userId + '/collection').then(rs => rs.data);
	return data;
}

export const getInvoiceData = async (userId) => {
	let data = await api.get('calypso/subscription/' + userId + '/invoice').then(rs => rs.data);
	return data;
}

export const saveInvoiceData = async (userId, invoiceData) => {
	let status = await api.post('calypso/subscription/' + userId + '/invoice', invoiceData).then(rs => rs.status);
	return status;
}

//#endregion