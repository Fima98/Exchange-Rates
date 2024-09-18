document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('conversion-form');
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('.icon');
    const deleteButton = document.getElementById('delete-button');
    const resultDiv = document.getElementById('result');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = document.getElementById('amount').value.trim();
        const fromCurrency = document.getElementById('from_currency').value.trim().toUpperCase();
        const toCurrency = document.getElementById('to_currency').value.trim().toUpperCase();

        if (!amount || !fromCurrency || !toCurrency) {
            return; 
        }

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ amount, from_currency: fromCurrency, to_currency: toCurrency })
            });

            const data = await response.json();

            if (response.ok) {
                displayResult(amount, fromCurrency, toCurrency, data.converted_amount);
                saveToLocalStorage(amount, fromCurrency, toCurrency, data.converted_amount);
                updateHistory();
            } else {
                console.error(data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });

    icon.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    document.getElementById('close-sidebar').addEventListener('click', () => {
        sidebar.classList.remove('show');
    });

    deleteButton.addEventListener('click', () => {
        clearHistory();
    });

    window.onload = updateHistory;

    function displayResult(amount, fromCurrency, toCurrency, convertedAmount) {
        resultDiv.innerHTML = `<p>${amount} ${fromCurrency} is equivalent to ${convertedAmount.toFixed(2)} ${toCurrency}</p>`;
    }

    function saveToLocalStorage(amount, fromCurrency, toCurrency, convertedAmount) {
        const timestamp = Date.now();
        const conversionData = { amount, fromCurrency, toCurrency, convertedAmount, timestamp };
        localStorage.setItem(`conversion_${timestamp}`, JSON.stringify(conversionData));
    }

    function updateHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        const conversions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('conversion_')) {
                conversions.push(JSON.parse(localStorage.getItem(key)));
            }
        }

        conversions.sort((a, b) => b.timestamp - a.timestamp);

        conversions.forEach(conversion => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${conversion.amount} ${conversion.fromCurrency}</strong> to <strong>${conversion.convertedAmount} ${conversion.toCurrency}</strong>`;
            historyList.appendChild(listItem);
        });
    }

    function clearHistory() {
        localStorage.clear();
        updateHistory();
    }
});
