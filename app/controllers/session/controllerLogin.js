const modelUser = require('../../models/modelUser')
const modelUserInfo = require('../../models/modelUserInfo')
const crypto = require('crypto-js')

const DATE = new Date()

// >>>>>>>>>>>>>>>>>>>>>> Login <<<<<<<<<<<<<<<<<<<<<<
async function logIn(req, res) {
	// LogIn validator
	await modelUser.findOne({ _id: req.body._id }, { _id: 1, pass: 1, enabled: 1 })
	.then((dataUser) => {
		if(dataUser) { // If there is data in dataUser 👍
			if(!dataUser.enabled) {
				return res.json({
					msg: 'El usuario o contraseña no coinciden.', 
					status: 404
				})
			}

			// Users that have session tokens in browser cookies
			if(typeof req.body.pass === 'object') {
				req.body.pass = crypto.AES.decrypt(req.body.pass.token, req.body._id)
				req.body.pass = req.body.pass.toString(crypto.enc.Utf8)
			}
			
			let compare = crypto.AES.decrypt(dataUser.pass, req.body._id)
			
			if(compare.toString(crypto.enc.Utf8) === req.body.pass) { //🟢
				modelUserInfo.findOne({ _id: req.body._id })
				.then((dataUInfo) => {
					// Update last connection
					// yyyy-mm-dd
					const FORMAT_DATE = `${ DATE.getFullYear() }-`+
					`${ (String(DATE.getMonth()+1).length == 1) ? '0'+(DATE.getMonth()+1) : DATE.getMonth()+1 }-`+
					`${ (String(DATE.getDate()).length == 1) ? '0'+(DATE.getDate()) : DATE.getDate() }`
					// hh:mm
					const FORMAT_HOUR = `${ (String(DATE.getHours()).length == 1) ? '0'+(DATE.getHours()) : DATE.getHours() }:`+
					`${ (String(DATE.getMinutes()).length == 1) ? '0'+(DATE.getMinutes()) : DATE.getMinutes() }`

					modelUser.updateOne(
						{ _id: req.body._id },
						{ $set: {
							last_conn:{
								date: FORMAT_DATE,
								time: FORMAT_HOUR
							}
						}}
					)
					.then(() => {
						// Server 🍪🍪🍪
						req.session._id = req.body._id
						req.session.name = dataUInfo.name
						req.session.area = dataUInfo.area
						req.session.direction = dataUInfo.direction
						req.session.position = dataUInfo.position
						req.session.category = dataUInfo.category

						if('super' in dataUInfo) req.session.super = dataUInfo.super
	
						//Response success for Asynchronous request
						return res.json({
							data: (req.session.category == -1) ? null : {
								user:  req.session._id,
								pass: { token: crypto.AES.encrypt(req.body.pass, req.body._id).toString() },
								name: req.session.name,
							},
							status: 200
						})

					})
					.catch((error) => {
						console.log(error)
						//Response error for Asynchronous request
						return res.json({
							msg: 'Error de actualización de datos.', 
							status: 500
						})
					})
				})
				.catch((error) => {
					console.log(error)
					return res.json({
						msg: 'Error de búsqueda de usuario. Intenta de nuevo mas tarde.', 
						status: 404
					})
				})
			} else { //🔴
				return res.json({
					msg: 'El usuario o contraseña no coinciden.',
					class: false,
					status: 404
				})
			}
		} else {
			//if no data 🥶
			return res.json({
				msg: 'El usuario o contraseña no coinciden.',
				class: false,
				status: 404
			})
		}
	})
	.catch((error) => { //if error 🤬
		console.log(error)
		return res.json({
			msg: 'Error del servidor.\n\r¡No te alarmes! Todo saldrá bien.', 
			status: 500,
			error: true
		})
	})
	//NUNCA colocar un return fuera del catch
	//NEVER place a return outside the catch
}

async function logOut(req, res) {
	//🍪🚫
	req.session.destroy()
	
	if(req.session == null) {
		return res.json({
			msg: 'Sesión finalizada.', 
			status: 200,
			snack: true
		})
	} else {
		return res.json({
			msg: 'Algo salio mal.\n\r¡No te alarmes! Todo saldrá bien.', 
			status: 404,
			snack: true
		})
	}
}

function lang(req, res) {
	if(req.body) {
		try {
			req.session.lang = req.body.lang
			return res.json({ status: 200 })
		} catch (error) {
			return res.json({
				status: 418,
				error: error
			})
		}
	}
	else res.json({
		status: 418,
		error: 'Without data'
	})
}

module.exports = {
	logIn,
	logOut,
	lang
}
