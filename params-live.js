
const {
  GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
 GUI_TYPE_NEXTCLOUD,
 GUI_TYPE_SEAFILE,
 GUI_TYPE_REVA
} = require('./guiTypes'); 

module.exports = {
  GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
  GUI_TYPE_NEXTCLOUD,
  GUI_TYPE_SEAFILE,
  params: {
    'From Stub': {
      host: 'stub1.pdsinterop.net',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'To Stub': {
      host: 'stub1.pdsinterop.net',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'From ownCloud': {
      host: 'oc1.pdsinterop.net',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'admin',
      password: 'admin'
    },
    'To ownCloud': {
      host: 'oc2.pdsinterop.net',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'admin',
      password: 'admin'
    },
    'From Nextcloud': {
      host: 'nc1.pdsinterop.net',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'To Nextcloud': {
      host: 'nc2.pdsinterop.net',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'From Reva': {
      host: '127.0.0.1:19000',
      domain: 'cernbox.cern.ch',
      guiType: GUI_TYPE_REVA,
      username: 'einstein',
      password: 'relativity'
    },
    'To Reva': {
      host: '127.0.0.1:17000',
      domain: 'cesnet.cz',
      guiType: GUI_TYPE_REVA,
      username: 'marie',
      password: 'radioactivity'
    },
  }
};