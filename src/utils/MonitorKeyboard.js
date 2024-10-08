/**
 * @class 监听虚拟键盘
 * @classdesc 监听虚拟键盘弹出隐藏
 * @public onEnd 结束监听虚拟键盘
 * @public onShow 传递一个回调 监听虚拟键盘弹出
 * @public onHidden 传递一个回调 监听虚拟键盘隐藏
 */
class MonitorKeyboard {
    

    constructor() {
        this.type = this.IsIA();
        this.originalHeight = window.innerHeight;
        this.keyboardHeight = 0;
    }

    /**
     *  @function IsIA 获取设备类型
     *  @param  1 Android 2 iOS  
     */
    IsIA = () => {
        const userAgent = typeof window === 'object' ? window.navigator.userAgent : '';
        if (/android/i.test(userAgent)) {
            return 1;
        } else if (/iPhone|iPod|iPad/i.test(userAgent)) {
            return 2;
        }
    }

    // Android系统
    onResize = () => {
        const resizeHeight = window.innerHeight;
        this.keyboardHeight = this.originalHeight - resizeHeight;

        if (this.keyboardHeight > 50) {
            this.show('Android系统: 软键盘弹出');
        } else {
            this.hidden('Android系统: 软键盘收起');
        }
    }

    // iOS获取焦点
    onFocusin = () => {
        this.show('iOS系统:软键盘弹出');
    }

    // iOS失去焦点
    onFocusout = () => {
        this.hidden('iOS系统:软键盘收起');
    }

    /**  
     * @function onStart 开始监听虚拟键盘  
     */
    onStart = () => {
        if (this.type == 1) {
            window.addEventListener('resize', this.onResize);
        }
        if (this.type == 2) {
            window.addEventListener('resize', this.onFocusin);
            window.addEventListener('focusout', this.onFocusout);
        }
    }

    /** 
     * @function onEnd 结束监听虚拟键盘  
     */
    onEnd = () => {
        if (this.type == 1) {
            window.removeEventListener('resize', this.onResize);
        }
        if (this.type == 2) {
            window.removeEventListener('focusin', this.onFocusin);
            window.removeEventListener('focusout', this.onFocusout);
        }
    }

    /**
     * @function  onShow 传递一个回调函数
     * @param  虚拟键盘弹出时触发
     */
    onShow = (fn) => {
        this.show = fn;
    }

    /**
      * @function  onHidden 传递一个回调函数
      * @param  虚拟键盘隐藏时触发
      */
    onHidden = (fn) => {
        this.hidden = fn;
    }
}

export default MonitorKeyboard
