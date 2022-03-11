
const {
  GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
 GUI_TYPE_NEXTCLOUD,
 GUI_TYPE_SEAFILE,
 GUI_TYPE_REVA,
 GUI_TYPE_REVANC
} = require('./guiTypes');

module.exports = {
  params: {
    'From Stub': {
      host: 'stub1.docker',
      domain: 'stub1.docker',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'To Stub': {
      host: 'stub2.docker',
      domain: 'stub2.docker',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'From Reva': {
      host: 'revad1.docker', // https: port 443, grpc: port 19000
      domain: 'revad1.docker',
      guiType: GUI_TYPE_REVA,
      username: 'einstein',
      password: 'relativity'
    },
    'To Reva': {
      host: 'revad2.docker', // https: port 443, grpc: port 19000
      domain: 'revad2.docker',
      guiType: GUI_TYPE_REVA,
      username: 'marie',
      password: 'radioactivity'
    },
    'From Revanc': { // should somehow specify that it should send through revanc1.docker instead of its built-in OCM implementation
      host: 'nc1.docker', // https: port 443, grpc: port 19000
      domain: 'nc1.docker',
      guiType: GUI_TYPE_REVANC,
      username: 'einstein',
      password: 'relativity'
    },
    'To Revanc': { // should somehow specify that it should receive through revanc2.docker instead of its built-in OCM implementation
      host: 'nc2.docker', // https: port 443, grpc: port 19000
      domain: 'nc2.docker',
      guiType: GUI_TYPE_REVANC,
      username: 'marie',
      password: 'radioactivity'
    },
    'From ownCloud': {
      host: 'oc1.docker',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'To ownCloud': {
      host: 'oc2.docker',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'From Nextcloud': {
      host: 'nc1.docker',
      domain: 'nc1.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'einstein',
      password: 'relativity'
    },
    'To Nextcloud': {
      host: 'nc2.docker',
      domain: 'nc2.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'marie',
      password: 'radioactivity'
    },
  },
};
