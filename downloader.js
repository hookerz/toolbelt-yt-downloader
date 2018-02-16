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
let multiDownload = function (info, namePrefix, formatArray, destinationDir, loggingDiv) {
    return new Promise((resolve, reject) => {
        let totalToRun = formatArray.length;

        function run() {
            let item = formatArray.pop();
            let starttime = null;
            let filname = `${namePrefix}_${item.resolution}_${item.bitrate}_${item.audioEncoding}_${item.audioBitrate}_${Date.now()}.${item.container}`;
            filname = filname.replace(/_null/g, '')
            let output = path.resolve(destinationDir, filname);
            let video = ytdl.downloadFromInfo(info, {
                format: item
            });
            video.pipe(fs.createWriteStream(output));
            video.once('response', () => {
                starttime = Date.now();
                loggingDiv.innerHTML = `Starting: Downloading ${filname}`;
                console.log(starttime)
            });
            video.on('progress', (chunkLength, downloaded, total) => {
                const floatDownloaded = downloaded / total;
                const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
                let s11 = `Downloading: ${filname}  file ${totalToRun - formatArray.length} of ${totalToRun} `;
                loggingDiv.innerHTML = s11 + '<br>';
                //  console.log(s11);
                let s1 = `${(floatDownloaded * 100).toFixed(2)}% downloaded`;
                // console.log(s1);
                loggingDiv.innerHTML += s1 + '<br>';
                let s2 = `(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`;
                // console.log(s2);
                loggingDiv.innerHTML += s2 + '<br>';
                let s3 = `running for: ${downloadedMinutes.toFixed(2)}minutes`;
                // console.log(s3);
                loggingDiv.innerHTML += s3 + '<br>';
                let s4 = `estimated time left: ${(downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)}minutes `;
                // console.log(s4);
                loggingDiv.innerHTML += s4 + '<br><br>';
                // console.log(' ')
            });
            video.on('end', () => {
                console.log('\n\n');
                if (formatArray.length > 0) {
                    loggingDiv.innerHTML = `COMPLETED: Downloading ${filname}`;
                    console.log(`COMPLETED: Downloading ${filname}`);
                    run()
                } else {
                    loggingDiv.innerHTML = `ALL FILES DOWNLOADED: Total: ${totalToRun}`;
                    console.log(`ALL FILES DOWNLOADED: Total: ${totalToRun}`);
                    resolve();
                }
            });
        }

        loggingDiv.innerHTML = `Starting: Downloading ${totalToRun} files`;
        run();
    })
};
module.exports = {
    getInfo: getInfo,
    multiDownload: multiDownload,
    ytdl: ytdl
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
            return multiDownload(infoObject.metaData, 'herp', forArray, process.cwd(), null);
        })
        .then(() => {
            console.log('all files done')
        })
}