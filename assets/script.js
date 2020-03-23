// Copyright (C) 2020  Daniel Oltmanns
function r(u) {window.location.href=u}
function l() {let e=document.querySelectorAll('img[x-src]'),i=0;for(i=0;i<e.length;i++){e[i].setAttribute('src', e[i].getAttribute('x-src'));}}
function t() {let h=document.querySelector(window.location.hash+' + * + a');if(h){h.removeAttribute('target')}}
function o() {l();t();}