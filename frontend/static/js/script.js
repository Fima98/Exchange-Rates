document.getElementById('conversion-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from_currency').value.toUpperCase();
    const toCurrency = document.getElementById('to_currency').value.toUpperCase();

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                amount: amount,
                from_currency: fromCurrency,
                to_currency: toCurrency
            })
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('result').innerHTML = `
                <p>${amount} ${fromCurrency} is equivalent to ${result.converted_amount.toFixed(2)} ${toCurrency}</p>
            `;
            
            const conversionData = {
                amount: amount,
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                convertedAmount: result.converted_amount.toFixed(2),
                timestamp: Date.now() 
            };

            localStorage.setItem(`conversion_${conversionData.timestamp}`, JSON.stringify(conversionData));
            updateHistory();
        } else {
            console.log('Error:', result.message || 'Unknown error');
        }

    } catch (error) {
        console.log('Fetch error:', error);
    }
});

document.getElementById('delete-button').addEventListener('click', function (event) {
    event.preventDefault();
    clearHistory();
});

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    const conversions = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('conversion_')) {
            const conversion = JSON.parse(localStorage.getItem(key));
            conversions.push(conversion);
        }
    }

    conversions.sort((a, b) => b.timestamp - a.timestamp);

    conversions.forEach(conversion => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${conversion.amount} ${conversion.fromCurrency}</strong> 
            to <strong>${conversion.convertedAmount} ${conversion.toCurrency}</strong>
        `;
        historyList.appendChild(listItem);
    });
}

function clearHistory() {
    localStorage.clear(); 
    updateHistory(); 
}

window.onload = updateHistory;
