// ============================================================
// pose.js  –  Real-time MediaPipe Pose Estimation
// HarshTrains · Mobile-first
// ============================================================

const LM = {
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW:    13, RIGHT_ELBOW:    14,
  LEFT_WRIST:    15, RIGHT_WRIST:    16,
  LEFT_HIP:      23, RIGHT_HIP:      24,
  LEFT_KNEE:     25, RIGHT_KNEE:     26,
  LEFT_ANKLE:    27, RIGHT_ANKLE:    28,
};

const EXERCISE_CONFIGS = {
  squat: {
    label: "Squats", icon: "🏋️",
    joints:       ["LEFT_HIP",      "LEFT_KNEE",  "LEFT_ANKLE"],
    mirrorJoints: ["RIGHT_HIP",     "RIGHT_KNEE", "RIGHT_ANKLE"],
    downAngle: 90, upAngle: 160, repOn: "down_to_up",
    cues: { down: "Great depth! Drive up ↑", up: "Lower until knee < 90°", mid: "Keep going — lower!" },
  },
  pushup: {
    label: "Push-Ups", icon: "💪",
    joints:       ["LEFT_SHOULDER",  "LEFT_ELBOW",  "LEFT_WRIST"],
    mirrorJoints: ["RIGHT_SHOULDER", "RIGHT_ELBOW", "RIGHT_WRIST"],
    downAngle: 90, upAngle: 160, repOn: "down_to_up",
    cues: { down: "Push back up! 💥", up: "Lower chest to floor", mid: "Elbows to 90° — lower!" },
  },
  curl: {
    label: "Curls", icon: "🦾",
    joints:       ["RIGHT_SHOULDER", "RIGHT_ELBOW", "RIGHT_WRIST"],
    mirrorJoints: null,
    downAngle: 160, upAngle: 40, repOn: "up_to_down",
    cues: { down: "Curl it up! 💪", up: "Squeeze at top!", mid: "Keep curling!" },
  },
  lunge: {
    label: "Lunges", icon: "🦵",
    joints:       ["LEFT_HIP", "LEFT_KNEE", "LEFT_ANKLE"],
    mirrorJoints: null,
    downAngle: 90, upAngle: 160, repOn: "down_to_up",
    cues: { down: "Nice depth! Rise up ↑", up: "Step & drop knee to 90°", mid: "Lower your back knee!" },
  },
};

function angle3(a, b, c) {
  const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let deg = Math.abs((rad * 180) / Math.PI);
  return deg > 180 ? 360 - deg : deg;
}

