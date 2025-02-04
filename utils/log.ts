// Available log levels
export const Levels = {
  Silent: -1,
  Fatal: 0,
  Error: 10,
  Warn: 20,
  Info: 30,
  Log: 30,
  Debug: 40,
  Trace: 50,
  Verbose: 50,
};

// Map LogLevel (number as string) to LogLevel name
export const LevelsMap: Record<string, string> = Object.entries(Levels).reduce(
  (acc, [key, value]) => ({ ...acc, [String(value)]: key }),
  {},
);

// Log levels inferred type
export type LogLevel = typeof Levels[keyof typeof Levels];

// Minimal log record
export type MinimalLogRecord = { msg: string; args: unknown[]; level: LogLevel };

// Full log record
export type LogRecord<T extends object = {}> = MinimalLogRecord & T;

// Full log record creator
export type LogRecordFactory<T extends MinimalLogRecord = MinimalLogRecord> = (...args: any[]) => LogRecord<T>;

// Log record to string converter
export type LogRecordSerializer = (record: LogRecord) => string;

// Logging function sends serialized log record to destination
export type LoggerFn = (serialized: string) => void;

// serialize helpers
const name = (level: LogLevel) => (LevelsMap[String(level)] ?? "Unknown").toUpperCase();
const payload = (args: unknown[]) => `[${args.join(", ")}]`;

/**
 * Default log record serializers
 */
export const Serializers: Record<string, LogRecordSerializer> = {
  JSON: (record: LogRecord) => JSON.stringify(record),
  String: (record: LogRecord) => [name(record.level), record.msg, payload(record.args)].join(" "),
};

/**
 * Default log record factories
 */
export const RecordFactories: Record<string, LogRecordFactory> = {
  Minimal: (level: LogLevel, msg: string, ...args: unknown[]) => ({ msg, args, level }) as LogRecord,
  TimeStamped: (level: LogLevel, msg: string, ...args: unknown[]) => ({ ts: Date.now(), msg, args, level }) as LogRecord<{ ts: number }>,
};

/**
 * Default loggers
 */
export const Loggers: Record<string, LoggerFn> = {
  Console: console.log.bind(console),
};

/**
 * Module defaults
 */
const Logger = {
  Level: 30,
  Serializer: Serializers.JSON,
  Factory: RecordFactories.Minimal,
  Logger: Loggers.Console,
};

// Module API

export function setLevel(level: LogLevel) {
  Logger.Level = level;
}

export function setSerializer(serializer: LogRecordSerializer) {
  Logger.Serializer = serializer;
}

export function setFactory(factory: LogRecordFactory) {
  Logger.Factory = factory;
}

export function setLogger(logger: LoggerFn) {
  Logger.Logger = logger;
}

export function log(level: LogLevel, msg: string, ...args: unknown[]) {
  if (Logger.Level < level) return;
  Logger.Logger(Logger.Serializer(Logger.Factory(...args)));
}

export function info(msg: string, ...args: unknown[]) {
  log(Levels.Info, msg, args);
}

export function debuglog(msg: string, ...args: unknown[]) {
  log(Levels.Debug, msg, args);
}

export function errorlog(msg: string, ...args: unknown[]) {
  log(Levels.Error, msg, args);
}
