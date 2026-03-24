"use client";

import { motion } from "motion/react";
import {
	Cpu,
	Users,
	Copy,
	UserPlus,
	ArrowLeft,
} from "lucide-react";
import { useState } from "react";

interface RivalSelectionProps {
	onBack: () => void;
	onSelectOpponent: (opponent: any) => void;
}

export const RivalSelection = ({ onBack, onSelectOpponent }: RivalSelectionProps) => {
	const [difficulty, setDifficulty] = useState(1);
	const [isLoadingFriend, setIsLoadingFriend] = useState(false);

	const handlePlayEngine = () => {
		onSelectOpponent({
			name: `Stockfish Level ${difficulty}`,
			elo: 800 + difficulty * 300,
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Yuk1r1sNMujX10nUWzb9aTyK9cNGPQBHd94XPVRVKiIzVtGFeRkKt8gIu6UOqmuZ5ORFfFhybMazTE8AwAsuembORvO2qRFXE7-0zOQaraA1Z0ivyMztoC-XGQcNdphST7soMvRCaQPDFddZQkB_Jg4ih18ZkcRal1VAyWOjgWm-bsENZvW6aaGMXNFvbN0w3Fx6ghyUHnoDwCHsXSOOkN4Xjax0RB-yzLCaiDQi4Eh1J7TAYHvboeTLfC_-XebmJl5XBFwfNawl",
			isBot: true,
		});
	};

	const handlePlayFriend = async () => {
		setIsLoadingFriend(true);
		try {
			const res = await fetch("http://localhost:8080/api/games", { method: "POST" });
			const data = await res.json();
			if (data.gameId) {
				window.location.href = `/join/${data.gameId}`;
			}
		} catch (e) {
			console.error(e);
			alert("Failed to connect to backend server");
		} finally {
			setIsLoadingFriend(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen pt-16 pb-24 px-6 md:px-12 flex flex-col items-center max-w-7xl mx-auto"
		>
			<div className="w-full flex justify-start mb-8">
				<button
					onClick={onBack}
					className="flex items-center space-x-2 text-slate-500 hover:text-chess-dark transition-colors font-semibold"
				>
					<ArrowLeft className="w-5 h-5" />
					<span>Back to Home</span>
				</button>
			</div>

			<div className="max-w-4xl w-full">
				<header className="mb-16 text-center">
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-chess-dark mb-6">Choose Your Rival</h1>
					<p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
						Prepare for your next intellectual pursuit. Select between digital precision or human ingenuity.
					</p>
				</header>

				<div className="grid md:grid-cols-2 gap-8 items-stretch">
					<motion.section
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col"
					>
						<div className="mb-10">
							<div className="w-14 h-14 bg-chess-green-10 rounded-2xl flex items-center justify-center mb-8">
								<Cpu className="w-8 h-8 text-chess-green" />
							</div>
							<h2 className="text-2xl font-bold text-slate-900 mb-3">Challenge Stockfish</h2>
							<p className="text-slate-500 leading-relaxed">Test your skills against the world's strongest engine.</p>
						</div>

						<div className="mt-auto">
							<label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Select Difficulty Level</label>
							<div className="grid grid-cols-4 gap-3">
								{[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
									<button
										key={level}
										onClick={() => setDifficulty(level)}
										className={`h-12 w-full flex items-center justify-center rounded-xl font-bold transition-all transform active:scale-95 border-2 ${
											difficulty === level
												? "bg-chess-dark border-chess-dark text-white"
												: "bg-white border-slate-200 text-slate-400 hover:border-chess-green-40"
										}`}
									>
										{level}
									</button>
								))}
							</div>
							<button
								onClick={handlePlayEngine}
								className="w-full mt-10 bg-signature-gradient text-white font-bold py-5 rounded-2xl shadow-xl shadow-chess-green-20 transition-all hover:opacity-95 active:scale-95"
							>
								Play Engine
							</button>
						</div>
					</motion.section>

					<motion.section
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col relative overflow-hidden"
					>
						<div className="absolute -right-20 -bottom-20 w-64 h-64 bg-chess-green-5 rounded-full blur-3xl" />

						<div className="mb-10 relative z-10">
							<div className="w-14 h-14 bg-chess-green-10 rounded-2xl flex items-center justify-center mb-8">
								<Users className="w-8 h-8 text-chess-green" />
							</div>
							<h2 className="text-2xl font-bold text-slate-900 mb-3">Challenge a Friend</h2>
							<p className="text-slate-500 leading-relaxed">Send a direct link to a friend to start a private game.</p>
						</div>

						<div className="mt-auto relative z-10">
							<div className="mb-6">
								<h3 className="font-bold text-slate-900 mb-2">Create a Private Lobby</h3>
								<p className="text-sm text-slate-500">Generate a unique invite link to send to a friend. The game begins when they join.</p>
							</div>

							<div className="mt-6">
								<button
									onClick={handlePlayFriend}
									disabled={isLoadingFriend}
									className="w-full flex items-center justify-center gap-3 border-hidden bg-signature-gradient text-white shadow-xl shadow-chess-green-20 font-bold py-5 rounded-2xl transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
								>
									<UserPlus className="w-5 h-5" />
									<span>{isLoadingFriend ? "Generating Link..." : "Create Invite Link"}</span>
								</button>
							</div>
						</div>
					</motion.section>
				</div>

				<div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
					{[
						{ value: "12,482", label: "Live Games" },
						{ value: "Stockfish 16", label: "Engine Version" },
						{ value: "0.4s", label: "Avg. Matching" },
					].map((stat, i) => (
						<div key={i} className="flex flex-col items-center p-8 bg-white/50 rounded-3xl border border-slate-100 text-center">
							<span className="text-3xl font-extrabold text-chess-dark mb-2 tracking-tight">{stat.value}</span>
							<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
};

export default function SelectionPage() {
	return (
		<RivalSelection
			onBack={() => {
				window.location.href = "/";
			}}
			onSelectOpponent={() => {
				window.location.href = "/";
			}}
		/>
	);
}
