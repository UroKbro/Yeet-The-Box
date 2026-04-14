window.onload = function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const player = {
        x: 100,
        y: 100,
        w: 50,
        h: 50,
        vx: 0,
        vy: 0,
        // movement tuning (tuned for snappy but controlled feel)
        // accel: how quickly player accelerates toward target speed
        accel: 1.6,
        friction: 0.825,
        maxSpeed: 4.5,
        // brake: how quickly player decelerates when stopping (lower = less instant stop)
        brake: 0.35,
        maxFallSpeed: 10,
        jumpPower: 15,
        onGround: false,
        lastJumpTime: 0,
        jumpCooldown: 450, // ms
        // reduces acceleration in air (less control than ground)
        airControl: 0.7,
        // coyote time and input buffering
        coyoteTime: 60, // ms
        lastGrounded: 0,
        jumpBufferTime: 75, // ms
        lastJumpPress: 0
    };
    const gravity = 0.475;
    const world = {
        width: 5000,
        height: 2000
    };

   const platforms = createPlatforms(world);

    const camera = {
        x: 0,
        y: 0
    };

    const keys = {};
    const margin = 150;

    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        // Record jump presses for input buffering
        if (e.key === "ArrowUp") player.lastJumpPress = Date.now();
        // Only prevent default for game control keys so page scrolling still works
        if ((e.key && e.key.startsWith("Arrow")) || e.code === "Space") {
            e.preventDefault();
        }
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
        if ((e.key && e.key.startsWith("Arrow")) || e.code === "Space") {
            e.preventDefault();
        }
    });


    function update(dt) {
        const prevY = player.y;

        // Horizontal input: -1 (left), 0, 1 (right)
        let inputX = 0;
        if (keys["ArrowLeft"]) inputX -= 1;
        if (keys["ArrowRight"]) inputX += 1;

        // ---- Horizontal movement: approach-based, frame-rate aware ----
        // Use dt (seconds) to scale behavior; keep feel consistent across frame rates
        const scale = Math.min(1, (dt || 0.016) * 60);
        const effectiveAccel = player.accel * (player.onGround ? 1 : player.airControl);

        // Target horizontal velocity based on input
        const targetVx = inputX * player.maxSpeed;

        // If changing direction, apply an immediate turn-brake to remove momentum
        if (inputX !== 0 && player.vx !== 0 && Math.sign(inputX) !== Math.sign(player.vx)) {
            const turnBrake = (player.brake || 0.35) * 2.0 * scale;
            if (Math.abs(player.vx) <= turnBrake) player.vx = 0;
            else player.vx -= Math.sign(player.vx) * turnBrake;
        }

        // Move vx toward targetVx using acceleration or braking depending on direction
        if (player.vx < targetVx) {
            // accelerate right
            player.vx = Math.min(player.vx + effectiveAccel * scale, targetVx);
        } else if (player.vx > targetVx) {
            // decelerate/accelerate left
            const decel = (inputX === 0) ? (player.brake || 0.35) : effectiveAccel;
            if (player.vx - decel * scale < targetVx) player.vx = targetVx;
            else player.vx -= decel * scale;
        }

        // Gentle air damping when airborne and no input
        if (!player.onGround && inputX === 0) player.vx *= 0.992;

        // Clamp horizontal speed
        player.vx = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.vx));

        // Jump with coyote time and input buffering
        const now = Date.now();
        const jumpPressedRecently = (player.lastJumpPress && now - player.lastJumpPress <= player.jumpBufferTime) || keys["ArrowUp"];
        if (jumpPressedRecently && (player.onGround || now - player.lastGrounded <= player.coyoteTime) && now - player.lastJumpTime >= player.jumpCooldown) {
            player.vy = -player.jumpPower;
            player.onGround = false;
            player.lastJumpTime = now;
            player.lastJumpPress = 0;
        }

        // Gravity and vertical clamp
        player.vy += gravity;
        player.vy = Math.min(player.vy, player.maxFallSpeed);

        // ---- Move X and handle horizontal collisions ----
        player.x += player.vx;

        for (let p of platforms) {
            if (
                player.x < p.x + p.w &&
                player.x + player.w > p.x &&
                player.y < p.y + p.h &&
                player.y + player.h > p.y
            ) {
                // Horizontal overlap: push out on X and stop horizontal velocity
                if (player.vx > 0) {
                    player.x = p.x - player.w;
                } else if (player.vx < 0) {
                    player.x = p.x + p.w;
                }
                player.vx = 0;
            }
        }

        // ---- Move Y and handle vertical collisions ----
        player.y += player.vy;

        // Reset onGround; will be set if we land this frame
        player.onGround = false;

        for (let p of platforms) {
            if (
                player.x < p.x + p.w &&
                player.x + player.w > p.x &&
                player.y < p.y + p.h &&
                player.y + player.h > p.y
            ) {
                if (player.vy > 0) {
                    // Only land if we were above the platform before moving
                    if (prevY + player.h <= p.y) {
                        player.y = p.y - player.h;
                        player.vy = 0;
                        player.onGround = true;
                        player.lastGrounded = Date.now();
                    } else {
                        // fallback resolution
                        player.y = p.y - player.h;
                        player.vy = 0;
                    }
                } else if (player.vy < 0) {
                    player.y = p.y + p.h;
                    player.vy = 0;
                }
            }
        }
        let screenX = player.x - camera.x;
        let screenY = player.y - camera.y;

        // moving right
        if (screenX > canvas.width - margin) {
            camera.x = player.x - (canvas.width - margin);
        }

        // moving left
        if (screenX < margin) {
            camera.x = player.x - margin;
        }

        //moving down
        if (screenY > canvas.height - margin) {
            camera.y = player.y - (canvas.height - margin);
        }

        // moving up
        if (screenY < margin) {
            camera.y = player.y - margin;
        }
        camera.x = Math.max(0, Math.min(world.width - canvas.width, camera.x));
        camera.y = Math.max(0, Math.min(world.height - canvas.height, camera.y));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x - camera.x, player.y - camera.y, player.w, player.h);

        // platforms
        ctx.fillStyle = "green";
        for (let p of platforms) {
            ctx.fillRect(p.x - camera.x, p.y - camera.y, p.w, p.h);
        }
    }

    // frame-timed loop so movement is consistent across different refresh rates
    let lastTime = 0;
    function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min(0.05, (timestamp - lastTime) / 1000); // clamp to avoid large steps
        lastTime = timestamp;
        update(dt);
        draw();
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
};