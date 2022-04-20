
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
      ocmDomain: 'stub1.docker',
      guiDomain: 'stub1.docker',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'To Stub': {
      ocmDomain: 'stub2.docker',
      guiDomain: 'stub2.docker',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'From Reva': {
      ocmDomain: 'revad1.docker', // https: port 443, grpc: port 19000
      guiDomain: 'revad1.docker',
      guiType: GUI_TYPE_REVA,
      username: 'einstein',
      password: 'relativity'
    },
    'To Reva': {
      ocmDomain: 'revad2.docker', // https: port 443, grpc: port 19000
      guiDomain: 'revad2.docker',
      guiType: GUI_TYPE_REVA,
      username: 'marie',
      password: 'radioactivity'
    },
    'From Revanc': { // should somehow specify that it should send through revanc1.docker instead of its built-in OCM implementation
      ocmDomain: 'revanc1.docker', // https: port 443, grpc: port 19000
      guiDomain: 'nc1.docker',
      guiType: GUI_TYPE_REVANC,
      username: 'einstein',
      password: 'relativity'
    },
    'To Revanc': { // should somehow specify that it should receive through revanc2.docker instead of its built-in OCM implementation
      ocmDomain: 'revanc2.docker', // https: port 443, grpc: port 19000
      guiDomain: 'nc2.docker',
      guiType: GUI_TYPE_REVANC,
      username: 'marie',
      password: 'radioactivity'
    },
    'From ownCloud': {
      ocmDomain: 'oc1.docker',
      guiDomain: 'oc1.docker',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'To ownCloud': {
      ocmDomain: 'oc2.docker',
      guiDomain: 'oc2.docker',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'From Nextcloud': {
      ocmDomain: 'nc1.docker',
      guiDomain: 'nc1.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'einstein',
      password: 'relativity'
    },
    'To Nextcloud': {
      ocmDomain: 'nc2.docker',
      guiDomain: 'nc2.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'marie',
      password: 'radioactivity'
    },
  },
};
