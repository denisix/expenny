cd /srv/expenses && tar zxf expenses.tar.gz
(cd bundle/programs/server && npm install)

export NODE_ENV=production
export PORT=3000
export MONGO_URL='mongodb://exp:ho5sZ1SmFqbjFh0@localhost:27017/expenses'
export ROOT_URL='https://expenses.dcxv.com'
export MAIL_URL='smtp://user:password@mailhost:port/'

forever stopall
forever start bundle/main.js
