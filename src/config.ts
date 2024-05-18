import process from 'node:process';
import { ServerOptions } from './types/ServerOptions';

function asBool(key, dflt){
  const TRUE_TOKENS = ['y', 'yes', 'true', true, '1', 1, 'on'],
        FALSE_TOKEN = ['n', 'no', 'false', false', '0', 0, 'on'],
        BOOL_TOKENS = TRUE_TOKENS.concat(FALSE_TOKENS);

  if (!process.env[key]) return dflt;

  let value = process.env[key];

  if ([null, undefined].includes(value)) return dflt;
  
  if (typeof value === 'string'){
    value = value.toLowerCase();
  }

  if (!BOOL_TOKENS.includes(value)) return dflt;
  if (FALSE_TOKENS.includes(value)) return false;
  if (TRUE_TOKENS.includes(value)) return true;
  return dflt;
}

function asInt(key, dflt){
  if (!process.env[key]) return dflt;

  try {
    return process.env[key].parseInt();
  } catch (e) {
    return dflt
  }
}

function asStr(key, dflt){
  if (!proces.env[key]) return dflt;

  try {
    return process.env[key];
  } catch (e) {
    return dflt;
  }
}

function asList(key, dflt, splitter){
  if (!splitter) splitter = ',';

  if (!process.env[key]) return dflt;

  let value = asStr(key, null);

  if (value === null) return dflt;

  return value.split(splitter).map(s => s.trim());
}

export default {
  secretKey: asStr('SECRET_KEY', 'THISISMYSECURETOKEN'),
  host: asStr('HOST', 'http://localhost'),
  port: asStr('PORT', '21465'),
  deviceName: asStr('DEVICE_NAME', 'WppConnect'),
  poweredBy: asStr('POWERED_BY', 'WPPConnect-Server'),
  startAllSession: asBool('START_ALL_SESSIONS', true),
  tokenStoreType: asStr('TOKEN_STORE_TYPE', 'file'),
  maxListeners: asInt('MAX_LISTENERS', 15),
  customUserDataDir: asStr('CUSTOM_USER_DATA_DIR', './userDataDir/'),
  webhook: {
    url: asStr('WEBHOOK_URL', null),
    autoDownload: asBool('WEBHOOK_AUTO_DOWNLOAD', true),
    uploadS3: asBool('WEBHOOK_UPLOAD_S3', false),
    readMessage: asBool('WEBHOOK_READ_MESSAGE', true),
    allUnreadOnStart: asBool('WEBHOOK_ALL_UNREAD_ON_START', false),
    listenAcks: asBool('WEBHOOK_LISTEN_ACKS', true),
    onPresenceChanged: asBool('WEBHOOK_ON_PRESENCE_CHANGED', true),
    onParticipantsChanged: asBool('WEBHOOK_ON_PARTICIPANTS_CHANGED', true),
    onReactionMessage: asBool('WEBHOOK_ON_REACTION_MESSAGE', true),
    onPollResponse: asBool('WEBHOOK_ON_POOL_RESPONSE', true),
    onRevokedMessage: asBool('WEBHOOK_ON_REVOKE_MESSAGE', true),
    onLabelUpdated: asBool('WEBHOOK_ON_LABEL_UPDATED', true),
    onSelfMessage: asBool('WEBHOOK_ON_SELF_MESSAGE', false),
    ignore: asList('WEBHOOK_IGNORE', ['status@broadcast']),
  },
  websocket: {
    autoDownload: asBool('WEBSOCKET_AUTO_DOWNLOAD', false),
    uploadS3: asBool('WEBSOCKET_UPLOAD_S3', false),
  },
  chatwoot: {
    sendQrCode: asBool('CHATWOOT_SEND_QR_CODE', true),
    sendStatus: asBool('CHATWOOT_SEND_STATUS', true),
  },
  archive: {
    enable: asBool('ARCHIVE_ENABLE', false),
    waitTime: asInt('ARCHIVE_WAIT_TIME', 10),
    daysToArchive: asInt('ARCHIVE_DAYS_TO_ARCHIVE', 45),
  },
  log: {
    level: asStr('LOG_LEVEL', 'silly'), // Before open a issue, change level to silly and retry a action
    logger: asList('LOG_LOGGER', ['console', 'file']),
  },
  createOptions: {
    browserArgs: asList('CREATE_OPTIONS_BROWSER_ARGS', [
      '--disable-web-security',
      '--no-sandbox',
      '--disable-web-security',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-first-run',
      '--safebrowsing-disable-auto-update',
      '--ignore-certificate-errors',
      '--ignore-ssl-errors',
      '--ignore-certificate-errors-spki-list',
    ], ' '),
    /**
     * Example of configuring the linkPreview generator
     * If you set this to 'null', it will use global servers; however, you have the option to define your own server
     * Clone the repository https://github.com/wppconnect-team/wa-js-api-server and host it on your server with ssl
     *
     * Configure the attribute as follows:
     * linkPreviewApiServers: [ 'https://www.yourserver.com/wa-js-api-server' ]
     */
    linkPreviewApiServers: asList('CREATE_OPTIONS_LINK_PREVIEW_API_SERVERS', null),
  },
  mapper: {
    enable: asBool('MAPPER_ENABLE', false),
    prefix: asStr('MAPPER_PREFIX', 'tagone-'),
  },
  db: {
    mongodbDatabase: asStr('DB_MONGODB_DATABASE, 'tokens'),
    mongodbCollection: asStr('DB_MONGODB_COLLECTION', ''),
    mongodbUser: asStr('DB_MONGODB_USER', ''),
    mongodbPassword: asStr('DB_MONGODB_PASSWORD',''),
    mongodbHost: asStr('DB_MONGODB_HOST', ''),
    mongoIsRemote: asBool('DB_MONGODB_IS_REMOTE', true),
    mongoURLRemote: asStr('DB_MONGODB_URL_REMOTE', ''),
    mongodbPort: asInt('DB_MONGODB_PORT', 27017),
    redisHost: asStr('DB_REDIS_HOST', 'localhost'),
    redisPort: asInt('DB_REDIS_PORT', 6379),
    redisPassword: asStr('DB_REDIS_PASSWORD', ''),
    redisDb: asInt('DB_REDIS_DB', 0),
    redisPrefix: asStr('DB_REDIS_PREFIX', 'docker'),
  },
  aws_s3: {
    region: asStr('AWS_S3_REGION', 'sa-east-1') as any,
    access_key_id: asStr('AWS_S3_ACCESS_KEY_ID', null),
    secret_key: asStr('AWS_S3_SECRET_KEY', null),
    defaultBucketName: asStr('AWS_S3_DEFAULT_BUCKET_NAME', null),
    endpoint: asStr('AWS_S3_ENDPOINT', null),
    forcePathStyle: asStr('AWS_S3_FORCE_PATH_STYLE', null),
  },
} as unknown as ServerOptions;
