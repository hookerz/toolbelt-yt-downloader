"use strict";
let fs = require('fs');
let path = require('path');
let process = require('process');
let _ = require('lodash');
let downloader = require('./downloader');
let checkIDButton = null;
let idField = null;
let folderFinder = null;
let folderPath = null;
let data = null;
let versionSelect = null;
let startDownloadButton = null;
let outputLog = null;
plugin.onload = init; // triggered when Toolbelt is ready to display this plugin.
function init() {
    console.log('PLUGIN plugin init', process.cwd(), plugin.path);
    renderInterface();
    //setupCheckbox();
    plugin.init(); // We've rendered our elements, now to tell Toolbelt the plugin is ready to be displayed.
    //openFrame();
}

function renderInterface() {
    // Plugins have access to the DOM of the index.html file this script was loaded in.
    checkIDButton = document.getElementById('checkid');
    idField = document.getElementById('ytid');
    checkIDButton.addEventListener('click', checkIDClickHandler);
    folderFinder = document.getElementById('folderFinder');
    folderFinder.addEventListener('change', updateFolderList);
    versionSelect = document.getElementById('versionSelect');
    startDownloadButton = document.getElementById('startDownload');
    startDownloadButton.addEventListener('click', checkAndRun);
    outputLog = document.getElementById('outputLog');
}

function checkAndRun() {
    console.log('check and run');
    if (data === null) {
        console.warn(' NO META DATA');
        outputLog.innerHTML = "Please provide a valid YouTube ID Before Proceeding";
        return;
    }
    if (folderPath === null) {
        console.warn(' NO Folder');
        outputLog.innerHTML = "Please Choose An Output Folder";
        return;
    }
    let selected = _.map(versionSelect.selectedOptions, (value) => {
        return value.value;
    });
    if (selected.length === 0) {
        console.warn(' NO Options Checked');
        outputLog.innerHTML = "Please Choose At Least 1 Option For Download";
        return;
    }
    let all = data.combinedFormats.concat(data.videoFormats).concat(data.audioFormats);
    let items = [];
    // go through each selected item and find it in the combined array
    _.forEach(selected, (value) => {
        items = items.concat(_.filter(all, (item) => {
            console.log(item.url === value);
            return item.url === value;
        }));
    });
    console.log('RUN DOWNLOADER', items, idField.value, folderPath);
    downloader.multiDownload(data.metaData, idField.value, items, folderPath, outputLog)
}

function updateFolderList(e) {
    console.log("PLUGIN", folderFinder.files[0].path);
    folderPath = folderFinder.files[0].path;
}

function checkIDClickHandler(e) {
    console.log('!!!', idField.value);
    if (downloader.ytdl.validateID(idField.value)) {
        downloader.getInfo(idField.value)
            .then(buildMultiSelectList)
            .catch (err=>{

                console.log('!!! YT ID ERROR', err.message);
                outputLog.innerHTML =`YT ID ERROR `+err.message;

            })
    } else {
        outputLog.innerHTML =`YT ID ERROR: Your ID is not valid`;
    }
}

function buildMultiSelectList(metaData) {
    data = metaData;
    outputLog.innerHTML =``;

    while (versionSelect.firstChild) {
        versionSelect.removeChild(versionSelect.firstChild);
    }
    _.forEach(metaData.combinedFormats, (value) => {
        let item = document.createElement("option");
        item.value = value.url;
        item.innerText = `VIDEO AND AUDIO ${value.resolution} ${value.audioEncoding} ${value.audioBitrate} ${value.container}`
        versionSelect.appendChild(item)
    });
    _.forEach(metaData.videoFormats, (value) => {
        let item = document.createElement("option");
        item.value = value.url;
        item.innerText = `VIDEO ONLY ${value.resolution} ${value.container}`;
        versionSelect.appendChild(item)
    })
    _.forEach(metaData.audioFormats, (value) => {
        let item = document.createElement("option");
        item.value = value.url;
        item.innerText = `AUDIO ONLY  ${value.audioEncoding} ${value.audioBitrate} ${value.container}`
        versionSelect.appendChild(item)
    });
}

function openFrame() {
    let frame = plugin.createFrame('Plugin Template Frame', {
        width: 300,
        height: 250,
        x: plugin.frame.width - 5,
        y: plugin.frame.y
    });
    frame.document.body.innerHTML = 'Hello World!';
}

