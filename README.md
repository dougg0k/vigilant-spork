# Vigilant Spork

### Installing Yarn (OSX)

To install Yarn, make sure that you use use the --without-node flag to use nvm's version.

```
brew install yarn --without-node
```

To access Yarn's executables globally, add the folowing to your profile.

```
export PATH="$PATH:`yarn global bin`"
```

### Installing NodeJS with NVM

Use either curl or wget to install NVM

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

The script will clone the NVM repository to a .nvm folder in your home directory. It will also add the source
line to your profile (e.g. `~/.bash_profile`). Note that you might want to add it yourself.
Enesure that the following is in your profile.

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

If everything is correctly configured, reload your shell: `source ~\.bash_profile`

The proper version of NodeJS can now be installing using NVM. As of writing this, we are using v10.0.0

```
nvm install v10.0.0
```

You might also want to set it as the default.

```
nvm alias default v10.0.0
```

### Installing GraphQL and Prisma CLIs

You need to have the [GraphQL CLI](https://github.com/graphql-cli/graphql-cli) installed to bootstrap your GraphQL server using `graphql create`. The [Prisma CLI](https://github.com/prismagraphql/prisma/) allows you to deploy your code.

```sh
yarn global add graphql-cli
yarn global add prisma
yarn global add prisma-binding
```

### Installing Docker

Installing Docker will depend on your system. The instructions for OSX can be found here: https://docs.docker.com/docker-for-mac/install/

It's important to make sure that docker-compose is also installed, as it will be used to run the backend.

## Setup

Once all your dependencies are installed, you can begin deploying your backend, which will consist of a [Prisma](https://www.prisma.io/) server connected to a local [MySQL](https://www.mysql.com/) instance.

- The following will start the backend:

```sh
docker-compose up -d
```

- We can deploy the datamodel (found at `./database/datamodel.graphql`) using the following command. Follow the prompt to set up a local server using Docker.

```sh
prisma deploy
```

- The front-end can be started by simply running

```sh
yarn && yarn start
```

## GraphQL Playground

Prisma comes with a [built in IDE](https://github.com/prisma/graphql-playground) for viewing your data and schema. It can be viewed in your browser on the Docker endpoint, such as `http://localhost:4466`.
