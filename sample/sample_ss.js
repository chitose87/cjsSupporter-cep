(function (cjs, an) {

    var p; // shortcut to reference prototypes
    var lib = {};
    var ss = {};
    var img = {};
    lib.ssMetadata = [
        {name: "sample_01_atlas_", frames: [[0, 0, 191, 191], [0, 352, 121, 121], [0, 193, 181, 157]]}
    ];


// symbols:


    (lib.circle = function () {
        this.spriteSheet = ss["sample_01_atlas_"];
        this.gotoAndStop(0);
    }).prototype = p = new cjs.Sprite();


    (lib.rect = function () {
        this.spriteSheet = ss["sample_01_atlas_"];
        this.gotoAndStop(1);
    }).prototype = p = new cjs.Sprite();


    (lib.triangle = function () {
        this.spriteSheet = ss["sample_01_atlas_"];
        this.gotoAndStop(2);
    }).prototype = p = new cjs.Sprite();


// stage content:
    (lib.sample_01 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // レイヤー_1
        this.instance = new lib.circle();
        this.instance.parent = this;
        this.instance.setTransform(83, 198);

        this.instance_1 = new lib.triangle();
        this.instance_1.parent = this;
        this.instance_1.setTransform(282, 72);

        this.instance_2 = new lib.rect();
        this.instance_2.parent = this;
        this.instance_2.setTransform(74, 32);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.instance_2}, {t: this.instance_1}, {t: this.instance}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(349, 232, 389, 357);
// library properties:
    lib.properties = {
        id: '56148CE10DB86049A5424705223DAA33',
        width: 550,
        height: 400,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        manifest: [
            {src: "images/sample_01_atlas_.png?1519383889395", id: "sample_01_atlas_"}
        ],
        preloads: []
    };


// bootstrap callback support:

    (lib.Stage = function (canvas) {
        createjs.Stage.call(this, canvas);
    }).prototype = p = new createjs.Stage();

    p.setAutoPlay = function (autoPlay) {
        this.tickEnabled = autoPlay;
    }
    p.play = function () {
        this.tickEnabled = true;
        this.getChildAt(0).gotoAndPlay(this.getTimelinePosition())
    }
    p.stop = function (ms) {
        if (ms) this.seek(ms);
        this.tickEnabled = false;
    }
    p.seek = function (ms) {
        this.tickEnabled = true;
        this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000);
    }
    p.getDuration = function () {
        return this.getChildAt(0).totalFrames / lib.properties.fps * 1000;
    }

    p.getTimelinePosition = function () {
        return this.getChildAt(0).currentFrame / lib.properties.fps * 1000;
    }

    an.bootcompsLoaded = an.bootcompsLoaded || [];
    if (!an.bootstrapListeners) {
        an.bootstrapListeners = [];
    }

    an.bootstrapCallback = function (fnCallback) {
        an.bootstrapListeners.push(fnCallback);
        if (an.bootcompsLoaded.length > 0) {
            for (var i = 0; i < an.bootcompsLoaded.length; ++i) {
                fnCallback(an.bootcompsLoaded[i]);
            }
        }
    };

    an.compositions = an.compositions || {};
    an.compositions['56148CE10DB86049A5424705223DAA33'] = {
        getStage: function () {
            return exportRoot.getStage();
        },
        getLibrary: function () {
            return lib;
        },
        getSpriteSheet: function () {
            return ss;
        },
        getImages: function () {
            return img;
        }
    };

    an.compositionLoaded = function (id) {
        an.bootcompsLoaded.push(id);
        for (var j = 0; j < an.bootstrapListeners.length; j++) {
            an.bootstrapListeners[j](id);
        }
    }

    an.getComposition = function (id) {
        return an.compositions[id];
    }


})(createjs = createjs || {}, AdobeAn = AdobeAn || {});
var createjs, AdobeAn;