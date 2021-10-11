
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
      host: 'stub1.docker',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'To Stub': {
      host: 'stub2.docker',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'From Reva': {
      host: 'http://revad1.docker',
      guiType: GUI_TYPE_REVA,
      username: 'admin',
      password: 'admin'
    },
    'To Reva': {
      host: 'http://revad2.docker',
      guiType: GUI_TYPE_REVA,
      username: 'admin',
      password: 'admin'
    },
    // 'From ownCloud': {
    //   host: 'ocm-test-suite_oc1.docker_1',
    //   guiType: GUI_TYPE_OWNCLOUD,
    //   username: 'admin',
    //   password: 'admin'
    // },
    // 'To ownCloud': {
    //   host: 'ocm-test-suite_oc2.docker_1',
    //   guiType: GUI_TYPE_OWNCLOUD,
    //   username: 'admin',
    //   password: 'admin'
    // },
    'From Nextcloud': {
      host: 'nc1.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'To Nextcloud': {
      host: 'nc2.docker',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    }
  }
};
