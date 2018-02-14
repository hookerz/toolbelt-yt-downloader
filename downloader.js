'use strict';
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const ytdl = require('ytdl-core');
const del = require('del');
let main = function (rootDir, logger = console, cwdRoot = process.cwd()) {
    return new Promise((resolve, reject) => {
    })
};
let getInfo = function (ytID) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(ytID)
            .then(info => {
                //console.log(info);
                let ret = {};
                ret.audioFormats = function () {
                    return _.filter(ytdl.filterFormats(info.formats, 'audioonly'), function (item) {
                        return item.audioEncoding === 'aac';
                    })
                }();
                ret.videoFormats = function () {
                    return _.filter(ytdl.filterFormats(info.formats, 'videoonly'), function (item) {
                        return item.encoding === 'H.264';
                    })
                }();
                ret.combinedFormats = function () {
                    return _.filter(ytdl.filterFormats(info.formats, 'audioandvideo'), function (item) {
                        return item.encoding === 'H.264';
                    })
                }();
                resolve(ret)
            })
    })
};
module.exports = main;
if (process.env.SOLOTEST === 'true') {
    console.log('!!! HELLO WORLD');
    getInfo('YE7VzlLtp-4')
}