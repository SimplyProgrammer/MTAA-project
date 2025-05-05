import { format, add, set } from 'date-fns'

//Get time (as duration) from secs, mins, hours
Date.time ??= (time, minutes = 0, hours = 0, date = new Date(1970, 0, 1)) => {
	date = new Date(date)

	const timeTokens = time?.toString().split(/\:| +/)
	if (timeTokens?.length > 1) {
		date.setHours(timeTokens[0] ?? hours, timeTokens[1] ?? minutes, timeTokens[2] ?? date.getSeconds())
		return date
	}

	date.setHours(hours, minutes, time)
	return date
}

Date.prototype.equals ??= function(another) {
	return this.getTime() == new Date(another)?.getTime()
}

Date.prototype.format ??= function(formatStr = 'kk:mm:ss', options = { moreThan24H: true }) {
	if (options?.moreThan24H) {
		const hours = this.getMonth() * 31 * 24 + (this.getDate()-1) * 24 + this.getHours() //Calc hours from days and mounths allowing 24+h (8927h 59min max)
		formatStr = formatStr.replace('kk', String(hours).padStart(2, '0')).replace('k', hours)
	}

	try {
		return format(this, formatStr, options)
	}
	catch (err) {
		return ""
	}
}

Date.prototype.set ??= function(values, options) {
	return set(this, values, options)
}

Date.prototype.add ??= function(duration = { seconds: 1 }, options) {
	return add(this, duration, options)
}