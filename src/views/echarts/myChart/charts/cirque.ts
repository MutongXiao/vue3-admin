const Cirque = function (this: any, percent: number) {
	const ctx = this.ctx;
	const circleConfig = this.circleConfig;
	// 绘制打底圆环
	ctx.beginPath();
	ctx.lineWidth = circleConfig.arcWidth; // 线宽
	// createLinearGradient() 方法创建放射状/圆形渐变对象。
	// 渐变可用于填充矩形、圆形、线条、文本等等。
	const grd = ctx.createRadialGradient(
		circleConfig.x,
		circleConfig.y,
		circleConfig.radius - 10,
		circleConfig.x,
		circleConfig.y,
		circleConfig.radius + 10
	);
	// 渐变范围对应的渐变色
	grd.addColorStop(0, "#e9eae9");
	grd.addColorStop(0.8, "#fefefe");
	grd.addColorStop(1, "#e9eae9");
	// 应用径向样式
	ctx.strokeStyle = grd;
	// 绘制
	ctx.arc(circleConfig.x, circleConfig.y, circleConfig.radius, circleConfig.startAngle, circleConfig.endAngle);
	ctx.stroke();
	ctx.closePath();

	// 绘制进度圆环
	ctx.beginPath();
	ctx.lineWidth = circleConfig.arcWidth;
	//线性渐变配置
	const linear = ctx.createLinearGradient(220, 220, 380, 200);
	linear.addColorStop(0, "#ffc26b");
	linear.addColorStop(0.5, "#ff9a5f");
	linear.addColorStop(1, "#ff8157");
	// 应用线性渐变
	ctx.strokeStyle = linear;
	// 园
	ctx.arc(circleConfig.x, circleConfig.y, circleConfig.radius, circleConfig.startAngle, circleConfig.endAngle * percent);
	// 绘制
	ctx.stroke();
	ctx.closePath();

	// 起点的圆形
	ctx.beginPath();
	ctx.fillStyle = "#ff7854"; // 填充样式
	ctx.arc(
		circleConfig.x + circleConfig.radius,
		circleConfig.y - 1,
		circleConfig.arcWidth / 2, // 半径
		circleConfig.startAngle,
		circleConfig.endAngle
	);
	ctx.fill();
	ctx.closePath();

	// 终点的圆形
	ctx.beginPath();
	ctx.lineWidth = circleConfig.arcWidth - 10;
	ctx.fillStyle = "#fff"; // 填充色
	ctx.strokeStyle = "#ff7854"; // 描边色
	const tarX = circleConfig.x + circleConfig.radius * Math.cos(2 * Math.PI * percent);
	const tarY = circleConfig.y + circleConfig.radius * Math.sin(2 * Math.PI * percent);
	ctx.arc(tarX, tarY, circleConfig.arcWidth - 8, circleConfig.startAngle, circleConfig.endAngle);
	ctx.fill(); // 先填充在描边
	ctx.stroke();
	ctx.closePath();
};

export default Cirque;
