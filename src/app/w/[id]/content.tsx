"use client";

import {
  FacebookLogo,
  LinkedinLogo,
  Spinner,
  SpinnerGap,
  TwitterLogo,
  WhatsappLogo,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { CopyableInput } from "~/app/admin/integrations/content";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export const Content = ({ id }: { id: string }) => {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");

  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const { data: waitlistData, isLoading } = api.waitlist.getWaitlist.useQuery({
    refId: id,
  });
  const { data } = api.waitlist.getReferralInfo.useQuery({
    referralCode: ref,
  });

  const join = api.waitlist.join.useMutation({
    onSuccess: (data) => {
      setRef(data.referralCode);
      setEmail("");
      setJoined(true);
    },
  });

  const validEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  return (
    <>
      {!joined && !isLoading && (
        <div className="absolute left-1/2 top-1/2 z-10 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 bg-card/50 p-4 px-5 backdrop-blur-sm md:scale-125">
          <h1 className="mb-2 text-2xl font-bold">
            Join the waitlist for {waitlistData?.waitlist.name}
          </h1>
          {waitlistData?.waitlist.description && (
            <p>{waitlistData?.waitlist.description}</p>
          )}
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              join.mutate({
                refId: id,
                source: window.location.origin,
                referralCode: referralCode ?? undefined,
                email,
              });
            }}
          >
            <Label className="mb-2">Email</Label>
            <Input
              placeholder="Enter your email address"
              className="mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
            />
            {join.error && (
              <p className="mb-4 text-red-500">
                {join.error.message ?? "Something went wrong"}
              </p>
            )}
            <Button
              className="relative w-full"
              disabled={!validEmail || join.isLoading}
            >
              Submit{" "}
              {join.isLoading && (
                <Spinner
                  className="absolute right-5 top-3 animate-spin"
                  width={16}
                  height={16}
                />
              )}
            </Button>
          </form>
        </div>
      )}

      {joined && (
        <div className="absolute left-1/2 top-1/2 z-10 flex w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col bg-card/50 p-4 px-5 backdrop-blur-sm md:scale-125">
          <h1 className="mb-5 text-3xl font-bold "> You’re on the waitlist!</h1>
          <p className="mb-8 text-xl text-neutral-400">
            Your current position is{" "}
            <span className="font-bold text-white">
              #{(data?.entriesCount ?? 0) + 1}
            </span>
          </p>
          <p className="mb-3 text-xl font-bold">
            Want to cut the line and get early access?
          </p>
          <p className="mb-8 text-neutral-400">
            Refer your friends and move up the list
          </p>
          <CopyableInput
            defaultValue={`https://${waitlistData?.waitlist?.websiteURL}?ref=${ref}`}
          />
          <div className="mt-8 flex gap-5">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURI(
                `I just joined ${data?.entry.waitlist.name}!`,
              )}&url=${encodeURI(
                `${data?.entry.waitlist.websiteURL}?ref=${ref}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 bg-blue-500 px-4 py-2"
            >
              Tweet <TwitterLogo />
            </a>
            {/* <a
              href=""
              className="flex w-fit items-center gap-2 bg-green-500 px-4 py-2"
            >
              Share <WhatsappLogo />
            </a>
            <a
              href=""
              className="flex w-fit items-center gap-2 bg-blue-800 px-4 py-2"
            >
              Share <FacebookLogo />
            </a>
            <a
              href=""
              className="flex w-fit items-center gap-2 bg-blue-700 px-4 py-2"
            >
              Share <LinkedinLogo />
            </a> */}
          </div>
          <p className="mb-8 mt-8 text-neutral-400">
            You have referred
            <span className="font-bold text-white">
              {" "}
              {data?.referrers.length ?? 0} friends
            </span>
          </p>
          <a>
            <Button className="px-4 py-2">
              {" "}
              Back to {data?.entry.waitlist.name}
            </Button>
          </a>
        </div>
      )}
      <div
        id="canvasContainer"
        data-grid="30"
        data-mouse="0.2"
        data-strength="0.21"
        className="fixed left-0 top-0 -z-10 h-full w-full"
      >
        <div className="pointer-events-none invisible absolute h-full w-full">
          <Image
            src="/bg4.webp"
            className="object-cover "
            layout="fill"
            alt="A set of cubes in the background"
          />
        </div>
      </div>

      <Script
        strategy="beforeInteractive"
        src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"
      />
      <Script
        strategy="beforeInteractive"
        src="https://cdn.jsdelivr.net/npm/lil-gui@0.19.1/dist/lil-gui.umd.min.js"
      />
      <Script
        strategy="beforeInteractive"
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
      />

      <Script
        id="app"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
        const GUI = lil.GUI;

        const fragment = \`uniform float time;
        uniform float progress;
        uniform sampler2D uDataTexture;
        uniform sampler2D uTexture;

        uniform vec4 resolution;
        varying vec2 vUv;
        varying vec3 vPosition;
        float PI = 3.141592653589793238;
        void main()	{
          vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
          vec4 color = texture2D(uTexture,newUV);
          vec4 offset = texture2D(uDataTexture,vUv);
          gl_FragColor = vec4(vUv,0.0,1.);
          gl_FragColor = vec4(offset.r,0.,0.,1.);
          gl_FragColor = color;
          gl_FragColor = texture2D(uTexture,newUV - 0.02*offset.rg);
          // gl_FragColor = offset;

        }\`

        const vertex = \`
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform vec2 pixels;
          float PI = 3.141592653589793238;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }\`

        function clamp(number, min, max) {
          return Math.max(min, Math.min(number, max));
        }

        class Sketch {
          constructor(options) {
            this.scene = new THREE.Scene();

            this.container = options.dom;
            this.img = this.container.querySelector('img')
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            this.renderer.setSize(this.width, this.height);
            this.renderer.setClearColor(0xeeeeee, 1);
            this.renderer.physicallyCorrectLights = true;
            this.renderer.outputEncoding = THREE.sRGBEncoding;

            this.container.appendChild(this.renderer.domElement);

            this.camera = new THREE.PerspectiveCamera(
              70,
              window.innerWidth / window.innerHeight,
              0.1,
              100
            );

            var frustumSize = 1;
            var aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.OrthographicCamera(frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000);
            this.camera.position.set(0, 0, 2);

            this.time = 0;

            this.mouse = {
              x: 0,
              y: 0,
              prevX: 0,
              prevY: 0,
              vX: 0,
              vY: 0
            }

            this.isPlaying = true;
            this.settings();
            this.addObjects();
            this.resize();
            this.render();
            this.setupResize();

            this.mouseEvents()

          }

          getValue(val){
            return parseFloat(this.container.getAttribute('data-'+val))
          }


          mouseEvents() {
            window.addEventListener('mousemove', (e) => {
              this.mouse.x = e.clientX / this.width;
              this.mouse.y = e.clientY / this.height;

              this.mouse.vX = this.mouse.x - this.mouse.prevX;
              this.mouse.vY = this.mouse.y - this.mouse.prevY;


              this.mouse.prevX = this.mouse.x
              this.mouse.prevY = this.mouse.y;


              // console.log(this.mouse.vX,'vx')
            })
          }

          settings() {
            let that = this;
            this.settings = {
              grid: this.getValue('grid')||34,
              mouse: this.getValue('mouse')||0.25,
              strength: this.getValue('strength')||1,
              relaxation: this.getValue('relaxation')||0.9,
            };

            // this.gui = new GUI();

            // this.gui.add(this.settings, "grid", 2, 1000, 1).onFinishChange(() => {
            //   this.regenerateGrid()
            // });
            // this.gui.add(this.settings, "mouse", 0, 1, 0.01);
            // this.gui.add(this.settings, "strength", 0, 1, 0.01);
            // this.gui.add(this.settings, "relaxation", 0, 1, 0.01);
          }

          setupResize() {
            window.addEventListener("resize", this.resize.bind(this));
          }

          resize() {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;


            // image cover
            this.imageAspect = 1. / 1.5;
            let a1;
            let a2;
            if (this.height / this.width > this.imageAspect) {
              a1 = (this.width / this.height) * this.imageAspect;
              a2 = 1;
            } else {
              a1 = 1;
              a2 = (this.height / this.width) / this.imageAspect;
            }

            this.material.uniforms.resolution.value.x = this.width;
            this.material.uniforms.resolution.value.y = this.height;
            this.material.uniforms.resolution.value.z = a1;
            this.material.uniforms.resolution.value.w = a2;

            this.camera.updateProjectionMatrix();
            this.regenerateGrid()


          }

          regenerateGrid() {
            this.size = this.settings.grid;

            const width = this.size;
            const height = this.size;

            const size = width * height;
            const data = new Float32Array(3 * size);
            const color = new THREE.Color(0xffffff);

            const r = Math.floor(color.r * 255);
            const g = Math.floor(color.g * 255);
            const b = Math.floor(color.b * 255);

            for (let i = 0; i < size; i++) {
              let r = Math.random() * 255 - 125;
              let r1 = Math.random() * 255 - 125;

              const stride = i * 3;

              data[stride] = r;
              data[stride + 1] = r1;
              data[stride + 2] = r;

            }

            // used the buffer to create a DataTexture
            this.texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat, THREE.FloatType);

            this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;

            if (this.material) {
              this.material.uniforms.uDataTexture.value = this.texture;
              this.material.uniforms.uDataTexture.value.needsUpdate = true;
            }
          }

          addObjects() {
            this.regenerateGrid()
            let texture = new THREE.Texture(this.img)
            texture.needsUpdate = true;
            this.material = new THREE.ShaderMaterial({
              extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
              },
              side: THREE.DoubleSide,
              uniforms: {
                time: {
                  value: 0
                },
                resolution: {
                  value: new THREE.Vector4()
                },
                uTexture: {
                  value: texture
                },
                uDataTexture: {
                  value: this.texture
                },
              },
              vertexShader: vertex,
              fragmentShader: fragment
            });

            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);
          }


          updateDataTexture() {
            let data = this.texture.image.data;
            for (let i = 0; i < data.length; i += 3) {
              data[i] *= this.settings.relaxation
              data[i + 1] *= this.settings.relaxation
            }

            let gridMouseX = this.size * this.mouse.x;
            let gridMouseY = this.size * (1 - this.mouse.y);
            let maxDist = this.size * this.settings.mouse;
            let aspect = this.height / this.width

            for (let i = 0; i < this.size; i++) {
              for (let j = 0; j < this.size; j++) {

                let distance = ((gridMouseX - i) ** 2) / aspect + (gridMouseY - j) ** 2
                let maxDistSq = maxDist ** 2;

                if (distance < maxDistSq) {

                  let index = 3 * (i + this.size * j);

                  let power = maxDist / Math.sqrt(distance);
                  power = clamp(power, 0, 10)
                  // if(distance <this.size/32) power = 1;
                  // power = 1;

                  data[index] += this.settings.strength * 100 * this.mouse.vX * power;
                  data[index + 1] -= this.settings.strength * 100 * this.mouse.vY * power;

                }
              }
            }

            this.mouse.vX *= 0.9;
            this.mouse.vY *= 0.9;
            this.texture.needsUpdate = true
          }


          render() {
            if (!this.isPlaying) return;
            this.time += 0.05;
            this.updateDataTexture()
            this.material.uniforms.time.value = this.time;
            requestAnimationFrame(this.render.bind(this));
            this.renderer.render(this.scene, this.camera);
          }
        }

        new Sketch({
          dom: document.getElementById("canvasContainer")
        });
        `,
        }}
      ></Script>

      <Script
        id="marqueeScript"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
          console.clear();
          /*
        This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

        Features:
         - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
         - When each item animates to the left or right enough, it will loop back to the other side
         - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
         - The returned timeline will have the following methods added to it:
           - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
           - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
           - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
           - current() - returns the current index (if an animation is in-progress, it reflects the final index)
           - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
         */
          function horizontalLoop(items, config) {
            items = gsap.utils.toArray(items);
            config = config || {};
            let tl = gsap.timeline({
                repeat: config.repeat,
                paused: config.paused,
                defaults: { ease: "none" },
                onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
              }),
              length = items.length,
              startX = items[0].offsetLeft,
              times = [],
              widths = [],
              xPercents = [],
              curIndex = 0,
              pixelsPerSecond = (config.speed || 1) * 100,
              snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
              totalWidth,
              curX,
              distanceToStart,
              distanceToLoop,
              item,
              i;
            gsap.set(items, {
              // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
              xPercent: (i, el) => {
                let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
                xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 + gsap.getProperty(el, "xPercent"));
                return xPercents[i];
              },
            });
            gsap.set(items, { x: 0 });
            totalWidth =
              items[length - 1].offsetLeft +
              (xPercents[length - 1] / 100) * widths[length - 1] -
              startX +
              items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
              (parseFloat(config.paddingRight) || 0);
            for (i = 0; i < length; i++) {
              item = items[i];
              curX = (xPercents[i] / 100) * widths[i];
              distanceToStart = item.offsetLeft + curX - startX;
              distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
              tl.to(
                item,
                { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond },
                0
              )
                .fromTo(
                  item,
                  { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
                  {
                    xPercent: xPercents[i],
                    duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                    immediateRender: false,
                  },
                  distanceToLoop / pixelsPerSecond
                )
                .add("label" + i, distanceToStart / pixelsPerSecond);
              times[i] = distanceToStart / pixelsPerSecond;
            }
            function toIndex(index, vars) {
              vars = vars || {};
              Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length); // always go in the shortest direction
              let newIndex = gsap.utils.wrap(0, length, index),
                time = times[newIndex];
              if (time > tl.time() !== index > curIndex) {
                // if we're wrapping the timeline's playhead, make the proper adjustments
                vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
                time += tl.duration() * (index > curIndex ? 1 : -1);
              }
              curIndex = newIndex;
              vars.overwrite = true;
              return tl.tweenTo(time, vars);
            }
            tl.next = (vars) => toIndex(curIndex + 1, vars);
            tl.previous = (vars) => toIndex(curIndex - 1, vars);
            tl.current = () => curIndex;
            tl.toIndex = (index, vars) => toIndex(index, vars);
            tl.times = times;
            tl.progress(1, true).progress(0, true); // pre-render for performance
            if (config.reversed) {
              tl.vars.onReverseComplete();
              tl.reverse();
            }
            return tl;
          }

          function verticalLoop(items, config) {
            items = gsap.utils.toArray(items);
            config = config || {};
            let tl = gsap.timeline({
              repeat: config.repeat,
              paused: config.paused,
              defaults: { ease: "none" },
              onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
            });

            let length = items.length;
            let startY = items[0].offsetTop;
            let times = [];
            let heights = [];
            let yPercents = [];
            let curIndex = 0;
            let pixelsPerSecond = (config.speed || 1) * 100;
            let snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1);
            let totalHeight;
            let curY;
            let distanceToStart;
            let distanceToLoop;
            let item;
            let i;

            gsap.set(items, {
              yPercent: (i, el) => {
                let h = (heights[i] = parseFloat(gsap.getProperty(el, "height", "px")));
                yPercents[i] = snap((parseFloat(gsap.getProperty(el, "y", "px")) / h) * 100 + gsap.getProperty(el, "yPercent"));
                return yPercents[i];
              },
            });
            gsap.set(items, { y: 0 });

            totalHeight =
              items[length - 1].offsetTop +
              (yPercents[length - 1] / 100) * heights[length - 1] -
              startY +
              items[length - 1].offsetHeight * gsap.getProperty(items[length - 1], "scaleY") +
              (parseFloat(config.paddingBottom) || 0);

            for (i = 0; i < length; i++) {
              item = items[i];
              curY = (yPercents[i] / 100) * heights[i];
              distanceToStart = item.offsetTop + curY - startY;
              distanceToLoop = distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");

              tl.to(
                item,
                { yPercent: snap(((curY - distanceToLoop) / heights[i]) * 100), duration: distanceToLoop / pixelsPerSecond },
                0
              )
                .fromTo(
                  item,
                  { yPercent: snap(((curY - distanceToLoop + totalHeight) / heights[i]) * 100) },
                  {
                    yPercent: yPercents[i],
                    duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond,
                    immediateRender: false,
                  },
                  distanceToLoop / pixelsPerSecond
                )
                .add("label" + i, distanceToStart / pixelsPerSecond);

              times[i] = distanceToStart / pixelsPerSecond;
            }

            function toIndex(index, vars) {
              vars = vars || {};
              Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length);
              let newIndex = gsap.utils.wrap(0, length, index);
              let time = times[newIndex];

              if (time > tl.time() !== index > curIndex) {
                vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
                time += tl.duration() * (index > curIndex ? 1 : -1);
              }

              curIndex = newIndex;
              vars.overwrite = true;
              return tl.tweenTo(time, vars);
            }

            tl.next = (vars) => toIndex(curIndex + 1, vars);
            tl.previous = (vars) => toIndex(curIndex - 1, vars);
            tl.current = () => curIndex;
            tl.toIndex = (index, vars) => toIndex(index, vars);
            tl.times = times;
            tl.progress(1, true).progress(0, true);

            if (config.reversed) {
              tl.vars.onReverseComplete();
              tl.reverse();
            }

            return tl;
          }

          const scrollingText = gsap.utils.toArray("#marquee .item");

          const tl = horizontalLoop(scrollingText, {
            repeat: -1,
            reversed: true,
          })

          const marqueeEmails = gsap.utils.toArray("#marqueeEmails .item");

          const tl2 = verticalLoop(marqueeEmails, {
            repeat: -1,
            reversed: true,
          });

          Observer.create({
            onChangeY(self) {
              let factor = 2.5;
              if (self.deltaY < 0) {
                factor *= -1;
              }
              gsap
                .timeline({
                  defaults: {
                    ease: "none",
                  },
                })
                .to(tl, { timeScale: factor * 2.5, duration: 0.2 })
                .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
            },
            onChangeX(self) {
              let factor = 2.5;
              if (self.deltaX < 0) {
                factor *= -1;
              }
              gsap
                .timeline({
                  defaults: {
                    ease: "none",
                  },
                })
                .to(tl2, { timeScale: factor * 2.5, duration: 0.2 })
                .to(tl2, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
              }
          });
          `,
        }}
      ></Script>

      <a
        href="https://www.weitlist.me"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-1/2 h-12 -translate-x-1/2"
      >
        <span className="mb-3 font-sans text-4xl text-neutral-500">
          Powered by
        </span>
        <Logo />
      </a>
    </>
  );
};
