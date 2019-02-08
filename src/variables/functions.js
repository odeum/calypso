import { parsePhoneNumber } from 'libphonenumber-js'
var moment = require('moment');
var _ = require('lodash')

export const copyToClipboard = str => {
	let el = document.createElement('textarea');  // Create a <textarea> element
	el.value = str;                                 // Set its value to the string that you want copied
	// el.value = 'andrei@webhouse.dk'
	el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	el.style.position = 'absolute';
	// el.style.left = '-9999px';
	el.style.background = '#fff'
	el.style.zIndex = '-999'                      // Move outside the screen to make it invisible
	document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0        // Check if there is any content selected previously
			? document.getSelection().getRangeAt(0)     // Store selection if found
			: false;                                    // Mark as false to know no selection existed before
	el.focus()
	el.select();                                    // Select the <textarea> content
	document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el);                  // Remove the <textarea> element
	if (selected) {                                 // If a selection existed before copying
		document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
		document.getSelection().addRange(selected);   // Restore the original selection
	}
};
export const dateFormat = (date) => {
	let newDate = moment(date)
	if (newDate.isBetween(moment().subtract(7, 'day'), moment().add(7, 'day')))
		return moment(date).calendar()
	else
		return moment(date).fromNow()
}

const isObject = (obj) => {
	return obj === Object(obj);
}

export const filterItems = (data, filters) => {
	const { keyword } = filters
	var arr = data
	if (arr) {
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				return keyTester(c[key], keyword ? keyword : '')

			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filtered
	}
}

export const keyTester = (obj, sstr) => {
	let searchStr = sstr.toLowerCase()
	let found = false
	if (isObject(obj)) {
		for (var k in obj) {
			if (!found) {
				if (k instanceof Date) {
					let date = dateFormatter(obj[k])
					found = date.toLowerCase().includes(searchStr)
				}
				else {
					if (isObject(obj[k])) {
						found = keyTester(obj[k], sstr)
					}
					else {
						found = obj[k] ? obj[k].toString().toLowerCase().includes(searchStr) : false
					}
				}
			}
			else {
				break
			}
		}
	}
	else {
		found = obj ? obj.toString().toLowerCase().includes(searchStr) : null
	}
	return found
}
const sortFunc = (a, b, orderBy, way) => {
	let newA = _.get(a, orderBy) ? _.get(a, orderBy) : ''
	let newB = _.get(b, orderBy) ? _.get(b, orderBy) : ''
	if (moment(new Date(newA)).isValid() || moment(new Date(newB)).isValid()) {
		return way ? moment(new Date(newA)).diff(new Date(newB)) : moment(new Date(newB)).diff(new Date(newA))
	}
	if (typeof newA === 'number')
		if (way) {
			return newB <= newA ? -1 : 1
		}
		else {
			return newA < newB ? -1 : 1
		}
	else {
		if (way) {
			return newB.toString().toLowerCase() <= newA.toString().toLowerCase() ? -1 : 1
		}
		else {
			return newA.toString().toLowerCase() < newB.toString().toLowerCase() ? -1 : 1
		}
	}
}
/**
 * Handle Sorting
 * @param {String} property 
 * @param {String} way 
 * @param {Array} data 
 */
export const handleRequestSort = (property, way, data, type) => {
	const orderBy = property;
	let order = way;
	let newData = []
	// if (type === 'date') { 
	// 	return newData = order === 'desc' ? data.sort((a, b) => moment(a[orderBy]).diff(b[orderBy])) : data.sort((a, b) => moment(b[orderBy]).diff(a[orderBy]))
	// }
	newData =
		order === 'desc'
			? data.sort((a, b) => sortFunc(a, b, orderBy, true))
			: data.sort((a, b) => sortFunc(a, b, orderBy, false))
	return newData
}
/**
 * Phone Formatter
 * @param {String} phone 
 */
export const pF = (phone) => {
	let phoneNumber
	try {
		phoneNumber = parsePhoneNumber(phone, 'DK')
	}
	catch (error) {
		return phone
	}
	return phoneNumber.formatInternational()
}
/**
 * Date Time Formatter
 * @param {Date} date 
 * @param {boolean} withSeconds 
 */
export const dateTimeFormatter = (date, withSeconds) => {
	var dt
	if (withSeconds)
		dt = moment(date).format('DD MMMM YYYY HH:mm:ss')
	else
		dt = moment(date).format('lll')
	return dt
}
/**
 * Short Date 'll' format
 * @param {Date} date 
 */
export const shortDateFormat = (date) => {
	var a = moment(date).format('ll')
	return a
}
/**
 * Date Formatter 'LL' format
 * @param {Date} date 
 */
export const dateFormatter = (date) => {
	var a = moment(date).format('LL')
	return a
}
export const timeFormatter = (date) => {
	var a = moment(date).format('HH:mm')
	return a
}

const suggestionSlicer = (obj) => {
	var arr = [];
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			var innerObj = {};
			if (typeof obj[prop] === 'object') {
				arr.push(...suggestionSlicer(obj[prop]))
			}
			else {
				innerObj = {
					id: prop.toString().toLowerCase(),
					label: obj[prop] ? obj[prop].toString() : ''
				};
				arr.push(innerObj)
			}
		}
	}
	return arr;
}

export const suggestionGen = (arrayOfObjs) => {
	let arr = [];
	arrayOfObjs.map(obj => {
		arr.push(...suggestionSlicer(obj))
		return ''
	})
	arr = _.uniqBy(arr, 'label')
	return arr;
}