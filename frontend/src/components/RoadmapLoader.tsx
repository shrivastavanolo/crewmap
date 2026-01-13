import { useEffect, useRef, useState } from "react";

const WIDTH = 240;
const HEIGHT = 180;
const PLAYER_SIZE = 12;
const BLOCK_SIZE = 10;

type Block = {
    x: number;
    y: number;
};

export default function RoadmapLoader() {
    const [playerX, setPlayerX] = useState(WIDTH / 2 - PLAYER_SIZE / 2);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const gameRef = useRef<HTMLDivElement | null>(null);

    const resetGame = () => {
        setPlayerX(WIDTH / 2 - PLAYER_SIZE / 2);
        setBlocks([]);
        setScore(0);
        setGameOver(false);
    };

    /* Keyboard controls */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Restart on Enter if game over
            if (gameOver && e.key === "Enter") {
                resetGame();
                return;
            }

            if (gameOver) return;

            if (e.key === "ArrowLeft" || e.key === "a") {
                setPlayerX((x) => Math.max(0, x - 16));
            }
            if (e.key === "ArrowRight" || e.key === "d") {
                setPlayerX((x) =>
                    Math.min(WIDTH - PLAYER_SIZE, x + 16)
                );
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [gameOver]);

    /* Game loop */
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setScore((s) => s + 1);

            setBlocks((prev) => {
                const moved = prev
                    .map((b) => ({ ...b, y: b.y + 8 }))
                    .filter((b) => b.y < HEIGHT);

                // spawn new block
                if (Math.random() > 0.6) {
                    moved.push({
                        x: Math.floor(Math.random() * (WIDTH - BLOCK_SIZE)),
                        y: -BLOCK_SIZE,
                    });
                }

                return moved;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [gameOver]);

    /* Collision detection */
    useEffect(() => {
        blocks.forEach((b) => {
            const hitX =
                b.x < playerX + PLAYER_SIZE && b.x + BLOCK_SIZE > playerX;
            const hitY =
                b.y + BLOCK_SIZE > HEIGHT - PLAYER_SIZE - 8 &&
                b.y < HEIGHT - 8;

            if (hitX && hitY) {
                setGameOver(true);
            }
        });
    }, [blocks, playerX]);

    useEffect(() => {
        if (gameRef.current) {
            gameRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 select-none">
            <p className="text-zinc-400 text-xs">
                Generating roadmap… stay alive 👾
            </p>

            {/* Game container */}
            <div
                ref={gameRef}
                className="relative bg-black border border-zinc-800 rounded-md"
                style={{ width: WIDTH, height: HEIGHT }}
            >
                {/* Player */}
                <div
                    className="absolute bg-yellow-500"
                    style={{
                        width: PLAYER_SIZE,
                        height: PLAYER_SIZE,
                        left: playerX,
                        bottom: 8,
                    }}
                />

                {/* Falling blocks */}
                {blocks.map((b, i) => (
                    <div
                        key={i}
                        className="absolute bg-zinc-500"
                        style={{
                            width: BLOCK_SIZE,
                            height: BLOCK_SIZE,
                            left: b.x,
                            top: b.y,
                        }}
                    />
                ))}

                {/* Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-zinc-300 text-xs">
                        <p>Game Over 👾</p>
                        <p className="text-zinc-500">Press Enter to restart</p>
                    </div>
                )}
            </div>

            {/* Score = fake progress */}
            <p className="text-zinc-500 text-xs">
                Progress score: {score}
            </p>

            <p className="text-zinc-600 text-[10px]">
                Move with ← → or A / D
            </p>
        </div>
    );
}
