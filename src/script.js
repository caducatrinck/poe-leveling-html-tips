function startScript() {
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999';

    const promptContainer = document.createElement('div');
    promptContainer.style = 'background:black;color:white;padding:20px;border-radius:10px;text-align:center;width:300px;box-shadow:0 4px 8px rgba(0,0,0,0.1)';

    const message = document.createElement('p');
    message.textContent = 'Deseja remover todas as dicas que não tem relação com Gemas?';

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Sim';
    yesButton.style = 'background:#4CAF50;color:white;border:none;padding:10px 20px;margin-right:10px;border-radius:5px;cursor:pointer';

    const noButton = document.createElement('button');
    noButton.textContent = 'Não';
    noButton.style = 'background:#f44336;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer';

    yesButton.onclick = () => {
        removeTipsWithoutGems();
        document.body.removeChild(overlay);
        showLoader();
        continueProcess();
    };
    noButton.onclick = () => {
        document.body.removeChild(overlay);
        showLoader();
        continueProcess();
    };

    promptContainer.append(message, yesButton, noButton);
    overlay.appendChild(promptContainer);
    document.body.appendChild(overlay);
}

function showLoader() {
    const loaderOverlay = document.createElement('div');
    loaderOverlay.id = 'loaderOverlay';
    loaderOverlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999';

    const spinner = document.createElement('div');
    spinner.style = 'border:4px solid rgba(255,255,255,0.3);border-top:4px solid white;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite';

    const text = document.createElement('p');
    text.textContent = 'Salvando a página';
    text.style = 'color:white;margin-top:10px';

    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    loaderOverlay.append(spinner, text);
    document.body.appendChild(loaderOverlay);
}

function removeLoader() {
    const loaderOverlay = document.getElementById('loaderOverlay');
    if (loaderOverlay) {
        document.body.removeChild(loaderOverlay);
    }
}

function removeTipsWithoutGems() {
    document.querySelectorAll('li').forEach(item => {
        if (!item.querySelector('span.text-gem-poe')) item.remove();
    });
}

function removeUnusedComponents() {
    const blockedWords = ["general", "leveling"];
    document.querySelectorAll('div.bg-poe-y').forEach(div => {
        const text = `${div.querySelector('h1')?.textContent?.toLowerCase() || ''} ${div.querySelector('h2')?.textContent?.toLowerCase() || ''}`;
        if (blockedWords.some(word => text.includes(word)) || div.querySelectorAll('ul li').length === 0) div.remove();
        div.querySelectorAll('div').forEach(internalDiv => {
            if (internalDiv.querySelector('h3')?.textContent?.toLowerCase().includes("tips")) internalDiv.remove();
        });
    });
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.toLowerCase().includes("view acts")) button.remove();
    });
}

function convertAndSaveHTMLPage() {
    const images = document.querySelectorAll('img');
    let processedImages = 0;

    if (images.length === 0) {
        savePage();
        return;
    }

    images.forEach(img => {
        if (img.src.startsWith('data:')) {
            if (++processedImages === images.length) savePage();
            return;
        }
        fetch(img.src).then(response => response.blob()).then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                img.src = reader.result;
                if (++processedImages === images.length) savePage();
            };
            reader.readAsDataURL(blob);
        });
    });
}

function savePage() {
    removeLoader();

    const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Leveling.html';
    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function continueProcess() {
    removeUnusedComponents();
    convertAndSaveHTMLPage();
}

(function () {
    startScript();
})();
