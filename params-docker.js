
const GUI_TYPE_STUB = 'GUI Stub';
const GUI_TYPE_OWNCLOUD = 'GUI ownCloud';
const GUI_TYPE_NEXTCLOUD = 'GUI Nextloud';
const GUI_TYPE_SEAFILE = 'GUI Seafile';
module.exports = {
  GUI_TYPE_STUB,
  GUI_TYPE_OWNCLOUD,
  GUI_TYPE_NEXTCLOUD,
  GUI_TYPE_SEAFILE,
  params: {
    'From Stub': {
      host: 'ocm-test-suite_stub1.docker_1',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'To Stub': {
      host: 'ocm-test-suite_stub1.docker_1',
      guiType: GUI_TYPE_STUB,
      username: 'admin',
      password: 'admin'
    },
    'From ownCloud': {
      host: 'ocm-test-suite_oc1.docker_1',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'admin',
      password: 'admin'
    },
    'To ownCloud': {
      host: 'ocm-test-suite_oc2.docker_1',
      guiType: GUI_TYPE_OWNCLOUD,
      username: 'admin',
      password: 'admin'
    },
    'From Nextcloud': {
      host: 'ocm-test-suite_nc1.docker_1',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    },
    'To Nextcloud': {
      host: 'ocm-test-suite_nc2.docker_1',
      guiType: GUI_TYPE_NEXTCLOUD,
      username: 'alice',
      password: 'alice123'
    }
  }
};
