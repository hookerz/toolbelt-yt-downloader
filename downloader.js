'use strict';
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const ytdl = require('ytdl-core');
const del = require('del');
if (process.env.SOLOTEST !== 'true') {
    tmp.setGracefulCleanup();
}
let main = function (rootDir, logger = console, cwdRoot = process.cwd()) {
    return new Promise((resolve, reject) => {
    })
};
let getInfo = function (ytID) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(yiID)
            .then(info => {
                console.log(info);
                let ret = {};
                ret.audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
                ret.videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
                ret.combinedFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
                resolve(  ret )
            })
    })
};
module.exports = main;
if (process.env.SOLOTEST === 'true') {
    console.log('!!! HELLO WORLD');
    getInfo('YE7VzlLtp-4')
}