// ─────────────────────────────────────────────────────────────
class PoseTracker {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("PoseTracker: #" + containerId + " not found");
      return;
    }
    this.exercise   = "squat";
    this.reps       = 0;
    this.stage      = "up";
    this.running    = false;
    this._fpsFrames = 0;
    this._fpsLast   = Date.now();
    this._stream    = null;
    this._rafId     = null;
    this._pose      = null;

    this._buildUI();
    // Wait for MediaPipe AFTER UI is in the DOM
    requestAnimationFrame(() => this._waitForMediaPipe());
  }

  // ── Wait for MediaPipe ──────────────────────────────────────
  _waitForMediaPipe() {
    this._setStatus("Loading AI model…", false);
    const check = () => {
      if (window.Pose) {
        this._setStatus("Ready! Tap Start 🚀", true);
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  }

  // ── Build mobile UI ─────────────────────────────────────────
  _buildUI() {
    this.container.innerHTML = "";
    this.container.style.cssText = "width:100%;box-sizing:border-box;";

    // ── 1. EXERCISE SELECTOR (horizontal scroll) ──────────────
    const exScroll = document.createElement("div");
    exScroll.style.cssText = `
      display:flex;gap:8px;overflow-x:auto;
      padding:4px 0 10px;margin-bottom:12px;
      -webkit-overflow-scrolling:touch;scrollbar-width:none;
    `;

    Object.entries(EXERCISE_CONFIGS).forEach(([id, cfg]) => {
      const btn = document.createElement("button");
      btn.style.cssText = `
        display:flex;align-items:center;gap:6px;padding:10px 16px;
        background:#1a1a2e;border:1.5px solid #2a2a3e;border-radius:12px;
        color:#888;cursor:pointer;font-size:14px;font-weight:600;
        white-space:nowrap;flex-shrink:0;font-family:inherit;
        -webkit-tap-highlight-color:transparent;transition:all 0.2s;
      `;
      btn.textContent = cfg.icon + " " + cfg.label;
      btn.dataset.ex  = id;
      btn.addEventListener("click", () => this._setExercise(id));
      exScroll.appendChild(btn);
    });
    this.container.appendChild(exScroll);
    this._exBar = exScroll;

    // ── 2. CAMERA AREA ────────────────────────────────────────
    // Portrait 3:4 ratio — fits a standing person on mobile perfectly
    const camWrap = document.createElement("div");
    camWrap.style.cssText = `
      position:relative;width:100%;border-radius:20px;
      overflow:hidden;background:#000;aspect-ratio:3/4;
      margin-bottom:12px;border:1px solid #2a2a3e;
    `;

    // Video: visible, CSS-mirrored, behind canvas
    this._video = document.createElement("video");
    this._video.playsInline = true;
    this._video.muted       = true;
    this._video.autoplay    = true;
    this._video.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
      object-fit:cover;transform:scaleX(-1);
    `;

    // Canvas: transparent overlay for skeleton
    this._canvas = document.createElement("canvas");
    this._canvas.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
    `;

    // Live stats — top-left overlay on camera
    this._liveStats = document.createElement("div");
    this._liveStats.style.cssText = `
      position:absolute;top:12px;left:12px;
      display:none;flex-direction:column;gap:8px;z-index:20;
    `;
    this._liveStats.innerHTML = `
      <div style="background:rgba(10,10,20,0.8);backdrop-filter:blur(8px);
        border:1px solid #6c5ce755;border-radius:14px;padding:8px 16px;text-align:center;min-width:76px;">
        <div style="font-size:9px;letter-spacing:2px;color:#6c5ce7;font-weight:700;margin-bottom:2px;">REPS</div>
        <div id="pt-reps" style="font-size:42px;font-weight:900;line-height:1;
          background:linear-gradient(135deg,#6c5ce7,#a29bfe);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;">0</div>
      </div>
      <div style="background:rgba(10,10,20,0.8);backdrop-filter:blur(8px);
        border:1px solid #6c5ce733;border-radius:14px;padding:7px 12px;text-align:center;min-width:76px;">
        <div style="font-size:9px;letter-spacing:2px;color:#4b5563;font-weight:700;margin-bottom:2px;">ANGLE</div>
        <div id="pt-angle" style="font-size:20px;font-weight:800;color:#a29bfe;">—°</div>
        <div style="margin-top:5px;background:#1e293b;border-radius:4px;height:4px;overflow:hidden;">
          <div id="pt-gauge" style="height:100%;width:0%;background:linear-gradient(90deg,#6c5ce7,#a29bfe);transition:width 0.15s;"></div>
        </div>
      </div>
    `;

    // Stage badge — top-right of camera
    this._stageBadge = document.createElement("div");
    this._stageBadge.style.cssText = `
      position:absolute;top:12px;right:12px;
      background:rgba(10,10,20,0.8);backdrop-filter:blur(8px);
      border:1px solid #6c5ce733;border-radius:12px;
      padding:6px 12px;text-align:center;display:none;z-index:20;
    `;
    this._stageBadge.innerHTML = `
      <div style="font-size:9px;letter-spacing:2px;color:#4b5563;font-weight:700;margin-bottom:2px;">STAGE</div>
      <div id="pt-stage" style="font-size:16px;font-weight:800;text-transform:uppercase;color:#a29bfe;">—</div>
    `;

    // Coach feedback bar — bottom of camera
    this._coachBar = document.createElement("div");
    this._coachBar.style.cssText = `
      position:absolute;bottom:0;left:0;right:0;
      background:linear-gradient(to top,rgba(10,10,20,0.95) 0%,transparent 100%);
      padding:24px 16px 14px;display:none;z-index:20;
    `;
    this._coachBar.innerHTML = `
      <div style="font-size:9px;letter-spacing:2px;color:#6c5ce7;font-weight:700;margin-bottom:4px;">COACH</div>
      <div id="pt-feedback" style="font-size:15px;font-weight:700;color:#fff;line-height:1.3;">
        Get into position!
      </div>
    `;

    // FPS badge — bottom-right
    this._fpsBadge = document.createElement("div");
    this._fpsBadge.style.cssText = `
      position:absolute;bottom:12px;right:12px;
      background:rgba(0,0,0,0.55);color:#6c5ce7;
      font-size:10px;font-weight:700;padding:3px 8px;
      border-radius:20px;display:none;z-index:20;
    `;

    // Start overlay — shown before camera starts
    this._overlay = document.createElement("div");
    this._overlay.style.cssText = `
      position:absolute;inset:0;background:rgba(10,10,15,0.92);
      display:flex;align-items:center;justify-content:center;
      z-index:30;border-radius:20px;
    `;
    this._overlay.innerHTML = `
      <div style="text-align:center;padding:24px;width:100%;">
        <div style="font-size:56px;margin-bottom:14px;">📷</div>
        <p id="pt-status" style="color:#888;font-size:14px;margin:0 0 20px;line-height:1.5;">
          Loading AI model…
        </p>
        <button id="pt-startBtn" disabled style="
          display:block;width:80%;margin:0 auto;
          padding:16px;background:linear-gradient(135deg,#6c5ce7,#a29bfe);
          border:none;border-radius:14px;color:#fff;
          font-weight:800;font-size:16px;cursor:pointer;
          opacity:0.5;transition:opacity 0.3s;font-family:inherit;
          -webkit-tap-highlight-color:transparent;
        ">▶ Start Camera</button>
      </div>
    `;

    camWrap.appendChild(this._video);
    camWrap.appendChild(this._canvas);
    camWrap.appendChild(this._liveStats);
    camWrap.appendChild(this._stageBadge);
    camWrap.appendChild(this._coachBar);
    camWrap.appendChild(this._fpsBadge);
    camWrap.appendChild(this._overlay);
    this.container.appendChild(camWrap);

    // ── 3. STOP + RESET BUTTONS ───────────────────────────────
    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:10px;margin-bottom:12px;";

    this._stopBtn = document.createElement("button");
    this._stopBtn.style.cssText = `
      flex:1;padding:14px;background:rgba(239,68,68,0.12);
      border:1.5px solid #ef4444;border-radius:14px;
      color:#ef4444;font-weight:700;font-size:15px;
      cursor:pointer;display:none;font-family:inherit;
      -webkit-tap-highlight-color:transparent;
    `;
    this._stopBtn.textContent = "⏹  Stop";
    this._stopBtn.addEventListener("click", () => this.stop());

    const resetBtn = document.createElement("button");
    resetBtn.style.cssText = `
      flex:1;padding:14px;background:#16161f;
      border:1.5px solid #2a2a3e;border-radius:14px;
      color:#888;font-weight:600;font-size:15px;
      cursor:pointer;font-family:inherit;
      -webkit-tap-highlight-color:transparent;
    `;
    resetBtn.textContent = "🔄  Reset";
    resetBtn.addEventListener("click", () => this._resetReps());

    btnRow.appendChild(this._stopBtn);
    btnRow.appendChild(resetBtn);
    this.container.appendChild(btnRow);

    // ── 4. HOW-TO HINT ────────────────────────────────────────
    this._howToEl = document.createElement("div");
    this._howToEl.style.cssText = `
      background:#12121a;border:1px solid #1e1e2a;
      border-radius:14px;padding:14px 16px;
      font-size:13px;color:#4b5563;line-height:1.6;
    `;
    this.container.appendChild(this._howToEl);

    // ── Wire the start button AFTER it's in the DOM ───────────
    this._startBtn = document.getElementById("pt-startBtn");
    this._startBtn.addEventListener("click", () => this.start());

    // ── DOM refs ──────────────────────────────────────────────
    this._repsEl     = document.getElementById("pt-reps");
    this._stageEl    = document.getElementById("pt-stage");
    this._feedbackEl = document.getElementById("pt-feedback");
    this._angleEl    = document.getElementById("pt-angle");
    this._gaugeEl    = document.getElementById("pt-gauge");

    this._setExercise(this.exercise);
  }

  // ── Helpers ──────────────────────────────────────────────────
  _setStatus(msg, enableBtn) {
    const el = document.getElementById("pt-status");
    if (el) el.textContent = msg;
    if (this._startBtn) {
      this._startBtn.disabled    = !enableBtn;
      this._startBtn.style.opacity = enableBtn ? "1" : "0.5";
      this._startBtn.style.cursor  = enableBtn ? "pointer" : "default";
    }
  }

  _setExercise(id) {
    this.exercise = id;
    this._resetReps();
    this._exBar.querySelectorAll("button").forEach(btn => {
      const on = btn.dataset.ex === id;
      btn.style.background  = on ? "linear-gradient(135deg,#2d1f6e,#1a1535)" : "#1a1a2e";
      btn.style.borderColor = on ? "#6c5ce7" : "#2a2a3e";
      btn.style.color       = on ? "#a29bfe" : "#888";
      btn.style.boxShadow   = on ? "0 0 14px #6c5ce744" : "none";
    });
    const tips = {
      squat:  "📐 Stand sideways. Squat until knee angle < 90°, then stand = 1 rep.",
      pushup: "📐 Plank sideways. Lower until elbows < 90°, then push up = 1 rep.",
      curl:   "📐 Face camera. Curl right arm to < 40°, then extend = 1 rep.",
      lunge:  "📐 Stand sideways. Drop front knee to 90°, then return = 1 rep.",
    };
    if (this._howToEl) this._howToEl.textContent = tips[id] || "";
  }

  _resetReps() {
    this.reps  = 0;
    this.stage = "up";
    if (this._repsEl)     this._repsEl.textContent     = "0";
    if (this._stageEl)    this._stageEl.textContent    = "—";
    if (this._feedbackEl) this._feedbackEl.textContent = "Get into position!";
  }

  // ── Start camera ─────────────────────────────────────────────
  async start() {
    if (!window.Pose) {
      this._setStatus("MediaPipe not ready. Check internet & reload.", false);
      return;
    }
    this._setStatus("Opening camera…", false);

    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 640 } },
        audio: false,
      });
      this._video.srcObject = this._stream;
      await new Promise(res => {
        this._video.onloadedmetadata = res;
        setTimeout(res, 3000); // fallback
      });
      await this._video.play();

      // Sync canvas to real video size
      this._canvas.width  = this._video.videoWidth  || 480;
      this._canvas.height = this._video.videoHeight || 640;

    } catch (err) {
      console.error("Camera error:", err);
      this._setStatus("Camera blocked — tap Allow when asked, then retry.", false);
      this._startBtn.disabled    = false;
      this._startBtn.style.opacity = "1";
      return;
    }

    // Show live UI
    this._overlay.style.display      = "none";
    this._liveStats.style.display    = "flex";
    this._stageBadge.style.display   = "block";
    this._coachBar.style.display     = "block";
    this._fpsBadge.style.display     = "block";
    this._stopBtn.style.display      = "block";
    this.running = true;

    // Init MediaPipe Pose
    this._pose = new window.Pose({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
    });
    this._pose.setOptions({
      modelComplexity:        1,
      smoothLandmarks:        true,
      enableSegmentation:     false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence:  0.6,
    });
    this._pose.onResults(r => this._onResults(r));

    // Frame loop using requestAnimationFrame
    const loop = async () => {
      if (!this.running) return;
      if (this._video.readyState >= 2) {
        try { await this._pose.send({ image: this._video }); } catch (_) {}
      }
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  // ── Stop ─────────────────────────────────────────────────────
  stop() {
    this.running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);

    // Stop all camera tracks
    if (this._stream) {
      this._stream.getTracks().forEach(t => t.stop());
      this._stream = null;
    }
    this._pose?.close();
    this._video.srcObject = null;

    // Clear canvas
    const ctx = this._canvas.getContext("2d");
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Show start overlay again
    this._overlay.style.display    = "flex";
    this._liveStats.style.display  = "none";
    this._stageBadge.style.display = "none";
    this._coachBar.style.display   = "none";
    this._fpsBadge.style.display   = "none";
    this._stopBtn.style.display    = "none";

    this._setStatus("Session done 👊 Tap Start again", true);
  }

  // ── Results callback ─────────────────────────────────────────
  _onResults(results) {
    if (!this.running) return;

    const ctx = this._canvas.getContext("2d");
    const W   = this._canvas.width;
    const H   = this._canvas.height;

    // FPS counter
    this._fpsFrames++;
    const now = Date.now();
    if (now - this._fpsLast >= 1000) {
      this._fpsBadge.textContent = this._fpsFrames + " FPS";
      this._fpsFrames = 0;
      this._fpsLast   = now;
    }

    ctx.clearRect(0, 0, W, H);
    if (!results.poseLandmarks) return;

    // Mirror landmarks to match CSS-mirrored video feed
    const mlm = results.poseLandmarks.map(p => ({ ...p, x: 1 - p.x }));

    // Draw skeleton
    if (window.POSE_CONNECTIONS && window.drawConnectors) {
      window.drawConnectors(ctx, mlm, window.POSE_CONNECTIONS, {
        color: "rgba(108,92,231,0.75)", lineWidth: 3,
      });
      window.drawLandmarks(ctx, mlm, {
        color: "#a29bfe", lineWidth: 1, radius: 5,
      });
    }

    this._analyze(mlm, ctx, W, H);
  }

  // ── Exercise analysis ─────────────────────────────────────────
  _analyze(lm, ctx, W, H) {
    const cfg = EXERCISE_CONFIGS[this.exercise];
    if (!cfg) return;

    const [ai, bi, ci] = cfg.joints.map(k => LM[k]);
    let ang = angle3(lm[ai], lm[bi], lm[ci]);

    if (cfg.mirrorJoints) {
      const [mai, mbi, mci] = cfg.mirrorJoints.map(k => LM[k]);
      ang = (ang + angle3(lm[mai], lm[mbi], lm[mci])) / 2;
    }

    // Draw angle label at joint on canvas
    const bx = lm[bi].x * W;
    const by = lm[bi].y * H;
    this._drawLabel(ctx, bx, by, ang);

    // Coloured ring at joint
    const jColor = ang < 90 ? "#22c55e" : ang < 130 ? "#f97316" : "#ef4444";
    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, 20, 0, Math.PI * 2);
    ctx.strokeStyle = jColor + "99";
    ctx.lineWidth   = 3;
    ctx.stroke();
    ctx.restore();

    // Update angle gauge
    if (this._gaugeEl) this._gaugeEl.style.width = Math.min(100, (ang / 180) * 100) + "%";
    if (this._angleEl) this._angleEl.textContent  = Math.round(ang) + "°";

    // Rep logic
    const prev = this.stage;
    let next     = prev;
    let feedback = "";
    const { downAngle, upAngle, repOn, cues } = cfg;

    if      (ang < downAngle) { next = "down"; feedback = cues.down; }
    else if (ang > upAngle)   { next = "up";   feedback = cues.up;   }
    else                      {                 feedback = cues.mid;  }

    if (prev !== next) {
      this.stage = next;
      if (this._stageEl) this._stageEl.textContent = next;

      const counted =
        (repOn === "down_to_up" && prev === "down" && next === "up") ||
        (repOn === "up_to_down" && prev === "up"   && next === "down");

      if (counted) {
        this.reps++;
        if (this._repsEl) {
          this._repsEl.textContent = this.reps;
          this._popRep();
        }
        if (navigator.vibrate) navigator.vibrate([20]);
      }
    }

    if (feedback && this._feedbackEl) this._feedbackEl.textContent = feedback;
  }

  _drawLabel(ctx, x, y, ang) {
    const txt = Math.round(ang) + "°";
    ctx.save();
    ctx.font = "bold 14px monospace";
    const tw = ctx.measureText(txt).width;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x + 10, y - 12, tw + 12, 20, 5);
    else ctx.rect(x + 10, y - 12, tw + 12, 20);
    ctx.fill();
    ctx.fillStyle = "#a29bfe";
    ctx.fillText(txt, x + 16, y + 3);
    ctx.restore();
  }

  _popRep() {
    if (!this._repsEl) return;
    this._repsEl.style.transition = "transform 0.1s";
    this._repsEl.style.transform  = "scale(1.5)";
    setTimeout(() => { this._repsEl.style.transform = "scale(1)"; }, 180);
  }
}

// Initialised lazily by App.openPoseTrainer() in app.js
window.PoseTracker = PoseTracker;