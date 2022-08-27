export function drawHistogram(this: any, percent: number) {
	const defaultConfig = this.defaultConfig;
	const ctx = this.ctx;
	const bottomPad = 30;
	const data = defaultConfig.data;
	const ht = defaultConfig.ht;
	const maxPoint = defaultConfig.maxPoint;
	const len = data.length;
	const rectHeight = this._canvas.height - bottomPad;
	for (let i = 0; i < len; i++) {
		const yVal = data[i].yVal * percent;
		const axisY = ht - ht * (yVal / maxPoint) - bottomPad;
		const bettwenSpace = defaultConfig.wid / data.length;
		const axisX = i * bettwenSpace + defaultConfig.startX;
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = defaultConfig.hisColor[i];
		ctx.fillRect(axisX - 15, axisY, 30, rectHeight - axisY);
		ctx.closePath();
		ctx.restore();
	}
}
