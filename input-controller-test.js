document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById('target');
    
    const actions = {
        'move-left': { keys: ['KeyA', 'ArrowLeft'], buttons: [], enabled: true },
        'move-right': { keys: ['KeyD', 'ArrowRight'], buttons: [], enabled: true },
        'jump': { keys: ['Space'], buttons: [0], enabled: true } // 0 - левая кнопка мыши
    };

    const controller = new InputController(actions, target);

    controller.addPlugin(new KeyboardPlugin());
    controller.addPlugin(new MousePlugin());
    

    controller.enable();

  
    target.addEventListener('input-controller:action-activated', (e) => {
        console.log(`Action activated: ${e.detail.actionName}`);
        
        switch(e.detail.actionName) {
            case 'move-left':
                target.style.transform = 'translateX(-10px)';
                break;
            case 'move-right':
                target.style.transform = 'translateX(10px)';
                break;
            case 'jump':
                target.style.backgroundColor = 'lightblue';
                break;
        }
    });

    target.addEventListener('input-controller:action-deactivated', (e) => {
        console.log(`Action deactivated: ${e.detail.actionName}`);
        
        if (e.detail.actionName === 'jump') {
            target.style.backgroundColor = '';
        }
    });
});