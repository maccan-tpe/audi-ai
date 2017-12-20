'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax*/
app.partial.sphere = function($, container){
	container.on('page:update' , function(page, menu){
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.on('page:load' , function(page, menu){
        container.addClass('loaded');
        try{
            sphere();
        }catch(e){}
	});
	
    var sphere, fnAddEventListener, fnRequestAnimationFrame;
    
      fnRequestAnimationFrame = function(fnCallback) {
          var fnAnimFrame;
          fnAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(fnCallback) {
              window.setTimeOut(fnCallback, 1000 / 60);
          };
          fnAnimFrame(fnCallback);
      };
    
      // Add Event Listener
      fnAddEventListener = function(o, sEvent, fn) {
          if (o.addEventListener) {
              o.addEventListener(sEvent, fn, false);
          } else {
              o['on' + sEvent] = fn;
          }
      };
    
    sphere = function() {
        var Particle, ctxRender, fAngle, fCosAngle, fMaxAX, fMaxAY, fMaxAZ, fPI, fSinAngle, fStartVX, fStartVY, fStartVZ, fVX, fnACos, fnCos, fnMax, fnMin, fnNextFrame, fnRender, fnRnd, fnRnd2, fnSetSize, fnSin, fnSwapList, gui, h, iProjSphereX, iProjSphereY, iRadiusSphere, nBody, oBuffer, oDoc, oRadGrad, oRender, oStats, w;
        // oStats = new Stats();
        // oStats.setMode(0);
        // oStats.domElement.style.position = 'absolute';
        // oStats.domElement.style.left = '0px';
        // oStats.domElement.style.top = '0px';
        // document.body.appendChild(oStats.domElement);
        // General Elements
        oDoc = document;
        nBody = oDoc.body;
        // Shortcuts
        fPI = Math.PI;
        fnMax = Math.max;
        fnMin = Math.min;
        fnRnd = Math.random;
        fnRnd2 = function() {
            return 2.0 * fnRnd() - 1.0;
        };
        fnCos = Math.cos;
        fnACos = Math.acos;
        fnSin = Math.sin;
        // Sphere Settings
        iRadiusSphere = 150;
        iProjSphereX = 0;
        iProjSphereY = 0;
        // Particle Settings
        fMaxAX = 0.1;
        fMaxAY = 0.1;
        fMaxAZ = 0.1;
        fStartVX = 0.001;
        fStartVY = 0.001;
        fStartVZ = 0.001;
        fAngle = 0.0;
        fSinAngle = 0.0;
        fCosAngle = 0.0;
        window.iFramesToRotate = 1400.0;
        window.iPerspective = 175;
        window.iNewParticlePerFrame = 10;
        window.fGrowDuration = 120.0;
        window.fWaitDuration = 2000.0;
        window.fShrinkDuration = 180.0;
        window.aColor = [137, 168, 192];
        fVX = (2.0 * fPI) / window.iFramesToRotate;
        oRadGrad = null;
        ctxRender = nCanvasRender.getContext('2d');
        oRender = {
            pFirst: null
        };
        oBuffer = {
            pFirst: null
        };
        w = h = 0;
        // gets/sets size
        fnSetSize = function() {
            nCanvasRender.width = w = window.innerWidth;
            nCanvasRender.height = h = window.innerHeight;
            iProjSphereX = w / 2;
            iProjSphereY = h / 2;
            return {
            w: w,
            h: h
            };
        };
        fnSetSize();
        
        // window.onresize
        fnAddEventListener(window, 'resize', fnSetSize);
        fnSwapList = function(p, oSrc, oDst) {
            if (p != null) {
            // remove p from oSrc
            if (oSrc.pFirst === p) {
                oSrc.pFirst = p.pNext;
                if (p.pNext != null) {
                p.pNext.pPrev = null;
                }
            } else {
                p.pPrev.pNext = p.pNext;
                if (p.pNext != null) {
                p.pNext.pPrev = p.pPrev;
                }
            }
            } else {
            // create new p
            p = new Particle();
            }
            p.pNext = oDst.pFirst;
            if (oDst.pFirst != null) {
            oDst.pFirst.pPrev = p;
            }
            oDst.pFirst = p;
            p.pPrev = null;
            return p;
        };
        Particle = (function() {
            
            // Particle
            class Particle {
                fnInit() {
                    this.fAngle = fnRnd() * fPI * 2;
                    this.fForce = fnACos(fnRnd2());
                    this.fAlpha = 0;
                    this.bIsDead = false;
                    this.iFramesAlive = 0;
                    this.fX = iRadiusSphere * fnSin(this.fForce) * fnCos(this.fAngle);
                    this.fY = iRadiusSphere * fnSin(this.fForce) * fnSin(this.fAngle);
                    this.fZ = iRadiusSphere * fnCos(this.fForce);
                    this.fVX = fStartVX * this.fX;
                    this.fVY = fStartVY * this.fY;
                    this.fVZ = fStartVZ * this.fZ;
                    this.fGrowDuration = window.fGrowDuration + fnRnd2() * (window.fGrowDuration / 4.0);
                    this.fWaitDuration = window.fWaitDuration + fnRnd2() * (window.fWaitDuration / 4.0);
                    this.fShrinkDuration = window.fShrinkDuration + fnRnd2() * (window.fShrinkDuration / 4.0);
                    this.fAX = 0.0;
                    this.fAY = 0.0;
                    this.fAZ = 0.0;
                }
        
                fnUpdate() {
                    if (this.iFramesAlive > this.fGrowDuration + this.fWaitDuration) {
                    this.fVX += this.fAX + fMaxAX * fnRnd2();
                    this.fVY += this.fAY + fMaxAY * fnRnd2();
                    this.fVZ += this.fAZ + fMaxAZ * fnRnd2();
                    this.fX += this.fVX;
                    this.fY += this.fVY;
                    this.fZ += this.fVZ;
                    }
                    this.fRotX = fCosAngle * this.fX + fSinAngle * this.fZ;
                    this.fRotZ = -fSinAngle * this.fX + fCosAngle * this.fZ;
                    this.fRadiusCurrent = Math.max(0.01, window.iPerspective / (window.iPerspective - this.fRotZ));
                    this.fProjX = this.fRotX * this.fRadiusCurrent + iProjSphereX;
                    this.fProjY = this.fY * this.fRadiusCurrent + iProjSphereY;
                    this.iFramesAlive += 1;
                    if (this.iFramesAlive < this.fGrowDuration) {
                    this.fAlpha = this.iFramesAlive * 1.0 / this.fGrowDuration;
                    } else if (this.iFramesAlive < this.fGrowDuration + this.fWaitDuration) {
                    this.fAlpha = 1.0;
                    } else if (this.iFramesAlive < this.fGrowDuration + this.fWaitDuration + this.fShrinkDuration) {
                    this.fAlpha = (this.fGrowDuration + this.fWaitDuration + this.fShrinkDuration - this.iFramesAlive) * 1.0 / this.fShrinkDuration;
                    } else {
                    this.bIsDead = true;
                    }
                    if (this.bIsDead === true) {
                    fnSwapList(this, oRender, oBuffer);
                    }
                    this.fAlpha *= fnMin(1.0, fnMax(0.5, this.fRotZ / iRadiusSphere));
                    this.fAlpha = fnMin(1.0, fnMax(0.0, this.fAlpha));
                }
    
            };
    
            // Current Position
            Particle.prototype.fX = 0.0;
    
            Particle.prototype.fY = 0.0;
    
            Particle.prototype.fZ = 0.0;
    
            // Current Velocity
            Particle.prototype.fVX = 0.0;
    
            Particle.prototype.fVY = 0.0;
    
            Particle.prototype.fVZ = 0.0;
    
            // Current Acceleration
            Particle.prototype.fAX = 0.0;
    
            Particle.prototype.fAY = 0.0;
    
            Particle.prototype.fAZ = 0.0;
    
            // Projection Position
            Particle.prototype.fProjX = 0.0;
    
            Particle.prototype.fProjY = 0.0;
    
            // Rotation
            Particle.prototype.fRotX = 0.0;
    
            Particle.prototype.fRotZ = 0.0;
    
            // double linked list
            Particle.prototype.pPrev = null;
    
            Particle.prototype.pNext = null;
    
            Particle.prototype.fAngle = 0.0;
    
            Particle.prototype.fForce = 0.0;
    
            Particle.prototype.fGrowDuration = 0.0;
    
            Particle.prototype.fWaitDuration = 0.0;
    
            Particle.prototype.fShrinkDuration = 0.0;
    
            Particle.prototype.fRadiusCurrent = 0.0;
    
            Particle.prototype.iFramesAlive = 0;
    
            Particle.prototype.bIsDead = false;
    
            return Particle;
    
        })();
        fnRender = function() {
            try{
                var iCount, p;
                // ctxRender.fillStyle = "#000";
                // ctxRender.fillRect(0, 0, w, h);
                ctxRender.clearRect(0, 0, nCanvasRender.width, nCanvasRender.height);
                ctxRender.beginPath();
                p = oRender.pFirst;
                iCount = 0;
                while (p != null) {
                    // if (window.CP.shouldStopExecution(1)){break;}
                    ctxRender.fillStyle = "rgba(" + window.aColor.join(',') + ',' + p.fAlpha.toFixed(4) + ")";
                    ctxRender.beginPath();
                    ctxRender.arc(p.fProjX, p.fProjY, p.fRadiusCurrent, 0, 2 * fPI, false);
                    ctxRender.closePath();
                    ctxRender.fill();
                    p = p.pNext;
                    iCount += 1;
                }
                // window.CP.exitedLoop(1);

            }catch(e){}
    
        };
        fnNextFrame = function() {
            var iAddParticle, iCount, p, pNext;
            // oStats.begin();
            fAngle = (fAngle + fVX) % (2.0 * fPI);
            fSinAngle = fnSin(fAngle);
            fCosAngle = fnCos(fAngle);
            iAddParticle = 0;
            iCount = 0;
            while (iAddParticle++ < window.iNewParticlePerFrame) {
                // if (window.CP.shouldStopExecution(2)){
                //     break;
                // }
                p = fnSwapList(oBuffer.pFirst, oBuffer, oRender);
                p.fnInit();
            }
            // window.CP.exitedLoop(2);
    
            p = oRender.pFirst;
            while (p != null) {
                // if (window.CP.shouldStopExecution(3)){
                //     break;
                // }
                pNext = p.pNext;
                p.fnUpdate();
                p = pNext;
                iCount++;
            }
            // window.CP.exitedLoop(3);
    
            fnRender();
            // oStats.end();
            return fnRequestAnimationFrame(function() {
                return fnNextFrame();
            });
        };
        fnNextFrame();
        // gui = new dat.GUI();
        // gui.add(window, 'fGrowDuration').min(10).max(500).step(1);
        // gui.add(window, 'fWaitDuration').min(10).max(500).step(1);
        // gui.add(window, 'fShrinkDuration').min(10).max(500).step(1);
        // gui.add(window, 'iPerspective').min(150).max(1000).step(1);
        // gui.add(window, 'iNewParticlePerFrame').min(1).max(20).step(1);
        // gui.add(window, 'iFramesToRotate').min(50).max(2500).step(50).onChange(function() {
        //     return fVX = (2.0 * fPI) / window.iFramesToRotate;
        // });
        // gui.addColor(window, 'aColor').onChange(function() {
        //     window.aColor[0] = ~~window.aColor[0];
        //     window.aColor[1] = ~~window.aColor[1];
        //     return window.aColor[2] = ~~window.aColor[2];
        // });
        if (window.innerWidth < 1000) {
            // gui.close();
            window.iNewParticlePerFrame = 5;
        }
        window.sphere = this;
    };

        
	
};
