// provide/inject可以实现任意组件之间都能通信，并且也不麻烦。父传子，父调子，兄弟间通信，
// provide/inject 在非组件中，就没法用了
// mitt基于事件总线的订阅发布模式，任意组件和非组件之间都可以通信
import mitt from "mitt";

export const mittBus = mitt();

export const OPEN_THEMEDRAWER = "openThemeDrawer";
