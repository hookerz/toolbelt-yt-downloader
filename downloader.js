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
                ret.metaData = info;
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
let multiDownload = function (info, namePrefix, formatArray, destinationDir, responseCallback, progressCallback, videoEndCallback) {
    return new Promise((resolve, reject) => {
        function run() {
            let item = formatArray.pop();
            let starttime = null;
            let filname = `${namePrefix}_${item.resolution}_${item.bitrate}_${item.audioEncoding}_${item.audioBitrate}_${Date.now()}.${item.container}`;
            let output = path.resolve(destinationDir, filname);

            let video = ytdl.downloadFromInfo(info, {
                format: item
            });
            video.pipe(fs.createWriteStream(output));
            video.once('response', () => {
                starttime = Date.now();
                console.log(starttime)
            });
            video.on('progress', (chunkLength, downloaded, total) => {
                const floatDownloaded = downloaded / total;
                const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
                console.log(`${(floatDownloaded * 100).toFixed(2)}% downloaded`);

                console.log(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`);
                console.log(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
                console.log(`estimated time left: ${(downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)}minutes `);
                console.log (' ')
            });
            video.on('end', () => {
                console.log('\n\n');
                if (formatArray.length > 0) {
                    run()
                } else {
                    resolve();
                }
            });
        }

        run();
    })
};
module.exports = {

    getInfo:getInfo,
    multiDownload:multiDownload,
    ytdl:ytdl

};
if (process.env.SOLOTEST === 'true') {
    console.log('!!! HELLO WORLD');
    getInfo('YE7VzlLtp-4')
        .then(infoObject => {
            let forArray = [
                infoObject.audioFormats[0],
                infoObject.videoFormats[0],
                infoObject.combinedFormats[0],
            ];
           return multiDownload(infoObject.metaData, 'herp', forArray, process.cwd(), () => {
            }, (chunkLength, downloaded, total) => {
            }, () => {
            });
        })
        .then (()=>{
            console.log ('all files done')

        })
}