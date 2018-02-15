"use strict";
let fs = require('fs');
let path = require('path');
let process = require('process');
let _ = require('lodash');
let checkIDButton = null;
let idField = null;
let downloader = require('./downloader');

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
    idField  = document.getElementById('ytid');
    checkIDButton.addEventListener('click', checkIDClickHandler);
}


function checkIDClickHandler (e){



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

