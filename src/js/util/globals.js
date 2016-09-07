var D = document,
    w = window,
    delayed = setTimeout,
    shittyMode, // undefined by default
    C, // canvas
    R, // canvas context
    W, // world
    P, // player
    V, // camera
    PI = Math.PI,
    mobile = navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo|windows ph/i)),
    CANVAS_WIDTH = mobile ? 640 : 920,
    CANVAS_HEIGHT = 920;
