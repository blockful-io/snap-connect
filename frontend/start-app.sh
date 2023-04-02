# install nvm
echo "Installing nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

# loading nvm
echo "Loading nvm"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# install node
echo "Installing node version 14"
nvm install 14
nvm use 14

# install pm2
echo "Installing pm2"
npm install pm2 -g

# install app dependencies
echo "Installing app dependencies"
npm install

# build next.js app
echo "Building next.js app"
npm run build

# delete pm2 process with name snap-connect-frontend if it exists
echo "Deleting pm2 process with name snap-connect-frontend if it exists"
if pm2 list | grep -q "snap-connect-frontend"; then
    pm2 delete snap-connect-frontend
    echo "Deleted pm2 process with name snap-connect-frontend"
fi

# RIGHT HERE IS WHERE THE APP IS FOR A BREIF MOMENT UNAVAILABLE

# load port variable from .env PORT
echo "Loading port variable from .env PORT"
export PORT=$(grep -oP '(?<=PORT=).+' .env)

# run app with pm2 in the port PORT
echo "Running app with pm2 in the port $PORT"
pm2 start --name "snap-connect-frontend" npm -- start

# save pm2 processes
echo "Saving pm2 processes"
pm2 save