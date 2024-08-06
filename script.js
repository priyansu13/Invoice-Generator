document.getElementById('invoice-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const logoUrl = document.getElementById('company-logo').value;
    const companyName = document.getElementById('your-company').value;
    const companyAddress = document.getElementById('your-address').value;
    const companyContact = document.getElementById('your-contact').value;
    const companyGSTIN = document.getElementById('your-gstin').value;

    const clientCompany = document.getElementById('client-company').value;
    const clientAddress = document.getElementById('client-address').value;
    const clientContact = document.getElementById('client-contact').value;
    const clientGSTIN = document.getElementById('client-gstin').value;

    const invoiceNumber = document.getElementById('invoice-number').value;
    const invoiceDate = document.getElementById('invoice-date').value;
    const dueDate = document.getElementById('due-date').value;

    const gstPercentage = parseFloat(document.getElementById('gst-percentage').value) || 0;

    const items = Array.from(document.querySelectorAll('.item-row')).map(row => {
        return {
            description: row.querySelector('.item-description').value,
            hsnSac: row.querySelector('.hsn-sac').value,
            qty: parseFloat(row.querySelector('.qty').value) || 0,
            rate: parseFloat(row.querySelector('.rate').value) || 0,
            amount: parseFloat(row.querySelector('.amount').value) || 0
        };
    });

    let subTotal = 0;
    items.forEach(item => {
        subTotal += item.amount;
    });

    const gstAmount = subTotal * (gstPercentage / 100);
    const total = subTotal + gstAmount;

    document.getElementById('invoice-logo').src = logoUrl;

    document.getElementById('company-details').innerHTML = `
        <strong>${companyName}</strong><br>
        ${companyAddress}<br>
        Contact: ${companyContact}<br>
        GSTIN: ${companyGSTIN}
    `;

    document.getElementById('client-details').innerHTML = `
        <strong>Bill To:</strong><br>
        ${clientCompany}<br>
        ${clientAddress}<br>
        Contact: ${clientContact}<br>
        GSTIN: ${clientGSTIN}
    `;

    document.getElementById('invoice-details').innerHTML = `
        <strong>Invoice#:</strong> ${invoiceNumber}<br>
        <strong>Invoice Date:</strong> ${invoiceDate}<br>
        <strong>Due Date:</strong> ${dueDate}
    `;

    const itemDetails = items.map(item => `
        <tr>
            <td>${item.description}</td>
            <td>${item.hsnSac}</td>
            <td>${item.qty}</td>
            <td>${item.rate.toFixed(2)}</td>
            <td>${item.amount.toFixed(2)}</td>
        </tr>
    `).join('');

    document.getElementById('item-details').innerHTML = itemDetails;

    document.getElementById('summary-sub-total').innerText = subTotal.toFixed(2);
    document.getElementById('summary-tax').innerText = gstAmount.toFixed(2);
    document.getElementById('summary-total').innerText = total.toFixed(2);

    document.getElementById('invoice').style.display = 'block';
});

document.getElementById('add-item').addEventListener('click', function() {
    const itemRow = `
        <div class="item-row">
            <div class="form-group">
                <label for="item-description">Description</label>
                <input type="text" class="item-description" required>
            </div>
            <div class="form-group">
                <label for="hsn-sac">HSN/SAC</label>
                <input type="text" class="hsn-sac" required>
            </div>
            <div class="form-group">
                <label for="qty">Qty</label>
                <input type="number" class="qty" required>
            </div>
            <div class="form-group">
                <label for="rate">Rate</label>
                <input type="number" class="rate" required>
            </div>
            <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" class="amount" readonly>
            </div>
        </div>
    `;

    document.getElementById('item-rows').insertAdjacentHTML('beforeend', itemRow);
});

document.addEventListener('input', function(event) {
    if (event.target.classList.contains('qty') || event.target.classList.contains('rate')) {
        const row = event.target.closest('.item-row');
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const amount = qty * rate;
        row.querySelector('.amount').value = amount.toFixed(2);
    }
});

document.getElementById('print-button').addEventListener('click', function() {
    const printWindow = window.open('', '', 'height=800,width=600');
    const invoiceContent = document.querySelector('.invoice').outerHTML;
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(invoiceContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});
