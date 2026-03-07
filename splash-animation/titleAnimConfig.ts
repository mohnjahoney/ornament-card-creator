export const titleAnimConfig = {
    title: {
      letters: ["r", "n", "a", "m", "e", "n", "t", " ", "M", "a", "k", "e", "r"],
    },
  
    ornament: {
      radius: 0.5,
      startPosition: { x: -2.5, y: 0, z: 0 },
      finalPosition: { x: -3.3, y: 0, z: 0 },
      moveEase: "easeInOutQuad",
      spinAxis: "y",
      totalSpins: 7,
      spinEase: "easeOutCubic",
    },
  
    // letters: {
    //   spacing: 0.52,
    //   wordGapExtra: 0.35,
    //   baselineY: 0,
  
    //   spawnOffset: { x: 0.08, y: 0, z: -0.4 },
    //   arcHeight: 0.38,
  
    //   flightDuration: 900,
    //   launchDelay: 90,
    //   sequenceStart: 2600,
  
    //   horizontalEase: "easeInOutQuad",
    //   depthEase: "easeOutCubic",
  
    //   startScale: 0.15,
    //   finalScale: 0.62,
    //   scaleEase: "easeOutBack",
    //   scaleOvershoot: 1.35,
  
    //   fadeInPortion: 0.4,
    // },

    letters: {
        baselineY: 0,
      
        spawnOffset: { x: 0.08, y: 0, z: -0.4 },
        arcHeight: 0.38,
      
        sequenceStart: 2600,
        flightDuration: 900,
        launchDelay: 90,
      
        startScale: 0.15,
        finalScale: 0.62,
      
        scaleEase: "easeOutBack",
        scaleOvershoot: 1.35,
      
        horizontalEase: "easeInOutQuad",
        depthEase: "easeOutCubic",
      
        fadeInPortion: 0.4,
      
        widthScale: 0.0028,   // converts measured canvas px -> world units
        tracking: 0.01,       // extra gap between letters
        wordGapExtra: 0.1,   // extra gap for spaces
      },
  
    textStyle: {
      fontFamily: "Arial",
      fontWeight: "bold",
      fontSizePx: 170,
      color: "#111111",
      canvasSize: 256,
    },
  
    timing: {
      ornamentMoveDuration: 2000,
      ornamentSpinDuration: 2200,
    },
  };