"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get GITHUB_HEADER_API_VERSION () {
        return GITHUB_HEADER_API_VERSION;
    },
    get REPO () {
        return REPO;
    }
});
var GITHUB_HEADER_API_VERSION = '2022-11-28';
var REPO = {
    GitHub: 'GitHub',
    BitBucket: 'BitBucket',
    GitLab: 'GitLab'
};
