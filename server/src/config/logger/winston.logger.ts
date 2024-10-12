import { join } from 'path';

import { bgGreen, bgMagenta, bgRed, bgYellow, green, magenta, red, yellow } from 'colors';
import { get, isArray, isObject, isString, omit } from 'lodash';
import { render } from 'prettyjson';
import { createLogger, format, transports } from 'winston';

import prettyStack from '@kibibit/pretty-stack';

import { configService } from '../config.service';


// custom log display format
const customFormat = format.printf(({ context, level, timestamp, message, stack }) => {
  if (isArray(stack) && isObject(stack[0]) && (stack[0] as any).context) {
    context = (stack[0] as any);
    // everything else in stack
    stack = stack.slice(1);
  }
  const locationContext = isString(context) ? context : context.context;
  const metaStack = get(context, 'stack');
  const metaData = isString(context) ? null : omit(context, [ 'context', 'stack' ]);
  const haveExtraObject = metaData && Object.keys(metaData).length;
  const extraObject = haveExtraObject ? `\n${ render(metaData, {
    // keysColor: 'yellow', levelColorName(level),
    // dashColor: 'magenta',
    // stringColor: 'white',
    // numberColor: 'green'
  }, 2) }\n` : '';
  const errorStack = metaStack ? `\n${ prettyStack(metaStack, false) }` : '';
  // level = level === 'verbose' ? 'extra' : level;
  return [
    `${ levelColor(strictLength(level.toUpperCase(), getMaxLevelLength() + 2)) } `,
    // `${ levelColor(' ' + level.toUpperCase() + ' ') + padString(level, getMaxLevelLength()) } `,
    // `${ padString(level, getMaxLevelLength()) + levelColor(' ' + level.toUpperCase() + ' ') } `,
    `${ timestamp } `,
    `${ yellow.bold(`[${ strictLength(locationContext, 18) }]`) } `,
    `${ messageColor(message.trim(), level) }`,
    extraObject ? `\n\n ${ bgMagenta.bold.black(' Metadata ') }` : '',
    extraObject,
    errorStack
  ].join('');
});

const options = {
  file: {
    filename: join(configService.appRoot, 'logs', 'error.log'),
    level: 'error'
  },
  console: {
    level: 'silly'
  }
};

// for development environment
const devLogger = {
  format: format.combine(
    format.timestamp({ format: 'HH:mm:ss' }),
    // format.colorize({ all: true }),
    format.align(),
    // format.errors({ stack: true }),
    customFormat
  ),
  transports: [ new transports.Console(options.console) ]
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp({ format: 'isoDate' }),
    format.colorize({ all: true }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: join(configService.appRoot, 'logs', 'combine.log'),
      level: 'info'
    })
  ]
};

// export log instance based on the current environment
const instanceLogger = (process.env.NODE_ENV === 'production') ? prodLogger : devLogger;

export const loggerInstance = createLogger(instanceLogger);

function strictLength(str: string, len: number) {
  if (str.length >= len) {
    return str;
  }
  // ADD SPACES to both sides of the string to keep word centered
  const beforeSpaces = Math.floor((len - str.length) / 2);
  const afterSpaces = len - str.length - beforeSpaces;
  return ' '.repeat(beforeSpaces) + str + ' '.repeat(afterSpaces);
}

function padString(str: string, len: number) {
  return ' '.repeat(len - str.length);
}

function levelColor(msg: string, level?: string) {
  level = level || msg;
  switch (level.trim().toLowerCase()) {
    case 'error':
      return bgRed.white(msg);
    case 'warn':
      return bgYellow.black(msg);
    case 'info':
      return bgGreen.white(msg);
    case 'verbose':
      return bgMagenta.white(msg);
    case 'extra':
      return bgMagenta.white(msg);
    case 'debug':
      return bgMagenta.white(msg);
    case 'silly':
      return bgMagenta.white(msg);
    default:
      return msg;
  }
}

function levelColorName(level: string) {
  switch (level.trim().toLowerCase()) {
    case 'error':
      return 'red';
    case 'warn':
      return 'yellow';
    case 'info':
      return 'blue';
    case 'verbose':
      return 'magenta';
    case 'extra':
      return 'magenta';
    case 'debug':
      return 'magenta';
    case 'silly':
      return 'magenta';
    default:
      return 'green';
  }
}

function messageColor(msg: string, level?: string) {
  level = level || msg;
  switch (level.trim().toLowerCase()) {
    case 'error':
      return red(msg);
    case 'warn':
      return yellow(msg);
    case 'info':
      return green(msg);
    case 'verbose':
      return magenta(msg);
    case 'extra':
      return magenta(msg);
    case 'debug':
      return magenta(msg);
    case 'silly':
      return magenta(msg);
    default:
      return msg;
  }
}

function getMaxLevelLength() {
  const actualLengthPlusTwo = Math.max(
    'error'.length,
    'warn'.length,
    'info'.length,
    'verbose'.length,
    'debug'.length,
    'silly'.length
  );

  // if the length is odd, make it even
  return actualLengthPlusTwo % 2 === 0 ? actualLengthPlusTwo : actualLengthPlusTwo + 1;
}
