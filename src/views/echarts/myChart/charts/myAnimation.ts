type Param = {
	percent: number; // 动画总长
	animatStep: number; // 动画步长
	render: (current: number) => void;
	success?: () => void;
};
export default function myAnimation(this: any, param: Param) {
	let current = 0;
	let looped: number | null = null;
	const ctx = this.ctx;
	const _canvas = this._canvas;
	const callback = param.render;
	const successCb = param.success;
	(function looping() {
		looped = requestAnimationFrame(looping);
		if (current < param.percent) {
			ctx.clearRect(0, 0, _canvas.width, _canvas.height);
			current = current + param.animatStep > param.percent ? param.percent : current + param.animatStep;
			callback(current);
		} else {
			window.cancelAnimationFrame(looped);
			looped = null;
			successCb && successCb();
		}
	})();
}
