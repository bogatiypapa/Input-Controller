class KeyboardPlugin {
    constructor() {
        this.pressedKeys = new Set();
        this.controller = null;
    }

    init(controller) {
        this.controller = controller;
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(e) {
        if (this.pressedKeys.has(e.code)) return;
        this.pressedKeys.add(e.code);
    }

    handleKeyUp(e) {
        this.pressedKeys.delete(e.code);
    }

    isActionActive(actionName) {
        const action = this.controller.actionsToBind[actionName];
        if (!action?.keys) return false;
        return action.keys.some(key => this.pressedKeys.has(key));
    }

    enable() {
        this.pressedKeys.clear();
    }

    disable() {
        this.pressedKeys.clear();
    }
}