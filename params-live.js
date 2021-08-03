
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
    }
  }
};