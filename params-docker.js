
const {
  GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
 GUI_TYPE_NEXTCLOUD,
 GUI_TYPE_SEAFILE,
 GUI_TYPE_REVA
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
    'From Revanc': {
      host: 'revanc1.docker', // https: port 443, grpc: port 19000
      domain: 'revanc1.docker',
      guiType: GUI_TYPE_REVA,
      username: 'einstein',
      password: 'relativity'
    },
    'To Revanc': {
      host: 'revanc2.docker', // https: port 443, grpc: port 19000
      domain: 'revanc2.docker',
      guiType: GUI_TYPE_REVA,
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
      username: 'alice',
      password: 'alice123'
    },
    'To Nextcloud': {
      host: 'nc2.docker',
      domain: 'nc2.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    }
  }
};
