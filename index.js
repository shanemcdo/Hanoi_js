function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let disks_slider;
let sleep_slider;

class Hanoi {
	moves = 0
	cancelled = false;

	constructor(disks) {
		this.disks = disks;
		this.towers = [ [], [], [] ];
		for(let i = disks; i > 0; i--) {
			this.towers[0].push(i);
		};
	}

	async move(from, to, temp, count) {
		if(count === 0 || this.cancelled) return;
		await this.move(from, temp, to, count - 1);
		this.towers[to].push(this.towers[from].pop());
		this.draw();
		await sleep(sleep_slider.value());
		await this.move(temp, to, from, count - 1);
	}

	draw() {
		if(this.cancelled) return;
		background('white');
		const baseWidth = windowWidth / 3 * 0.8;
		const height = windowHeight / this.disks * 0.8;
		for(let i = 0; i < 3; i++) {
			for(let j = 0; j < this.towers[i].length; j++) { 
				fill(360 / this.disks * (this.towers[i][j] - 1), 100, 100);
				rect(
					windowWidth * i / 3 + windowWidth / 6,
					windowHeight - height / 2 - height * j,
					baseWidth * this.towers[i][j] / this.disks,
					height 
				);
			}
		}
	}
}

let hanoi = new Hanoi(3);

function setup() {
	createCanvas(windowWidth, windowHeight);
	createP('Disks').position(10, 5);
	const disks_counter = createP('3').position(120, 5);
	disks_slider = createSlider(3, 20, 3).position(10, 20);
	disks_slider.elt.onchange = () => {
		hanoi.cancelled = true;
		hanoi = new Hanoi(disks_slider.value());
		hanoi.draw();
		disks_counter.elt.innerText = disks_slider.value();
	};
	createP('Sleep').position(10, 40);
	const sleep_counter = createP('200 ms').position(100, 40);
	sleep_slider = createSlider(50, 3000, 200).position(10, 55);
	sleep_slider.elt.onchange = () => {
		sleep_counter.elt.innerText = `${sleep_slider.value()} ms`;
	};
	const button = createButton('Run').position(10, 80);
	button.mousePressed(move);
	rectMode(CENTER);
	colorMode(HSB);
	hanoi.draw();
}

async function move() {
	hanoi.cancelled = true;
	const disks = disks_slider.value();
	hanoi = new Hanoi(disks);
	await hanoi.move(0, 2, 1, disks);
}
