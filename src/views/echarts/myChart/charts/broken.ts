export function drawAxis(this: any) {
	const defaultConfig = this.defaultConfig;
	const ctx = this.ctx;
	const pad = defaultConfig.padding;
	const bottomPad = 30; // x轴距离底部距离
	const wd = defaultConfig.wd;
	const ht = defaultConfig.ht;
	const data = defaultConfig.data;

	ctx.save();
	// 绘制坐标系
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = defaultConfig.styles.borderColor;
	ctx.moveTo(pad, pad);
	ctx.lineTo(pad, ht - bottomPad);
	ctx.lineTo(wd - pad, ht - bottomPad);
	ctx.stroke();
	ctx.closePath();
	// 绘制y坐标箭头
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = defaultConfig.styles.lineColor;
	ctx.fillStyle = defaultConfig.styles.lineColor;
	ctx.moveTo(pad - 5, pad);
	ctx.lineTo(pad + 5, pad);
	ctx.lineTo(pad, pad - 5);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	// 绘制x坐标箭头
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = defaultConfig.styles.lineColor;
	ctx.fillStyle = defaultConfig.styles.lineColor;
	ctx.moveTo(wd - pad, ht - bottomPad - 5);
	ctx.lineTo(wd - pad, ht - bottomPad + 5);
	ctx.lineTo(wd - pad + 5, ht - bottomPad);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	// 绘制文字刻度
	for (let i = 0; i < data.length; i++) {
		ctx.beginPath();
		ctx.fillStyle = "#333";
		ctx.textAlign = "center";
		ctx.font = defaultConfig.fontSize + " Microsoft YaHei";
		ctx.fillText(data[i].xVal, i * (defaultConfig.wid / data.length) + defaultConfig.startX, ht - 10);
		ctx.closePath();
	}
	ctx.restore();
}

export function drawPoint(this: any, percent: number) {
	const defaultConfig = this.defaultConfig;
	const ctx = this.ctx;
	const data = defaultConfig.data;
	const len = data.length;
	const ht = defaultConfig.ht;
	ctx.save();
	ctx.lineWidth = 2;
	for (let i = 0; i < len; i++) {
		const yVal = (data[i].yVal as number) * percent;
		const tranY = ht - ht * (yVal / defaultConfig.maxPoint) - 30;
		const tranX = i * (defaultConfig.wid / len) + defaultConfig.startX;
		// 绘制图形
		ctx.beginPath();
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 3;
		ctx.shadowColor = defaultConfig.styles.pointColor;
		ctx.fillStyle = defaultConfig.styles.pointColor;
		ctx.strokeStyle = "#fff";
		ctx.arc(tranX, tranY, 6, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		// 绘制圆形对应的数值
		ctx.beginPath();
		ctx.shadowBlur = 0;
		ctx.fillStyle = "#333";
		ctx.textAlign = "center";
		ctx.font = defaultConfig.fontSize + " MicroSoft YaHei";
		ctx.fillText(yVal, tranX, tranY - 10);
		ctx.closePath();
	}
	ctx.restore();
}

export function drawBrokenLine(this: any, percent: number) {
	const defaultConfig = this.defaultConfig;
	const ctx = this.ctx;
	const bottomPad = 30;
	const data = defaultConfig.data;
	const ht = defaultConfig.ht;
	const maxPoint = defaultConfig.maxPoint;
	const len = data.length - 1;
	const stepDots = Math.floor(percent * len);

	ctx.save();
	// 绘制线条
	ctx.beginPath();
	ctx.setLineDash([4, 4]); // 虚线[虚线长， 虚线间距]
	ctx.lineWidth = defaultConfig.lineWidth;
	ctx.strokeStyle = defaultConfig.styles.lineColor;
	for (let i = 0; i < len; i++) {
		// 起点
		const yVal = data[i].yVal;
		const axisY = ht - ht * (yVal / maxPoint) - bottomPad;
		const bettwenSpace = defaultConfig.wid / data.length;
		const axisX = i * bettwenSpace + defaultConfig.startX;
		// 终点
		let axisEndX = (i + 1) * bettwenSpace + defaultConfig.startX;
		let axisEndY = ht - (ht * data[i + 1].yVal) / maxPoint - bottomPad;
		if (i <= stepDots) {
			if (i === stepDots) {
				axisEndX = (axisEndX - axisX) * percent + axisX;
				axisEndY = (axisEndY - axisY) * percent + axisY;
			}
			ctx.moveTo(axisX, axisY);
			ctx.lineTo(axisEndX, axisEndY);
		}
	}
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

export function drawDashLine(this: any, percent: number) {
	const defaultConfig = this.defaultConfig;
	const ctx = this.ctx;
	const bottomPad = 30;
	const data = defaultConfig.data;
	const ht = defaultConfig.ht;
	const maxPoint = defaultConfig.maxPoint;
	const len = data.length;
	ctx.save();
	for (let i = 0; i < len; i++) {
		const betweenSpace = defaultConfig.wid / data.length;
		let axisX = i * betweenSpace + defaultConfig.startX;
		let axisY = ht - ((ht * data[i].yVal) / maxPoint) * percent - bottomPad;
		// 开始绘制
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.setLineDash([4, 4]);
		ctx.strokeStyle = "#d6d6d6";
		ctx.moveTo(axisX, ht - bottomPad);
		ctx.lineTo(axisX, axisY);
		ctx.stroke();
		ctx.closePath();
	}
	ctx.restore();
}
