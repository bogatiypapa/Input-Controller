class InputController {
    constructor(actionsToBind, target) {
        this.actionsToBind = actionsToBind || {};
        this.target = target || document;
        this.enabled = false;
        this.plugins = [];
        this._actionStates = new Map(); // Хранит {actionName: {isActive, wasHandled}}
        this.updateLoopId = null;

        // Автопривязка методов
        this.startUpdateLoop = this.startUpdateLoop.bind(this);
        this.stopUpdateLoop = this.stopUpdateLoop.bind(this);
    }

    addPlugin(plugin) {
        plugin.init(this);
        this.plugins.push(plugin);
        if (this.enabled) plugin.enable();
    }

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        this.plugins.forEach(p => p.enable());
        this.startUpdateLoop();
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        this.plugins.forEach(p => p.disable());
        this.stopUpdateLoop();
    }

    startUpdateLoop() {
        if (this.updateLoopId) return;

        const update = () => {
            this.updateState();
            if (this.enabled) {
                this.updateLoopId = requestAnimationFrame(update);
            }
        };

        this.updateLoopId = requestAnimationFrame(update);
    }

    stopUpdateLoop() {
        if (this.updateLoopId) {
            cancelAnimationFrame(this.updateLoopId);
            this.updateLoopId = null;
        }
    }

    updateState() {
        if (!this.enabled) return;

        Object.entries(this.actionsToBind).forEach(([actionName, actionData]) => {
            if (!actionData.enabled) return;

            // Инициализация состояния для нового экшена
            if (!this._actionStates.has(actionName)) {
                this._actionStates.set(actionName, { isActive: false, wasHandled: true });
            }

            const state = this._actionStates.get(actionName);
            const isActive = this.plugins.some(p => p.isActionActive(actionName));

            // Обнаружение изменения состояния
            if (isActive !== state.isActive) {
                state.isActive = isActive;
                state.wasHandled = false;
            }

            // Генерация событий только при изменении
            if (!state.wasHandled) {
                const eventType = isActive ? 
                    'input-controller:action-activated' : 
                    'input-controller:action-deactivated';
                
                this.target.dispatchEvent(new CustomEvent(eventType, {
                    detail: { actionName, controller: this }
                }));

                state.wasHandled = true;
            }
        });
    }

    bindActions(newActions) {
        Object.assign(this.actionsToBind, newActions);
    }
}



