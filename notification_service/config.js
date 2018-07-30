const config = {};
config.UNQFY_PORT = 5000;
config.NOTIF_PORT = 5001;
config.UNQFY_URL = `http://172.20.0.21:${config.UNQFY_PORT}`;
config.NOTIF_URL = `http://172.20.0.22:${config.NOTIF_PORT}`;

module.exports = config;