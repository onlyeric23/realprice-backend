export const ISO8601 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

export const ABSTRACT_ADDRESS_TP = /((\d+)-(\d+))[(地號)|號]+/;

export const ADDRESS_TAIWAN = /(\d+)?([台臺]灣)?(..[市縣])?(.{1,2}[^鄉鎮市區]?[鄉鎮市區])?(.{1,3}[村里])?(.{1,4}鄰)?(.{1,3}[街路])?(.{1,2}段)?(.{1,2}巷)?(.{1,2}弄)?([\d-]+號)?/;
