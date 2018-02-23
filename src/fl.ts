/* globals document, window, JSON, require, CSInterface, CSEvent, SystemPath, VulcanInterface, VulcanMessage */

declare const CSInterface: any;

export default class fl {
//appName, appVersion, tools, drawingLayer, Math, documents, configDirectory, configURI, commonConfigURI, applicationDirectory, applicationURI, languageCode, outputPanel, actionsPanel, componentsPanel, xmlui, screenTypes, version, getDynamicSWFURL, mruRecentFileList, mruRecentFileListType, createNewDocList, createNewDocListType, createNewTemplateList, normalGradientSelection, contactSensitiveSelection, objectDrawingMode, packagePaths, as3PackagePaths, compilerErrors, scriptURI, undoMode, scriptTimeoutEnabled, swfPanels, flexSDKPath, presetPanel, sourcePath, libraryPath, externalLibraryPath, defaultFontName, fillColor, strokeColor, createNewDocListFlag, publishCacheEnabled, publishCacheDiskSizeMax, publishCacheMemorySizeMax, publishCacheMemoryEntrySizeLimit, publishSizeReportXMLEnabled, suppressAlerts, webfontsManager

    private static _CSIF: CSInterface;
    static get CSIF(): CSInterface {
        return fl._CSIF ? fl._CSIF : new CSInterface()
    }

    static SAVE_NAME: string = "cjsSupporter_data";

    // static getDocumentDOM(atrs, callBack) {
    //     return new Promise(function (resolve, reject) {
    //         new CSInterface().evalScript("fl.getDocumentDOM()", (e) => {
    //             callBack(e);
    //             resolve("dddd");
    //         });
    //     })
    // }
    // static getDocumentDOM(join: string = "") {
    //     return new Promise(function (resolve, reject) {
    //         try {
    //             new CSInterface().evalScript("fl.getDocumentDOM()" + join, (e: any) => {
    //                 resolve(e);
    //             });
    //         } catch (e: any) {
    //             reject(e);
    //         }
    //     })
    // }
    static run(jsfl: string): Promise {
        return new Promise(function (resolve: (arg: string) => void, reject: any) {
            try {
                fl.CSIF.evalScript(jsfl, (e: any) => {
                    e == "reject" ? reject() : resolve(e);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static flaDataJsonGet(): Promise {
        return fl.run(`
        var dom=fl.getDocumentDOM();
        if(dom)fl.getDocumentDOM().getDataFromDocument("${fl.SAVE_NAME}");
        `);
    }

    static flaDataUpdate(flaData: any): Promise {
        return fl.run(`
            var dom=fl.getDocumentDOM();
            if(dom)fl.getDocumentDOM().addDataToDocument("${fl.SAVE_NAME}", "string", '${JSON.stringify(flaData)}')
            `)
    }
}