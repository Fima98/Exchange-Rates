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
        const result = await response.json()

        if (response.ok) {
            document.getElementById('result').innerHTML = `
                <p>${amount} ${fromCurrency} is equivalent to ${result.converted_amount.toFixed(2)} ${toCurrency}</p>
            `;
        } else {
            document.getElementById('result').innerHTML = `
                <p>Error: ${result.ERROR || result.error}</p>
            `;
        }
        

    } catch (error) {
        document.getElementById('result').innerHTML = `
        <p>Error: ${error.message}</p>
        `;
    }
})