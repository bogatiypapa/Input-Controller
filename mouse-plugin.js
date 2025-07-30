class MousePlugin {
    constructor() {
        this.pressedButtons = new Set();
        this.controller = null;
    }

    init(controller) {
        this.controller = controller;
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e) {
        this.pressedButtons.add(e.button);
    }

    handleMouseUp(e) {
        this.pressedButtons.delete(e.button);
    }

    isActionActive(actionName) {
        const action = this.controller.actionsToBind[actionName];
        if (!action?.buttons) return false;
        return action.buttons.some(btn => this.pressedButtons.has(btn));
    }

    enable() {
        this.pressedButtons.clear();
    }

    disable() {
        this.pressedButtons.clear();
    }
}